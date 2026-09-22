<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    initialImage?: string
    aspectRatio?: number // e.g. 16/9, 21/9, 1/1, 0 (free)
    title?: string
  }>(),
  {
    modelValue: false,
    initialImage: '',
    aspectRatio: 21 / 9,
    title: 'ویرایشگر و برش تصویر'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'cropped', dataUrl: string): void
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const previewCanvasRef = ref<HTMLCanvasElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const currentImageSrc = ref<string>('')
const imageElement = ref<HTMLImageElement | null>(null)

// Transform states
const zoom = ref<number>(1)
const rotation = ref<number>(0)
const panX = ref<number>(0)
const panY = ref<number>(0)
const selectedAspect = ref<number>(props.aspectRatio)

// Aspect ratio presets
const aspectRatios = [
  { label: '21:9 (بنر هدر)', value: 21 / 9 },
  { label: '16:9 (عریض)', value: 16 / 9 },
  { label: '3:1 (فوق عریض)', value: 3 / 1 },
  { label: '4:3 (استاندارد)', value: 4 / 3 },
  { label: '1:1 (مربع)', value: 1 / 1 },
  { label: 'آزاد', value: 0 }
]

// Drag / Pan interaction state
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)

function close() {
  emit('update:modelValue', false)
}

function onFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (ev.target?.result) {
        currentImageSrc.value = ev.target.result as string
        loadImage(currentImageSrc.value)
      }
    }
    reader.readAsDataURL(target.files[0])
  }
}

function loadImage(src: string) {
  if (!src) return
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    imageElement.value = img
    // Reset transforms
    zoom.value = 1
    rotation.value = 0
    panX.value = 0
    panY.value = 0
    redraw()
  }
  img.src = src
}

function setAspectRatio(val: number) {
  selectedAspect.value = val
  redraw()
}

function setZoom(val: number) {
  zoom.value = Math.max(0.1, Math.min(3, val))
  redraw()
}

function rotateLeft() {
  rotation.value = (rotation.value - 90) % 360
  redraw()
}

function rotateRight() {
  rotation.value = (rotation.value + 90) % 360
  redraw()
}

function resetCrop() {
  zoom.value = 1
  rotation.value = 0
  panX.value = 0
  panY.value = 0
  redraw()
}

// Mouse / Touch Pan Handlers
function onPointerDown(e: MouseEvent | TouchEvent) {
  isDragging.value = true
  const clientX = 'touches' in e && e.touches.length > 0 ? e.touches[0]?.clientX ?? 0 : (e as MouseEvent).clientX
  const clientY = 'touches' in e && e.touches.length > 0 ? e.touches[0]?.clientY ?? 0 : (e as MouseEvent).clientY
  startX.value = clientX - panX.value
  startY.value = clientY - panY.value
}

function onPointerMove(e: MouseEvent | TouchEvent) {
  if (!isDragging.value) return
  const clientX = 'touches' in e && e.touches.length > 0 ? e.touches[0]?.clientX ?? 0 : (e as MouseEvent).clientX
  const clientY = 'touches' in e && e.touches.length > 0 ? e.touches[0]?.clientY ?? 0 : (e as MouseEvent).clientY
  panX.value = clientX - startX.value
  panY.value = clientY - startY.value
  redraw()
}

function onPointerUp() {
  isDragging.value = false
}

function onWheel(e: WheelEvent) {
  e.preventDefault()
  const delta = e.deltaY * -0.001
  zoom.value = Math.max(0.2, Math.min(3, zoom.value + delta))
  redraw()
}

function redraw() {
  const canvas = canvasRef.value
  const img = imageElement.value
  if (!canvas || !img) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const cw = canvas.width
  const ch = canvas.height

  ctx.clearRect(0, 0, cw, ch)

  // Background pattern/color
  ctx.fillStyle = '#090d16'
  ctx.fillRect(0, 0, cw, ch)

  // Draw image with pan, zoom, rotation around center
  ctx.save()
  ctx.translate(cw / 2 + panX.value, ch / 2 + panY.value)
  ctx.rotate((rotation.value * Math.PI) / 180)
  ctx.scale(zoom.value, zoom.value)

  // Fit image proportionally
  const imgAspect = img.width / img.height
  let drawW = cw * 0.8
  let drawH = drawW / imgAspect
  if (drawH > ch * 0.8) {
    drawH = ch * 0.8
    drawW = drawH * imgAspect
  }

  ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH)
  ctx.restore()

  // Draw Crop Overlay
  drawOverlay(ctx, cw, ch)
}

function getCropBox(cw: number, ch: number) {
  const padding = 24
  const aspect = selectedAspect.value > 0 ? selectedAspect.value : 16 / 9
  let cropW = cw - padding * 2
  let cropH = cropW / aspect

  if (cropH > ch - padding * 2) {
    cropH = ch - padding * 2
    cropW = cropH * aspect
  }

  const cropX = (cw - cropW) / 2
  const cropY = (ch - cropH) / 2

  return { x: cropX, y: cropY, w: cropW, h: cropH }
}

function drawOverlay(ctx: CanvasRenderingContext2D, cw: number, ch: number) {
  const box = getCropBox(cw, ch)

  // Dim outer area
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)'
  ctx.fillRect(0, 0, cw, box.y) // Top
  ctx.fillRect(0, box.y + box.h, cw, ch - (box.y + box.h)) // Bottom
  ctx.fillRect(0, box.y, box.x, box.h) // Left
  ctx.fillRect(box.x + box.w, box.y, cw - (box.x + box.w), box.h) // Right

  // Crop Border
  ctx.strokeStyle = '#00e5ff'
  ctx.lineWidth = 2
  ctx.strokeRect(box.x, box.y, box.w, box.h)

  // Rule of thirds grid lines
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.25)'
  ctx.lineWidth = 1
  ctx.beginPath()
  // Vertical lines
  ctx.moveTo(box.x + box.w / 3, box.y)
  ctx.lineTo(box.x + box.w / 3, box.y + box.h)
  ctx.moveTo(box.x + (box.w * 2) / 3, box.y)
  ctx.lineTo(box.x + (box.w * 2) / 3, box.y + box.h)
  // Horizontal lines
  ctx.moveTo(box.x, box.y + box.h / 3)
  ctx.lineTo(box.x + box.w, box.y + box.h / 3)
  ctx.moveTo(box.x, box.y + (box.h * 2) / 3)
  ctx.lineTo(box.x + box.w, box.y + (box.h * 2) / 3)
  ctx.stroke()

  // Corner Accents
  const cornerSize = 14
  ctx.strokeStyle = '#a855f7'
  ctx.lineWidth = 3
  ctx.beginPath()
  // Top-Left
  ctx.moveTo(box.x, box.y + cornerSize)
  ctx.lineTo(box.x, box.y)
  ctx.lineTo(box.x + cornerSize, box.y)
  // Top-Right
  ctx.moveTo(box.x + box.w - cornerSize, box.y)
  ctx.lineTo(box.x + box.w, box.y)
  ctx.lineTo(box.x + box.w, box.y + cornerSize)
  // Bottom-Left
  ctx.moveTo(box.x, box.y + box.h - cornerSize)
  ctx.lineTo(box.x, box.y + box.h)
  ctx.lineTo(box.x + cornerSize, box.y + box.h)
  // Bottom-Right
  ctx.moveTo(box.x + box.w - cornerSize, box.y + box.h)
  ctx.lineTo(box.x + box.w, box.y + box.h)
  ctx.lineTo(box.x + box.w, box.y + box.h - cornerSize)
  ctx.stroke()
}

function applyCrop() {
  const canvas = canvasRef.value
  const img = imageElement.value
  if (!canvas || !img) return

  const cw = canvas.width
  const ch = canvas.height
  const box = getCropBox(cw, ch)

  // Create an offscreen render canvas
  const outCanvas = document.createElement('canvas')
  // Export high-res banner image (target width 1400px or proportionate)
  const targetW = Math.max(1200, Math.round(box.w * 2))
  const targetH = Math.round(targetW / (box.w / box.h))

  outCanvas.width = targetW
  outCanvas.height = targetH
  const outCtx = outCanvas.getContext('2d')
  if (!outCtx) return

  const scaleFactor = targetW / box.w

  outCtx.save()
  // Match offscreen transform
  outCtx.translate((-box.x + cw / 2 + panX.value) * scaleFactor, (-box.y + ch / 2 + panY.value) * scaleFactor)
  outCtx.rotate((rotation.value * Math.PI) / 180)
  outCtx.scale(zoom.value * scaleFactor, zoom.value * scaleFactor)

  const imgAspect = img.width / img.height
  let drawW = cw * 0.8
  let drawH = drawW / imgAspect
  if (drawH > ch * 0.8) {
    drawH = ch * 0.8
    drawW = drawH * imgAspect
  }

  outCtx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH)
  outCtx.restore()

  const resultDataUrl = outCanvas.toDataURL('image/webp', 0.92)
  emit('cropped', resultDataUrl)
  close()
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      nextTick(() => {
        if (props.initialImage) {
          currentImageSrc.value = props.initialImage
          loadImage(props.initialImage)
        }
      })
    }
  }
)

onMounted(() => {
  if (props.initialImage) {
    currentImageSrc.value = props.initialImage
    loadImage(props.initialImage)
  }
})
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
    <div class="relative w-full max-w-4xl bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
      
      <!-- Header -->
      <div class="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-bold text-white tracking-wide">{{ title }}</h3>
            <p class="text-xs text-slate-400">تنظیم کادر، زوم و چرخش تصویر قبل از ذخیره در دیتابیس</p>
          </div>
        </div>

        <button @click="close" class="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Main Canvas & Controls Body -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
        
        <!-- Upload or Canvas View -->
        <div class="relative w-full bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center min-h-[260px] sm:min-h-[360px] overflow-hidden select-none">
          <canvas
            v-show="currentImageSrc"
            ref="canvasRef"
            width="800"
            height="450"
            class="w-full max-h-[420px] object-contain cursor-grab active:cursor-grabbing touch-none"
            @mousedown="onPointerDown"
            @mousemove="onPointerMove"
            @mouseup="onPointerUp"
            @mouseleave="onPointerUp"
            @touchstart="onPointerDown"
            @touchmove="onPointerMove"
            @touchend="onPointerUp"
            @wheel="onWheel"
          ></canvas>

          <div v-if="!currentImageSrc" class="flex flex-col items-center justify-center p-8 text-center">
            <div class="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p class="text-sm font-semibold text-white mb-1">یک تصویر برای برش و تنظیم انتخاب کنید</p>
            <p class="text-xs text-slate-400 mb-4">پشتیبانی از فرمت‌های WebP, PNG, JPG تا سقف 10MB</p>
            <button
              @click="fileInputRef?.click()"
              class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-xs hover:shadow-lg hover:shadow-cyan-500/25 transition"
            >
              انتخاب فایل تصویر
            </button>
          </div>

          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onFileSelect"
          />
        </div>

        <!-- Aspect Ratios & Tools Toolbar -->
        <div v-if="currentImageSrc" class="flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
          
          <!-- Aspect ratios -->
          <div class="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
            <span class="text-xs text-slate-400 ml-1 shrink-0">نسبت کادر:</span>
            <button
              v-for="aspect in aspectRatios"
              :key="aspect.label"
              @click="setAspectRatio(aspect.value)"
              :class="[
                'px-2.5 py-1 text-xs rounded-lg transition whitespace-nowrap',
                selectedAspect === aspect.value
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-transparent'
              ]"
            >
              {{ aspect.label }}
            </button>
          </div>

          <!-- Zoom & Rotate Actions -->
          <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
            <!-- Zoom slider -->
            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-400">بزرگنمایی:</span>
              <input
                type="range"
                min="0.3"
                max="2.5"
                step="0.05"
                :value="zoom"
                @input="setZoom(Number(($event.target as HTMLInputElement).value))"
                class="w-24 accent-cyan-400 bg-slate-800 cursor-pointer h-1.5 rounded-lg"
              />
            </div>

            <div class="flex items-center gap-1">
              <button
                @click="rotateLeft"
                title="چرخش ۹۰ درجه چپ"
                class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
              <button
                @click="rotateRight"
                title="چرخش ۹۰ درجه راست"
                class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                </svg>
              </button>
              <button
                @click="resetCrop"
                title="بازنشانی"
                class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                @click="fileInputRef?.click()"
                class="px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                تغییر عکس
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="px-5 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/90">
        <button
          @click="close"
          class="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 font-medium text-xs transition"
        >
          انصراف
        </button>
        <button
          :disabled="!currentImageSrc"
          @click="applyCrop"
          class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-xs hover:shadow-lg hover:shadow-cyan-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          تأیید و ذخیره تصویر
        </button>
      </div>

    </div>
  </div>
</template>
