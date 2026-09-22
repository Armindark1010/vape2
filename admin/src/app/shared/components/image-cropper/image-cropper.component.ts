/* ==========================================================================
   📌 کامپوننت ادیتور و برش هوشمند تصویر (ImageCropperComponent - image-cropper.component.ts)
   ==========================================================================
   💡 این معادل چیه؟
   توی Nuxt 3 این کامپوننت معادل یک مدال اختصاصی کراپ عکس با Canvas است.
   
   قابلیت‌ها در Angular:
   1. آپلود فایل مستقیم از حافظه سیستم یا وارد کردن لینک URL
   2. کادربندی داینامیک و برش با نسبت‌های استاندارد (21:9 هدر، 16:9 عریض، 3:1 نواری، 1:1 مربعی، آزاد)
   3. بزرگ‌نمایی (Zoom)، چرخش (Rotate)، معکوس‌سازی (Flip) و کنترل روشنایی
   4. پیش‌نمایش بلادرنگ (Live Preview) برش نهایی روی کادر بنر
   5. خروجی به صورت Data URL بهینه‌شده جهت ذخیره مستقیم در پایگاه داده
   ========================================================================== */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface CropResult {
  dataUrl: string;
  width: number;
  height: number;
}

@Component({
  selector: 'app-image-cropper',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cropper-backdrop" (click)="cancel.emit()">
      <div class="cropper-modal" (click)="$event.stopPropagation()">
        <!-- هدر ادیتور -->
        <div class="cropper-header">
          <div class="title-wrap">
            <span class="header-icon">✂️</span>
            <div>
              <h3>ویرایش و برش هوشمند تصویر بنر</h3>
              <p>کادر دلخواه خود را تنظیم کرده و زاویه یا سایز بنر را تغییر دهید</p>
            </div>
          </div>
          <button class="btn-close" (click)="cancel.emit()" title="انصراف و بستن">✕</button>
        </div>

        <!-- بدنه ادیتور -->
        <div class="cropper-body">
          <!-- ستون چپ: ابزارهای انتخاب فایل و نسبت ابعاد -->
          <div class="tools-panel">
            <!-- آپلود فایل محلی -->
            <div class="upload-section">
              <label class="upload-btn">
                <span class="icon">📁</span>
                <span>انتخاب عکس از کامپیوتر</span>
                <input type="file" accept="image/*" (change)="onFileSelected($event)" hidden />
              </label>

              <!-- ورودی آدرس اینترنتی -->
              <div class="url-input-wrap">
                <input
                  type="url"
                  [(ngModel)]="urlInput"
                  placeholder="یا آدرس تصویر اینترنتی (URL)..."
                  class="url-input ltr"
                />
                <button type="button" class="btn-load" (click)="loadImageFromUrl(urlInput)">
                  بارگذاری
                </button>
              </div>
            </div>

            <!-- انتخاب نسبت ابعاد (Aspect Ratio) -->
            <div class="ratio-section">
              <label class="section-title">نسبت ابعاد برش (Aspect Ratio):</label>
              <div class="ratio-chips">
                <button
                  type="button"
                  class="chip"
                  [class.active]="selectedRatio() === '21:9'"
                  (click)="setAspectRatio(21 / 9, '21:9')"
                >
                  ۲۱:۹ (هدر کشیده)
                </button>
                <button
                  type="button"
                  class="chip"
                  [class.active]="selectedRatio() === '16:9'"
                  (click)="setAspectRatio(16 / 9, '16:9')"
                >
                  ۱۶:۹ (عریض)
                </button>
                <button
                  type="button"
                  class="chip"
                  [class.active]="selectedRatio() === '3:1'"
                  (click)="setAspectRatio(3 / 1, '3:1')"
                >
                  ۳:۱ (نواری پروموشن)
                </button>
                <button
                  type="button"
                  class="chip"
                  [class.active]="selectedRatio() === '4:3'"
                  (click)="setAspectRatio(4 / 3, '4:3')"
                >
                  ۴:۳ (کارت)
                </button>
                <button
                  type="button"
                  class="chip"
                  [class.active]="selectedRatio() === '1:1'"
                  (click)="setAspectRatio(1 / 1, '1:1')"
                >
                  ۱:۱ (مربع)
                </button>
                <button
                  type="button"
                  class="chip"
                  [class.active]="selectedRatio() === 'free'"
                  (click)="setAspectRatio(null, 'free')"
                >
                  آزاد
                </button>
              </div>
            </div>

            <!-- ابزارهای چرخش و زوم -->
            <div class="transform-section">
              <div class="tool-group">
                <div class="tool-header">
                  <span>بزرگ‌نمایی (Zoom):</span>
                  <span class="font-mono text-vio">{{ zoomLevel() }}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="5"
                  [ngModel]="zoomLevel()"
                  (ngModelChange)="onZoomChange($event)"
                  class="range-slider"
                />
              </div>

              <!-- دکمه‌های چرخش و فلیپ -->
              <div class="action-buttons-row">
                <button type="button" class="btn-tool" (click)="rotate(-90)" title="چرخش ۹۰ درجه چپ">
                  ↺ ۹۰° چپ
                </button>
                <button type="button" class="btn-tool" (click)="rotate(90)" title="چرخش ۹۰ درجه راست">
                  ↻ ۹۰° راست
                </button>
                <button type="button" class="btn-tool" (click)="toggleFlip()" title="آینه‌ای کردن افقی">
                  ⇄ معکوس افقی
                </button>
                <button type="button" class="btn-tool reset" (click)="resetTransforms()" title="بازنشانی">
                  ⟲ ریست
                </button>
              </div>
            </div>

            <!-- پیش‌نمایش کوچک نهایی -->
            <div class="preview-card" *ngIf="previewUrl()">
              <label class="section-title">پیش‌نمایش زنده برش:</label>
              <div class="preview-window">
                <img [src]="previewUrl()" alt="Live Preview" />
                <div class="preview-overlay">
                  <span class="tag">پیش‌نمایش خروجی بنر</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ستون راست: محیط کار Canvas با کادر کراپ داینامیک -->
          <div class="canvas-workspace" #workspaceContainer>
            <div
              class="canvas-wrapper"
              (mousedown)="startDrag($event)"
              (mousemove)="onDrag($event)"
              (mouseup)="stopDrag()"
              (mouseleave)="stopDrag()"
            >
              <canvas #cropCanvas class="editor-canvas"></canvas>

              <!-- لایه کادر برش متحرک (Crop Overlay) -->
              <div
                class="crop-box"
                [style.left.px]="cropRect().x"
                [style.top.px]="cropRect().y"
                [style.width.px]="cropRect().width"
                [style.height.px]="cropRect().height"
              >
                <!-- خطوط راهنمای گرید یک سوم (Rule of Thirds Grid) -->
                <div class="grid-line horizontal-1"></div>
                <div class="grid-line horizontal-2"></div>
                <div class="grid-line vertical-1"></div>
                <div class="grid-line vertical-2"></div>

                <!-- دستگیره‌های تغییر سایز کادر (Resize Handles) -->
                <div class="handle nw" (mousedown)="startResize($event, 'nw')"></div>
                <div class="handle ne" (mousedown)="startResize($event, 'ne')"></div>
                <div class="handle sw" (mousedown)="startResize($event, 'sw')"></div>
                <div class="handle se" (mousedown)="startResize($event, 'se')"></div>
              </div>
            </div>
            <p class="hint-text">💡 کادر برش را با ماوس جابه‌جا کرده یا گوشه‌ها را بکشید تا اندازه کادر تنظیم شود.</p>
          </div>
        </div>

        <!-- فوتر با دکمه اعمال برش -->
        <div class="cropper-footer">
          <button type="button" class="btn-cancel" (click)="cancel.emit()">انصراف</button>
          <button type="button" class="btn-apply" (click)="applyCrop()">
            <span>✓ تایید و اعمال عکس برش‌خورده</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cropper-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(12px);
      z-index: 200;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      animation: fadeIn 0.2s ease;
    }

    .cropper-modal {
      background: #111319;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: var(--radius-xl);
      width: 100%;
      max-width: 1080px;
      max-height: 94vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9);
      overflow: hidden;
      animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleUp { from { transform: scale(0.95); } to { transform: scale(1); } }

    .cropper-header {
      padding: 1.2rem 1.6rem;
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(255, 255, 255, 0.02);

      .title-wrap {
        display: flex;
        align-items: center;
        gap: 12px;

        .header-icon {
          font-size: 24px;
          background: rgba(167, 139, 250, 0.15);
          color: var(--color-primary);
          padding: 6px;
          border-radius: var(--radius-sm);
        }

        h3 {
          font-size: 17px;
          font-weight: 800;
          color: var(--text-main);
        }

        p {
          font-size: 12px;
          color: var(--text-dim);
          margin-top: 2px;
        }
      }

      .btn-close {
        background: transparent;
        border: none;
        color: var(--text-dim);
        font-size: 20px;
        cursor: pointer;
        padding: 4px;
        &:hover { color: #fff; }
      }
    }

    .cropper-body {
      display: grid;
      grid-template-columns: 320px 1fr;
      flex: 1;
      overflow-y: auto;
      min-height: 480px;

      @media (max-width: 860px) {
        grid-template-columns: 1fr;
      }
    }

    .tools-panel {
      padding: 1.4rem;
      background: rgba(0, 0, 0, 0.25);
      border-left: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      gap: 1.4rem;
      overflow-y: auto;

      .upload-section {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .upload-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: rgba(167, 139, 250, 0.12);
          border: 1px dashed rgba(167, 139, 250, 0.4);
          color: var(--color-primary);
          padding: 0.75rem;
          border-radius: var(--radius-md);
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            background: rgba(167, 139, 250, 0.22);
            border-color: var(--color-primary);
          }
        }

        .url-input-wrap {
          display: flex;
          gap: 6px;

          .url-input {
            flex: 1;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-sm);
            padding: 0.5rem 0.7rem;
            color: var(--text-main);
            font-size: 12px;
          }

          .btn-load {
            background: rgba(255, 255, 255, 0.08);
            color: var(--text-main);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-sm);
            padding: 0 0.8rem;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            &:hover { background: rgba(255, 255, 255, 0.15); }
          }
        }
      }

      .section-title {
        font-size: 12.5px;
        font-weight: 800;
        color: var(--text-main);
        display: block;
        margin-bottom: 8px;
      }

      .ratio-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;

        .chip {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-dim);
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 11.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            background: rgba(255, 255, 255, 0.08);
            color: var(--text-main);
          }

          &.active {
            background: rgba(167, 139, 250, 0.2);
            color: var(--color-primary);
            border-color: rgba(167, 139, 250, 0.45);
          }
        }
      }

      .transform-section {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .tool-header {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-dim);
          margin-bottom: 4px;
        }

        .range-slider {
          width: 100%;
          accent-color: var(--color-primary);
          cursor: pointer;
        }

        .action-buttons-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;

          .btn-tool {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid var(--border-subtle);
            color: var(--text-dim);
            padding: 0.45rem;
            border-radius: var(--radius-sm);
            font-size: 11.5px;
            font-weight: 700;
            cursor: pointer;
            &:hover {
              background: rgba(255, 255, 255, 0.1);
              color: var(--text-main);
            }
            &.reset {
              color: var(--color-blush);
              border-color: rgba(244, 63, 94, 0.2);
            }
          }
        }
      }

      .preview-card {
        margin-top: auto;
        .preview-window {
          position: relative;
          height: 90px;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #000;
          border: 1px solid var(--border-subtle);

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .preview-overlay {
            position: absolute;
            bottom: 4px;
            right: 4px;
            .tag {
              background: rgba(0, 0, 0, 0.7);
              color: var(--color-primary);
              font-size: 9.5px;
              font-weight: 800;
              padding: 2px 6px;
              border-radius: 4px;
            }
          }
        }
      }
    }

    .canvas-workspace {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #090a0f;
      position: relative;
      overflow: hidden;

      .canvas-wrapper {
        position: relative;
        max-width: 100%;
        max-height: 480px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
        border-radius: var(--radius-md);
        overflow: hidden;
        user-select: none;
        cursor: crosshair;

        .editor-canvas {
          display: block;
          max-width: 100%;
          max-height: 480px;
        }

        .crop-box {
          position: absolute;
          border: 2px solid #38bdf8;
          box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.65), 0 0 15px rgba(56, 189, 248, 0.4);
          cursor: move;
          touch-action: none;

          .grid-line {
            position: absolute;
            background: rgba(255, 255, 255, 0.25);
            pointer-events: none;

            &.horizontal-1 { top: 33.33%; left: 0; right: 0; height: 1px; }
            &.horizontal-2 { top: 66.66%; left: 0; right: 0; height: 1px; }
            &.vertical-1 { left: 33.33%; top: 0; bottom: 0; width: 1px; }
            &.vertical-2 { left: 66.66%; top: 0; bottom: 0; width: 1px; }
          }

          .handle {
            position: absolute;
            width: 14px;
            height: 14px;
            background: #38bdf8;
            border: 2px solid #fff;
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);

            &.nw { top: -7px; left: -7px; cursor: nw-resize; }
            &.ne { top: -7px; right: -7px; cursor: ne-resize; }
            &.sw { bottom: -7px; left: -7px; cursor: sw-resize; }
            &.se { bottom: -7px; right: -7px; cursor: se-resize; }
          }
        }
      }

      .hint-text {
        font-size: 11.5px;
        color: var(--text-dim);
        margin-top: 1rem;
        text-align: center;
      }
    }

    .cropper-footer {
      padding: 1.2rem 1.6rem;
      border-top: 1px solid var(--border-subtle);
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      background: rgba(255, 255, 255, 0.02);

      .btn-cancel {
        background: transparent;
        border: 1px solid var(--border-subtle);
        color: var(--text-dim);
        padding: 0.65rem 1.3rem;
        border-radius: var(--radius-sm);
        font-weight: 700;
        cursor: pointer;
        &:hover { background: rgba(255, 255, 255, 0.06); }
      }

      .btn-apply {
        background: linear-gradient(135deg, #a78bfa, #38bdf8);
        color: #09090b !important;
        font-weight: 900;
        font-size: 13.5px;
        padding: 0.65rem 1.6rem;
        border-radius: var(--radius-sm);
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(167, 139, 250, 0.35);
        transition: all 0.2s;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(167, 139, 250, 0.5);
          filter: brightness(1.08);
        }
      }
    }

    .ltr { direction: ltr; text-align: left; }
    .font-mono { font-family: monospace; }
  `]
})
export class ImageCropperComponent implements AfterViewInit {
  @Input() initialImageUrl = '';
  @Output() cropCompleted = new EventEmitter<CropResult>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild('cropCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('workspaceContainer') workspaceRef!: ElementRef<HTMLDivElement>;

  urlInput = '';
  private image = new Image();

  // سیگنال‌های کنترلی
  readonly zoomLevel = signal<number>(100);
  readonly rotationAngle = signal<number>(0);
  readonly isFlipped = signal<boolean>(false);
  readonly selectedRatio = signal<string>('21:9');
  private targetAspectRatio: number | null = 21 / 9;

  // مختصات کادر برش (x, y, width, height)
  readonly cropRect = signal<{ x: number; y: number; width: number; height: number }>({
    x: 40,
    y: 30,
    width: 320,
    height: 137,
  });

  readonly previewUrl = signal<string>('');

  // حالت‌های Drag & Resize
  private isDragging = false;
  private isResizing = false;
  private resizeHandle = '';
  private dragStartX = 0;
  private dragStartY = 0;
  private initialCropX = 0;
  private initialCropY = 0;
  private initialCropW = 0;
  private initialCropH = 0;

  ngAfterViewInit(): void {
    const src =
      this.initialImageUrl ||
      'https://images.pexels.com/photos/19344605/pexels-photo-19344605.jpeg?auto=compress&cs=tinysrgb&w=1400';
    this.loadImage(src);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.loadImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  loadImageFromUrl(url: string): void {
    if (!url.trim()) return;
    this.loadImage(url.trim());
  }

  loadImage(src: string): void {
    this.image = new Image();
    this.image.crossOrigin = 'anonymous';
    this.image.onload = () => {
      this.resetTransforms();
      this.renderCanvas();
      this.initCropBox();
      this.updatePreview();
    };
    this.image.src = src;
  }

  setAspectRatio(ratio: number | null, label: string): void {
    this.targetAspectRatio = ratio;
    this.selectedRatio.set(label);
    this.adjustCropBoxToRatio();
    this.updatePreview();
  }

  onZoomChange(val: number): void {
    this.zoomLevel.set(val);
    this.renderCanvas();
    this.updatePreview();
  }

  rotate(degrees: number): void {
    this.rotationAngle.update((a) => (a + degrees) % 360);
    this.renderCanvas();
    this.updatePreview();
  }

  toggleFlip(): void {
    this.isFlipped.update((f) => !f);
    this.renderCanvas();
    this.updatePreview();
  }

  resetTransforms(): void {
    this.zoomLevel.set(100);
    this.rotationAngle.set(0);
    this.isFlipped.set(false);
  }

  private renderCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas || !this.image.width) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // اندازه بوم بر اساس ابعاد نمایشگر
    const maxW = 540;
    const maxH = 400;
    const scale = Math.min(maxW / this.image.width, maxH / this.image.height, 1);

    canvas.width = this.image.width * scale;
    canvas.height = this.image.height * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // اعمال چرخش، فلیپ و زوم از مرکز بوم
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((this.rotationAngle() * Math.PI) / 180);
    ctx.scale(
      (this.isFlipped() ? -1 : 1) * (this.zoomLevel() / 100),
      this.zoomLevel() / 100
    );

    ctx.drawImage(
      this.image,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
    );

    ctx.restore();
  }

  private initCropBox(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const w = canvas.width * 0.85;
    const h = this.targetAspectRatio ? w / this.targetAspectRatio : canvas.height * 0.7;

    this.cropRect.set({
      x: Math.max(0, (canvas.width - w) / 2),
      y: Math.max(0, (canvas.height - h) / 2),
      width: Math.min(w, canvas.width),
      height: Math.min(h, canvas.height),
    });
  }

  private adjustCropBoxToRatio(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const current = this.cropRect();
    if (this.targetAspectRatio) {
      let newH = current.width / this.targetAspectRatio;
      let newW = current.width;

      if (newH > canvas.height) {
        newH = canvas.height * 0.9;
        newW = newH * this.targetAspectRatio;
      }

      this.cropRect.set({
        x: Math.min(current.x, canvas.width - newW),
        y: Math.min(current.y, canvas.height - newH),
        width: newW,
        height: newH,
      });
    }
  }

  startDrag(e: MouseEvent): void {
    if (this.isResizing) return;
    this.isDragging = true;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    this.initialCropX = this.cropRect().x;
    this.initialCropY = this.cropRect().y;
  }

  startResize(e: MouseEvent, handle: string): void {
    e.stopPropagation();
    this.isResizing = true;
    this.resizeHandle = handle;
    this.dragStartX = e.clientX;
    this.dragStartY = e.clientY;
    this.initialCropX = this.cropRect().x;
    this.initialCropY = this.cropRect().y;
    this.initialCropW = this.cropRect().width;
    this.initialCropH = this.cropRect().height;
  }

  onDrag(e: MouseEvent): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const dx = e.clientX - this.dragStartX;
    const dy = e.clientY - this.dragStartY;

    if (this.isDragging) {
      const newX = Math.max(0, Math.min(this.initialCropX + dx, canvas.width - this.cropRect().width));
      const newY = Math.max(0, Math.min(this.initialCropY + dy, canvas.height - this.cropRect().height));
      this.cropRect.update((r) => ({ ...r, x: newX, y: newY }));
      this.updatePreview();
    } else if (this.isResizing) {
      let newW = this.initialCropW;
      let newH = this.initialCropH;
      let newX = this.initialCropX;
      let newY = this.initialCropY;

      if (this.resizeHandle.includes('e')) newW = Math.max(60, this.initialCropW + dx);
      if (this.resizeHandle.includes('s')) newH = Math.max(40, this.initialCropH + dy);
      if (this.resizeHandle.includes('w')) {
        newW = Math.max(60, this.initialCropW - dx);
        newX = this.initialCropX + (this.initialCropW - newW);
      }
      if (this.resizeHandle.includes('n')) {
        newH = Math.max(40, this.initialCropH - dy);
        newY = this.initialCropY + (this.initialCropH - newH);
      }

      if (this.targetAspectRatio) {
        newH = newW / this.targetAspectRatio;
      }

      // مرزهای بوم
      newX = Math.max(0, Math.min(newX, canvas.width - newW));
      newY = Math.max(0, Math.min(newY, canvas.height - newH));

      this.cropRect.set({
        x: newX,
        y: newY,
        width: Math.min(newW, canvas.width - newX),
        height: Math.min(newH, canvas.height - newY),
      });
      this.updatePreview();
    }
  }

  stopDrag(): void {
    this.isDragging = false;
    this.isResizing = false;
  }

  private updatePreview(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const rect = this.cropRect();
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = rect.width;
    tempCanvas.height = rect.height;

    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.drawImage(
        canvas,
        rect.x,
        rect.y,
        rect.width,
        rect.height,
        0,
        0,
        rect.width,
        rect.height
      );
      this.previewUrl.set(tempCanvas.toDataURL('image/jpeg', 0.9));
    }
  }

  applyCrop(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const rect = this.cropRect();
    // ساخت خروجی با کیفیت HD بالا
    const exportCanvas = document.createElement('canvas');
    const targetW = 1400;
    const targetH = Math.round(targetW * (rect.height / rect.width));

    exportCanvas.width = targetW;
    exportCanvas.height = targetH;

    const exportCtx = exportCanvas.getContext('2d');
    if (exportCtx) {
      exportCtx.imageSmoothingEnabled = true;
      exportCtx.imageSmoothingQuality = 'high';
      exportCtx.drawImage(
        canvas,
        rect.x,
        rect.y,
        rect.width,
        rect.height,
        0,
        0,
        targetW,
        targetH
      );

      const finalDataUrl = exportCanvas.toDataURL('image/webp', 0.92);
      this.cropCompleted.emit({
        dataUrl: finalDataUrl,
        width: targetW,
        height: targetH,
      });
    }
  }
}
