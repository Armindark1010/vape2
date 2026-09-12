<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import Product3DViewer from "~/components/vapor/Product3DViewer.vue";
import {
  CameraIcon,
  Cube3DIcon,
  Rotate3DIcon,
  TrashIcon,
  CheckIcon,
  ChevronLeftIcon,
  SparklesIcon,
} from "~/components/vapor/VIcons";
import { haptic } from "~/utils/vape";

const route = useRoute();
const productSlug = computed(() => (route.query.product as string) || "sample-vape");

// State
const videoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const isCameraActive = ref(false);
const cameraError = ref<string | null>(null);
const availableCameras = ref<{ deviceId: string; label: string }[]>([]);
const selectedDeviceId = ref<string>("");
let mediaStream: MediaStream | null = null;

// Anatomy Zones for Full 3D & 360 Photogrammetry
interface AnatomyZone {
  id: number;
  key: string;
  name: string;
  partName: string;
  category: "front" | "back" | "sides" | "top" | "bottom" | "iso";
  deg: number;
  guide: string;
  missingLabel: string;
  hint: string;
}

const anatomyZones: AnatomyZone[] = [
  {
    id: 0,
    key: "front",
    name: "بدنه جلو (روبرو)",
    partName: "روبروی بدنه",
    category: "front",
    deg: 0,
    guide: "دوربین مستقیم روبروی بدنه اصلی",
    missingLabel: "بدنه اصلی جلو (۰°)",
    hint: "نمای اصلی و لوگوی جلوی دستگاه",
  },
  {
    id: 1,
    key: "top",
    name: "قسمت بالا (لبی و دهنی)",
    partName: "لبی، دهنی و Drip Tip",
    category: "top",
    deg: 0,
    guide: "دوربین را از بالا روی دهنی (Drip Tip) و بالای کارتریج بگیرید",
    missingLabel: "لبی و دهنی بالای دستگاه",
    hint: "خروجی بخار و بالای دستگاه",
  },
  {
    id: 2,
    key: "bottom",
    name: "قسمت زیرین (کف و پورت شارژ)",
    partName: "کف و پورت Type-C",
    category: "bottom",
    deg: 180,
    guide: "محصول را بالا بگیرید و از زیر دستگاه، کف و پورت شارژ عکس بگیرید",
    missingLabel: "کف دستگاه و پورت شارژ",
    hint: "پورت Type-C، پایه‌ها و مشخصات کف دستگاه",
  },
  {
    id: 3,
    key: "right",
    name: "پهلوی راست (لبه راست)",
    partName: "لبه و پهلوی راست",
    category: "sides",
    deg: 90,
    guide: "مستقیماً از پهلو و لبه سمت راست دستگاه عکس بگیرید",
    missingLabel: "پهلوی راست (۹۰°)",
    hint: "دکمه فایر یا دریچه سمت راست",
  },
  {
    id: 4,
    key: "left",
    name: "پهلوی چپ (لبه چپ)",
    partName: "لبه و پهلوی چپ",
    category: "sides",
    deg: 270,
    guide: "مستقیماً از پهلو و لبه سمت چپ دستگاه عکس بگیرید",
    missingLabel: "پهلوی چپ (۲۷۰°)",
    hint: "شیار یا لبه سمت چپ",
  },
  {
    id: 5,
    key: "back",
    name: "پشت بدنه (نمای عقب)",
    partName: "پشت بدنه و بارکد",
    category: "back",
    deg: 180,
    guide: "مستقیماً از پشت محصول عکس بگیرید",
    missingLabel: "پشت بدنه (۱۸۰°)",
    hint: "طرح پشت دستگاه و بارکد",
  },
  {
    id: 6,
    key: "iso_right",
    name: "شیب مایل بالا-راست",
    partName: "زاویه شیب‌دار راست",
    category: "iso",
    deg: 45,
    guide: "عکس با زاویه شیب ۴۵ درجه از بالا راست برای عمق سه‌بعدی",
    missingLabel: "شیب سه‌بعدی بالا-راست",
    hint: "دید سه‌بعدی پرسپکتیو",
  },
  {
    id: 7,
    key: "iso_left",
    name: "شیب مایل بالا-چپ",
    partName: "زاویه شیب‌دار چپ",
    category: "iso",
    deg: 315,
    guide: "عکس با زاویه شیب ۴۵ درجه از بالا چپ برای تکمیل رندر",
    missingLabel: "شیب سه‌بعدی بالا-چپ",
    hint: "دید سه‌بعدی پرسپکتیو",
  },
];

const currentZoneIndex = ref(0);
const capturedPhotos = ref<{ angleId: number; dataUrl: string }[]>([]);
const uploadedGlbUrl = ref<string>("");
const activeTab = ref<"camera" | "preview">("preview");
const saveSuccess = ref(false);

const handleGlbDirectUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    uploadedGlbUrl.value = URL.createObjectURL(file);
    activeTab.value = "preview";
  }
};

// Auto-Pilot Smart Scan Mode
const isAutoScanning = ref(false);
const autoCountdown = ref(3);
let autoTimer: any = null;

const currentZone = computed(() => anatomyZones[currentZoneIndex.value] || anatomyZones[0]);
const progressPct = computed(
  () => Math.round((capturedPhotos.value.length / anatomyZones.length) * 100)
);

const isZoneCaptured = (zoneId: number) => {
  return capturedPhotos.value.some((p: { angleId: number; dataUrl: string }) => p.angleId === zoneId);
};

const missingZones = computed(() => {
  return anatomyZones.filter((z) => !isZoneCaptured(z.id));
});

// Toggle Auto-Pilot
const toggleAutoScan = () => {
  if (isAutoScanning.value) {
    stopAutoScan();
  } else {
    startAutoScan();
  }
};

const startAutoScan = () => {
  isAutoScanning.value = true;
  autoCountdown.value = 3;
  runAutoScanStep();
};

const stopAutoScan = () => {
  isAutoScanning.value = false;
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
};

const runAutoScanStep = () => {
  if (!isAutoScanning.value) return;
  autoCountdown.value = 3;
  autoTimer = setInterval(() => {
    if (!isAutoScanning.value) {
      clearInterval(autoTimer);
      return;
    }
    autoCountdown.value--;
    if (autoCountdown.value <= 0) {
      clearInterval(autoTimer);
      captureShot();
      if (capturedPhotos.value.length < anatomyZones.length && isAutoScanning.value) {
        setTimeout(() => {
          if (isAutoScanning.value) runAutoScanStep();
        }, 1200);
      } else {
        stopAutoScan();
      }
    }
  }, 1000);
};

// Enumerate connected cameras
const loadCameras = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices
      .filter((d) => d.kind === "videoinput")
      .map((d, i) => ({
        deviceId: d.deviceId,
        label: d.label || `دوربین شماره ${i + 1}`,
      }));

    availableCameras.value = videoInputs;
    if (videoInputs.length > 0) {
      // Find non-IR camera (avoid Windows Hello Infrared)
      const normalCam = videoInputs.find(
        (c) =>
          !c.label.toLowerCase().includes("ir") &&
          !c.label.toLowerCase().includes("infrared")
      );
      if (!selectedDeviceId.value) {
        selectedDeviceId.value = normalCam ? normalCam.deviceId : videoInputs[0].deviceId;
      }
    }
  } catch (err) {
    console.warn("Could not list video devices:", err);
  }
};

// Camera Setup
const startCamera = async () => {
  cameraError.value = null;
  try {
    stopCamera();

    await loadCameras();

    const constraints: MediaStreamConstraints = {
      video: selectedDeviceId.value
        ? { deviceId: { exact: selectedDeviceId.value } }
        : {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 1280 },
          },
      audio: false,
    };

    mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream;
      await videoRef.value.play();
      isCameraActive.value = true;
    }

    await loadCameras();
  } catch (err: any) {
    console.error("Camera access error:", err);
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.value) {
        videoRef.value.srcObject = mediaStream;
        await videoRef.value.play();
        isCameraActive.value = true;
      }
      await loadCameras();
    } catch (fallbackErr: any) {
      cameraError.value =
        "دسترسی به دوربین برقرار نشد. در صورتی که در لپ‌تاپ هستید یا وبکم مسدود است، از بخش آپلود یا دیتای نمونه استفاده کنید.";
      isCameraActive.value = false;
    }
  }
};

const switchCamera = () => {
  if (availableCameras.value.length < 2) return;
  const currentIdx = availableCameras.value.findIndex(
    (c: { deviceId: string; label: string }) => c.deviceId === selectedDeviceId.value
  );
  const nextIdx = (currentIdx + 1) % availableCameras.value.length;
  const targetCam = availableCameras.value[nextIdx];
  if (targetCam) {
    selectedDeviceId.value = targetCam.deviceId;
    startCamera();
  }
};

const stopCamera = () => {
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }
  if (videoRef.value) {
    videoRef.value.srcObject = null;
  }
  isCameraActive.value = false;
};

const onCameraChange = (e: Event) => {
  const target = e.target as HTMLSelectElement;
  selectedDeviceId.value = target.value;
  startCamera();
};

// Capture Shot
const captureShot = () => {
  if (!videoRef.value || !canvasRef.value) return;

  haptic(15);

  const video = videoRef.value;
  const canvas = canvasRef.value;
  const size = Math.min(video.videoWidth || 600, video.videoHeight || 600);

  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const startX = ((video.videoWidth || size) - size) / 2;
  const startY = ((video.videoHeight || size) - size) / 2;

  ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);
  const dataUrl = canvas.toDataURL("image/webp", 0.85);

  // Store or replace photo for current zone
  const zoneId = currentZone.value ? currentZone.value.id : 0;
  const existingIdx = capturedPhotos.value.findIndex(
    (p: { angleId: number; dataUrl: string }) => p.angleId === zoneId
  );
  if (existingIdx >= 0) {
    const item = capturedPhotos.value[existingIdx];
    if (item) item.dataUrl = dataUrl;
  } else {
    capturedPhotos.value.push({
      angleId: zoneId,
      dataUrl,
    });
  }

  // Find next uncaptured zone or advance
  const nextMissing = anatomyZones.find(
    (z) => !capturedPhotos.value.some((p) => p.angleId === z.id)
  );

  if (nextMissing) {
    currentZoneIndex.value = nextMissing.id;
  } else if (currentZoneIndex.value < anatomyZones.length - 1) {
    currentZoneIndex.value++;
  } else {
    activeTab.value = "preview";
  }
};

const selectZone = (idx: number) => {
  currentZoneIndex.value = idx;
};

const removePhoto = (zoneId: number) => {
  capturedPhotos.value = capturedPhotos.value.filter(
    (p: { angleId: number; dataUrl: string }) => p.angleId !== zoneId
  );
};

const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const files = Array.from(target.files).slice(0, 8);
  files.forEach((file, idx) => {
    const reader = new FileReader();
    reader.onload = (re) => {
      if (re.target?.result) {
        capturedPhotos.value.push({
          angleId: idx,
          dataUrl: re.target.result as string,
        });
      }
    };
    reader.readAsDataURL(file);
  });
};

// Load ready sample images pack for quick test
const loadSamplePack = () => {
  const sampleImages = [
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
    "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800&q=80",
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
    "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800&q=80",
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
    "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800&q=80",
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
    "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800&q=80",
  ];

  capturedPhotos.value = sampleImages.map((img, idx) => ({
    angleId: idx,
    dataUrl: img,
  }));

  activeTab.value = "preview";
};

const saveProduct3D = () => {
  try {
    localStorage.setItem(
      `vape_3d_scan_${productSlug.value}`,
      JSON.stringify(capturedPhotos.value.map((p) => p.dataUrl))
    );
    saveSuccess.value = true;
    setTimeout(() => {
      saveSuccess.value = false;
    }, 3500);
  } catch (err) {
    console.warn("Storage full:", err);
  }
};

onMounted(() => {
  startCamera();
});

onBeforeUnmount(() => {
  stopCamera();
  if (autoTimer) {
    clearInterval(autoTimer);
  }
});
</script>

<template>
  <div class="wrap min-h-screen pt-4 pb-16 text-snow">
    <!-- Navigation -->
    <div class="flex items-center justify-between py-3">
      <NuxtLink
        :to="productSlug !== 'sample-vape' ? `/product/${productSlug}` : '/'"
        class="flex items-center gap-1.5 text-[13px] font-bold text-mist hover:text-vio"
      >
        <ChevronLeftIcon :size="16" />
        <span>بازگشت به محصول</span>
      </NuxtLink>

      <div class="flex items-center gap-2">
        <span class="flex items-center gap-1 rounded-xl bg-vio/20 px-3 py-1 text-[11px] font-extrabold text-vio glow-v">
          <Cube3DIcon :size="14" />
          <span>استودیو اسکن و مش کالبدی ۳D</span>
        </span>
      </div>
    </div>

    <!-- Header Banner -->
    <div class="mt-2 rounded-3xl border border-white/10 bg-linear-to-r from-purple-950/40 via-ink to-cyan-950/30 p-5 backdrop-blur-xl">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="flex items-center gap-2 text-[20px] font-extrabold text-snow">
            <SparklesIcon :size="20" class="text-neon" />
            اسکن کالبدی و هوشمند قطعات محصول (۳D Anatomy Heatmap)
          </h1>
          <p class="mt-1 text-[12.5px] text-mist">
            بر اساس بخش‌های کالبدی (لبی بالا، کف و پورت شارژ، بدنه جلو و پشت، پهلوها) عکس بگیرید تا کل حجم محصول اسکن شود.
          </p>
        </div>

        <!-- Quick Sample / Upload Actions -->
        <div class="flex items-center gap-2">
          <button
            class="pressable flex items-center gap-1.5 rounded-xl border border-neon/40 bg-neon/15 px-3 py-2 text-[11.5px] font-extrabold text-neon hover:bg-neon/25 cursor-pointer"
            @click="loadSamplePack"
          >
            <SparklesIcon :size="15" />
            تست فوری با پک عکس نمونه
          </button>
        </div>
      </div>

      <!-- Tab Switcher -->
      <div class="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
        <button
          class="pressable flex items-center gap-2 rounded-xl px-4 py-2.5 text-[12.5px] font-extrabold transition-all cursor-pointer"
          :class="[activeTab === 'preview' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black shadow-lg shadow-blue-900/50' : 'bg-white/5 text-mist']"
          @click="activeTab = 'preview'"
        >
          <Cube3DIcon :size="16" />
          <span>🌐 موتور سه‌بعدی گوگل (Google Model-Viewer & AR)</span>
        </button>

        <button
          class="pressable flex items-center gap-2 rounded-xl px-4 py-2.5 text-[12.5px] font-extrabold transition-all cursor-pointer"
          :class="[activeTab === 'camera' ? 'bg-vio text-ink font-black shadow-lg shadow-purple-900/50' : 'bg-white/5 text-mist']"
          @click="activeTab = 'camera'"
        >
          <CameraIcon :size="16" />
          <span>📸 اسکنر دوربین و ثبت عکس قطعات ({{ capturedPhotos.length }} از {{ anatomyZones.length }})</span>
        </button>
      </div>
    </div>

    <!-- MAIN STUDIO CONTENT -->
    <div class="mt-6">
      <!-- TAB 1: CAMERA & RADAR CAPTURE -->
      <div v-show="activeTab === 'camera'" class="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <!-- Camera Viewport with 3D Anatomy Overlay -->
        <div class="relative flex flex-col overflow-hidden rounded-[28px] border border-white/15 bg-black shadow-2xl">
          <!-- Top Bar: Camera Selector & Status -->
          <div class="z-20 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-ink/80 px-4 py-2.5 backdrop-blur-md">
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full" :class="isCameraActive ? 'bg-neon animate-ping' : 'bg-blush'" />
              <span class="text-[11.5px] font-bold text-mist">
                {{ isCameraActive ? 'دوربین زنده فعال است' : 'در انتظار اتصال دوربین' }}
              </span>
            </div>

            <!-- Auto-Pilot Toggle Button -->
            <button
              class="pressable flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-extrabold transition-all cursor-pointer"
              :class="[
                isAutoScanning
                  ? 'bg-neon text-ink ring-2 ring-neon/50 animate-pulse'
                  : 'border border-vio/40 bg-vio/15 text-vio hover:bg-vio/25'
              ]"
              @click="toggleAutoScan"
            >
              <SparklesIcon :size="14" />
              <span>{{ isAutoScanning ? `اسکن خودکار فعال (شمارش: ${autoCountdown})` : '⚡ اسکن خودکار پیوسته' }}</span>
            </button>
          </div>

          <!-- Video Element Container -->
          <div class="relative aspect-square w-full sm:aspect-4/3">
            <video
              ref="videoRef"
              autoplay
              playsinline
              muted
              class="h-full w-full object-cover"
            />
            <canvas ref="canvasRef" class="hidden" />

            <!-- Switch Camera Button (Top Right) -->
            <button
              v-if="availableCameras.length > 1"
              class="pressable absolute top-3 right-3 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-ink/80 text-snow backdrop-blur-md hover:bg-vio hover:text-ink cursor-pointer transition-all"
              title="تغییر دوربین"
              @click="switchCamera"
            >
              <Rotate3DIcon :size="20" />
            </button>

            <!-- Holographic Blueprint Vape Overlay (3D Anatomy Heatmap Wireframe) -->
            <div class="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
              <!-- SVG 3D Blueprint Vape Outline -->
              <svg viewBox="0 0 200 320" class="h-[80%] max-h-[300px] w-auto drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <!-- 1. TOP MOUTHPIECE (لبی بالا) -->
                <path
                  d="M 80 20 L 120 20 L 115 55 L 85 55 Z"
                  :class="[
                    currentZone.key === 'top'
                      ? 'fill-vio/40 stroke-white stroke-2 animate-pulse'
                      : isZoneCaptured(1)
                      ? 'fill-neon/30 stroke-neon stroke-2'
                      : 'fill-red-500/15 stroke-red-400 stroke-1 stroke-dasharray-2'
                  ]"
                />
                <text x="100" y="42" text-anchor="middle" class="text-[8px] font-black fill-snow">
                  {{ isZoneCaptured(1) ? 'لبی ✓' : 'لبی بالا ⚠️' }}
                </text>

                <!-- 2. MAIN BODY (بدنه اصلی روبرو/پشت) -->
                <rect
                  x="60"
                  y="60"
                  width="80"
                  height="180"
                  rx="14"
                  :class="[
                    currentZone.category === 'front' || currentZone.category === 'back'
                      ? 'fill-vio/30 stroke-vio stroke-2'
                      : isZoneCaptured(0) && isZoneCaptured(5)
                      ? 'fill-neon/20 stroke-neon stroke-2'
                      : 'fill-purple-950/20 stroke-white/30 stroke-1'
                  ]"
                />

                <!-- Left Edge / Side -->
                <path
                  d="M 60 74 L 60 226"
                  :class="[
                    currentZone.key === 'left'
                      ? 'stroke-vio stroke-4 animate-pulse'
                      : isZoneCaptured(4)
                      ? 'stroke-neon stroke-3'
                      : 'stroke-red-400 stroke-2 stroke-dasharray-3'
                  ]"
                />
                <!-- Right Edge / Side -->
                <path
                  d="M 140 74 L 140 226"
                  :class="[
                    currentZone.key === 'right'
                      ? 'stroke-vio stroke-4 animate-pulse'
                      : isZoneCaptured(3)
                      ? 'stroke-neon stroke-3'
                      : 'stroke-red-400 stroke-2 stroke-dasharray-3'
                  ]"
                />

                <text x="100" y="155" text-anchor="middle" class="text-[10px] font-black fill-snow">
                  {{ isZoneCaptured(0) ? 'بدنه جلو ✓' : 'بدنه جلو' }}
                </text>

                <!-- 3. BOTTOM BASE & TYPE-C (کف و پورت شارژ) -->
                <path
                  d="M 66 244 L 134 244 L 128 275 L 72 275 Z"
                  :class="[
                    currentZone.key === 'bottom'
                      ? 'fill-vio/50 stroke-white stroke-2 animate-pulse'
                      : isZoneCaptured(2)
                      ? 'fill-neon/30 stroke-neon stroke-2'
                      : 'fill-red-500/25 stroke-red-400 stroke-2 stroke-dasharray-2 animate-pulse'
                  ]"
                />
                <rect x="90" y="255" width="20" height="8" rx="3" class="fill-black stroke-white/40" />
                <text x="100" y="292" text-anchor="middle" class="text-[8.5px] font-black fill-snow">
                  {{ isZoneCaptured(2) ? 'کف و پورت شارژ ✓' : '⚠️ کف و پورت زیرین' }}
                </text>
              </svg>

              <!-- Auto-scan Countdown Overlay -->
              <div
                v-if="isAutoScanning"
                class="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]"
              >
                <div class="flex h-20 w-20 items-center justify-center rounded-full border-4 border-neon bg-ink/90 text-[36px] font-black text-neon shadow-2xl shadow-neon/40 animate-bounce">
                  {{ autoCountdown }}
                </div>
                <p class="mt-3 text-[13px] font-extrabold text-snow drop-shadow-md">
                  در حال ثبت: {{ currentZone.name }}
                </p>
              </div>

              <!-- Live Guidance Badge at Bottom of Viewport -->
              <div class="absolute bottom-4 flex max-w-[90%] items-center gap-2 rounded-full border border-white/20 bg-ink/90 px-4 py-2 text-[12px] font-extrabold text-snow backdrop-blur-md shadow-lg text-center">
                <span class="h-2.5 w-2.5 shrink-0 rounded-full bg-neon animate-ping" />
                <span>{{ currentZone.guide }}</span>
              </div>
            </div>

            <!-- Error Alert if camera fails -->
            <div
              v-if="cameraError"
              class="absolute inset-0 grid place-items-center bg-ink/90 p-6 text-center"
            >
              <div>
                <p class="text-[13px] text-blush">{{ cameraError }}</p>
                <div class="mt-4 flex flex-wrap justify-center gap-2">
                  <label class="inline-flex items-center gap-2 rounded-xl bg-vio px-4 py-2.5 text-[12px] font-bold text-ink cursor-pointer">
                    <span>انتخاب عکس از گالری</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      class="hidden"
                      @change="handleFileUpload"
                    />
                  </label>
                  <button
                    class="rounded-xl bg-neon px-4 py-2.5 text-[12px] font-bold text-ink cursor-pointer"
                    @click="loadSamplePack"
                  >
                    بارگذاری پک نمونه
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Left Side: Interactive 3D Anatomy Heatmap & Missing Zones Checklist -->
        <div class="flex flex-col justify-between rounded-[28px] border border-white/10 bg-panel p-5">
          <div>
            <!-- Radar Header & Progress -->
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-[15px] font-extrabold text-snow">نقشه کالبدی قطعات ویپ</h3>
                <p class="mt-0.5 text-[11px] text-mist">بر اساس قطعات فیزیکی محصول عکس بگیرید</p>
              </div>
              <div class="text-left">
                <span class="text-[13px] font-black text-neon">{{ progressPct }}%</span>
                <span class="block text-[10px] font-bold text-dim">{{ capturedPhotos.length }} از {{ anatomyZones.length }} قطعه</span>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                class="h-full bg-linear-to-r from-vio to-neon transition-all duration-300"
                :style="{ width: `${progressPct}%` }"
              />
            </div>

            <!-- Missing Parts Alert Box -->
            <div v-if="missingZones.length > 0" class="mt-3.5 rounded-2xl border border-red-500/30 bg-red-950/20 p-3">
              <div class="flex items-center gap-1.5 text-[11.5px] font-extrabold text-red-400">
                <span>⚠️ بخش‌های اسکن‌نشده باقی‌مانده (کلیک برای رفتن به آن بخش):</span>
              </div>
              <div class="mt-2 flex flex-wrap gap-1.5">
                <button
                  v-for="mz in missingZones"
                  :key="mz.id"
                  class="pressable flex items-center gap-1 rounded-lg border border-red-500/40 bg-red-500/15 px-2.5 py-1 text-[10.5px] font-bold text-snow hover:bg-red-500/30 cursor-pointer"
                  @click="selectZone(mz.id)"
                >
                  <span>{{ mz.missingLabel }}</span>
                  <span class="text-red-300">👈</span>
                </button>
              </div>
            </div>

            <div v-else class="mt-3.5 rounded-2xl border border-neon/40 bg-neon/10 p-3 text-center">
              <p class="text-[12px] font-extrabold text-neon">✨ تمام بخش‌های محصول با موفقیت اسکن شدند!</p>
            </div>

            <!-- Anatomy Zones Grid -->
            <div class="mt-4 grid grid-cols-2 gap-2">
              <button
                v-for="(zone, idx) in anatomyZones"
                :key="zone.id"
                class="pressable flex items-center justify-between rounded-xl border p-2.5 text-right transition-all cursor-pointer"
                :class="[
                  currentZoneIndex === idx
                    ? 'border-vio bg-vio/20 text-snow ring-2 ring-vio/50'
                    : isZoneCaptured(zone.id)
                    ? 'border-neon/40 bg-neon/10 text-neon'
                    : 'border-white/10 bg-white/4 text-dim',
                ]"
                @click="selectZone(idx)"
              >
                <div class="flex items-center gap-1.5">
                  <span
                    class="grid h-5 w-5 place-items-center rounded-md text-[9px] font-extrabold"
                    :class="[
                      isZoneCaptured(zone.id)
                        ? 'bg-neon text-ink'
                        : 'bg-white/10 text-mist',
                    ]"
                  >
                    {{ isZoneCaptured(zone.id) ? "✓" : idx + 1 }}
                  </span>
                  <div>
                    <span class="block text-[11px] font-bold">{{ zone.name }}</span>
                    <span class="block text-[9px] text-dim">{{ zone.hint }}</span>
                  </div>
                </div>

                <div
                  v-if="capturedPhotos.find((p) => p.angleId === zone.id)"
                  class="h-7 w-7 overflow-hidden rounded-md border border-white/20"
                >
                  <img
                    :src="capturedPhotos.find((p) => p.angleId === zone.id)?.dataUrl"
                    alt=""
                    class="h-full w-full object-cover"
                  />
                </div>
              </button>
            </div>
          </div>

          <!-- Big Shutter Button & Direct Upload -->
          <div class="mt-4 flex flex-col items-center gap-2.5 border-t border-white/10 pt-4">
            <button
              class="pressable flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-linear-to-r from-vio to-ice text-[14.5px] font-extrabold text-ink glow-v cursor-pointer hover:scale-[1.02]"
              @click="captureShot"
            >
              <CameraIcon :size="22" />
              <span>ثبت عکس بخش: {{ currentZone.name }}</span>
            </button>

            <div class="flex w-full items-center justify-between text-[11px] text-dim">
              <label class="cursor-pointer text-vio hover:underline">
                <span>📁 آپلود مستقیم عکس‌ها</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  class="hidden"
                  @change="handleFileUpload"
                />
              </label>

              <button
                v-if="capturedPhotos.length > 0"
                class="text-blush hover:underline cursor-pointer"
                @click="capturedPhotos = []"
              >
                پاک کردن همه عکس‌ها
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: LIVE 3D / 360 PREVIEW -->
      <div v-show="activeTab === 'preview'" class="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div class="h-[480px]">
          <Product3DViewer
            :product-name="productSlug"
            :scan-images="capturedPhotos.map((p) => p.dataUrl)"
            :model-glb-url="uploadedGlbUrl"
          />
        </div>

        <div class="flex flex-col justify-between rounded-[28px] border border-white/10 bg-panel p-6">
          <div>
            <div class="flex items-center gap-2">
              <span class="grid h-8 w-8 place-items-center rounded-xl bg-neon/20 text-neon">
                <CheckIcon :size="18" />
              </span>
              <h3 class="text-[16px] font-extrabold text-snow">محصول ۳۶۰ درجه آماده است!</h3>
            </div>

            <p class="mt-3 text-[12.5px] leading-6 text-mist">
              عکس‌های ثبت‌شده با موفقیت در موتور تعاملی ۳۶۰ درجه پردازش شدند. شما می‌توانید با موس یا لمس روی عکس درگ کنید تا محصول واقعی شما به صورت ۳۶۰ درجه بچرخد.
            </p>

            <div class="mt-5 rounded-2xl border border-white/10 bg-white/3 p-4">
              <h4 class="text-[12px] font-extrabold text-snow">عکس‌های ثبت‌شده شما ({{ capturedPhotos.length }} قطعه):</h4>
              <div class="mt-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
                <div
                  v-for="photo in capturedPhotos"
                  :key="photo.angleId"
                  class="group relative h-16 w-14 shrink-0 overflow-hidden rounded-xl border border-white/20"
                >
                  <img :src="photo.dataUrl" alt="" class="h-full w-full object-cover" />
                  <button
                    class="absolute inset-0 grid place-items-center bg-black/60 opacity-0 group-hover:opacity-100 text-blush transition-opacity cursor-pointer"
                    @click="removePhoto(photo.angleId)"
                  >
                    <TrashIcon :size="14" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6 flex flex-col gap-3">
            <button
              class="pressable flex h-14 items-center justify-center gap-2 rounded-2xl bg-linear-to-l from-neon to-ice text-[14px] font-extrabold text-ink glow-g cursor-pointer"
              @click="saveProduct3D"
            >
              <CheckIcon :size="18" />
              <span>ذخیره و الصاق به محصول</span>
            </button>

            <p v-if="saveSuccess" class="text-center text-[12px] font-bold text-neon animate-bounce">
              ✨ مدل و چرخش ۳۶۰ درجه با موفقیت ذخیره شد!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
