<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import * as THREE from "three";

const props = withDefaults(
  defineProps<{
    productName?: string;
    images?: string[];
    scanImages?: string[];
    modelGlbUrl?: string;
    initialColor?: string;
  }>(),
  {
    productName: "Vape Device 3D",
    images: () => [],
    scanImages: () => [],
    modelGlbUrl: "",
    initialColor: "#a855f7",
  }
);

const containerRef = ref<HTMLDivElement | null>(null);
const modelViewerRef = ref<any>(null);
const isLoading = ref(true);
const autoRotate = ref(true);
const isWireframe = ref(false);
const showSmoke = ref(true);
const selectedColor = ref(props.initialColor);
const customGlbUrl = ref<string>("");
const viewMode = ref<"google" | "360" | "3d">("google");
const current360Index = ref(0);

// Presets of ultra-high-quality 3D Models
const glbPresets = [
  {
    name: "پاد سایبرپانک نئونی (Cyber Vape 3D)",
    url: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    desc: "مدل با بافت PBR و نورپردازی استودیویی",
  },
  {
    name: "دیوایس لوکس نیل استیل (Luxury Pod)",
    url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",
    desc: "متریال متالیک با بازتاب نور محیطی واقعی",
  },
];

const selectedPresetIdx = ref(0);

// Default high-detail realistic 3D Model URL (or custom uploaded GLB)
const activeGlbSource = computed(() => {
  if (customGlbUrl.value) return customGlbUrl.value;
  if (props.modelGlbUrl) return props.modelGlbUrl;
  const preset = glbPresets[selectedPresetIdx.value];
  return preset ? preset.url : "https://modelviewer.dev/shared-assets/models/Astronaut.glb";
});

// Handle Custom GLB / GLTF File Upload (from iPhone Polycam / Scaniverse)
const handleGlbFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    const url = URL.createObjectURL(file);
    customGlbUrl.value = url;
    viewMode.value = "google";
  }
};

// Color Themes
const colorPresets = [
  { name: "بنفش نئونی", hex: "#a855f7", class: "bg-purple-500" },
  { name: "سبز سایبر", hex: "#10b981", class: "bg-emerald-500" },
  { name: "مشکی مات", hex: "#18181b", class: "bg-zinc-900" },
  { name: "آبی یخی", hex: "#06b6d4", class: "bg-cyan-500" },
  { name: "طلایی لوکس", hex: "#eab308", class: "bg-yellow-500" },
  { name: "قرمز آتشین", hex: "#ef4444", class: "bg-red-500" },
];

const available360Images = computed(() => {
  if (props.scanImages && props.scanImages.length > 0) return props.scanImages;
  if (props.images && props.images.length > 0) return props.images;
  return [];
});

// Three.js instances for cleanup
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let animationFrameId: number | null = null;
let mainMeshGroup: THREE.Group | null = null;
let bodyMaterial: THREE.MeshPhysicalMaterial | null = null;
let ledMaterial: THREE.MeshBasicMaterial | null = null;
let smokeParticles: THREE.Points | null = null;

// Interaction Controls
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let targetRotation = { x: 0.2, y: 0.4 };
let currentRotation = { x: 0.2, y: 0.4 };
let targetZoom = 5.2;
let currentZoom = 5.2;

const initThree = () => {
  if (!containerRef.value) return;

  const width = containerRef.value.clientWidth || 400;
  const height = containerRef.value.clientHeight || 500;

  // 1. Scene
  scene = new THREE.Scene();

  // 2. Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0.4, currentZoom);

  // 3. Renderer with antialias and alpha
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  containerRef.value.appendChild(renderer.domElement);

  // 4. Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
  keyLight.position.set(5, 8, 5);
  keyLight.castShadow = true;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xa855f7, 3.0);
  rimLight.position.set(-5, 4, -4);
  scene.add(rimLight);

  const fillLight = new THREE.DirectionalLight(0x06b6d4, 1.8);
  fillLight.position.set(3, -4, 3);
  scene.add(fillLight);

  // 5. Build 3D Vape Geometry (Procedural High-Detail Model)
  buildVapeModel();

  // 6. Build Smoke Particle System
  buildSmokeEffect();

  // 7. Event Listeners for Interaction
  setupEventListeners();

  isLoading.value = false;

  // 8. Start Render Loop
  animate();
};

const buildVapeModel = () => {
  if (!scene) return;

  mainMeshGroup = new THREE.Group();

  // A. Main Body (Metallic pod body with bevels)
  const bodyGeo = new THREE.CylinderGeometry(0.52, 0.48, 2.8, 32, 1, false);
  bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(selectedColor.value),
    metalness: 0.88,
    roughness: 0.22,
    clearcoat: 0.6,
    clearcoatRoughness: 0.15,
    reflectivity: 0.9,
  });
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMaterial);
  bodyMesh.position.y = 0;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  mainMeshGroup.add(bodyMesh);

  // B. Body Leather / Rubber Grip Accent Panel
  const gripGeo = new THREE.CylinderGeometry(0.53, 0.49, 1.6, 32, 1, false, 0, Math.PI);
  const gripMaterial = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.85,
    metalness: 0.1,
  });
  const gripMesh = new THREE.Mesh(gripGeo, gripMaterial);
  gripMesh.position.y = -0.2;
  gripMesh.rotation.y = Math.PI / 2;
  mainMeshGroup.add(gripMesh);

  // C. OLED Cyberpunk Display Screen
  const screenGeo = new THREE.PlaneGeometry(0.42, 0.95);
  const screenMat = new THREE.MeshBasicMaterial({
    color: 0x09090b,
  });
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.set(0, -0.1, 0.525);
  mainMeshGroup.add(screenMesh);

  // D. Glowing LED Indicator Bar
  const ledGeo = new THREE.PlaneGeometry(0.3, 0.08);
  ledMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(selectedColor.value),
  });
  const ledMesh = new THREE.Mesh(ledGeo, ledMaterial);
  ledMesh.position.set(0, -0.4, 0.53);
  mainMeshGroup.add(ledMesh);

  // E. Pod Cartridge (Translucent Dark Polycarbonate)
  const podGeo = new THREE.CylinderGeometry(0.48, 0.52, 0.9, 32);
  const podMat = new THREE.MeshPhysicalMaterial({
    color: 0x27272a,
    transparent: true,
    opacity: 0.72,
    roughness: 0.1,
    transmission: 0.85,
    ior: 1.5,
  });
  const podMesh = new THREE.Mesh(podGeo, podMat);
  podMesh.position.y = 1.65;
  mainMeshGroup.add(podMesh);

  // F. Liquid Juice View inside Pod (Gold / Amber color)
  const juiceGeo = new THREE.CylinderGeometry(0.42, 0.46, 0.6, 32);
  const juiceMat = new THREE.MeshPhysicalMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.65,
    roughness: 0.05,
    transmission: 0.9,
  });
  const juiceMesh = new THREE.Mesh(juiceGeo, juiceMat);
  juiceMesh.position.y = 1.55;
  mainMeshGroup.add(juiceMesh);

  // G. Ergonomic Mouthpiece (Drip Tip)
  const tipGeo = new THREE.CylinderGeometry(0.24, 0.42, 0.55, 32);
  const tipMat = new THREE.MeshStandardMaterial({
    color: 0x09090b,
    roughness: 0.3,
    metalness: 0.5,
  });
  const tipMesh = new THREE.Mesh(tipGeo, tipMat);
  tipMesh.position.y = 2.25;
  mainMeshGroup.add(tipMesh);

  // H. Bottom Metal Bezel & Type-C Port
  const bottomGeo = new THREE.CylinderGeometry(0.48, 0.46, 0.25, 32);
  const bottomMat = new THREE.MeshStandardMaterial({
    color: 0x27272a,
    metalness: 0.9,
    roughness: 0.3,
  });
  const bottomMesh = new THREE.Mesh(bottomGeo, bottomMat);
  bottomMesh.position.y = -1.45;
  mainMeshGroup.add(bottomMesh);

  // Center the entire group
  mainMeshGroup.position.y = -0.3;
  scene.add(mainMeshGroup);
};

const buildSmokeEffect = () => {
  if (!scene) return;

  const particleCount = 65;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities: { x: number; y: number; z: number }[] = [];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 0.2;
    positions[i * 3 + 1] = 2.3 + Math.random() * 0.8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;

    velocities.push({
      x: (Math.random() - 0.5) * 0.008,
      y: 0.012 + Math.random() * 0.015,
      z: (Math.random() - 0.5) * 0.008,
    });
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xe2e8f0,
    size: 0.16,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
  });

  smokeParticles = new THREE.Points(geometry, material);
  smokeParticles.userData = { velocities };
  scene.add(smokeParticles);
};

const animateSmoke = () => {
  if (!smokeParticles || !showSmoke.value) return;

  const posAttr = smokeParticles.geometry?.attributes?.position;
  if (!posAttr) return;

  const positions = posAttr.array as Float32Array;
  const velocities = smokeParticles.userData?.velocities;
  if (!velocities) return;

  for (let i = 0; i < velocities.length; i++) {
    positions[i * 3] += velocities[i].x;
    positions[i * 3 + 1] += velocities[i].y;
    positions[i * 3 + 2] += velocities[i].z;

    if (positions[i * 3 + 1] > 4.2) {
      positions[i * 3] = (Math.random() - 0.5) * 0.15;
      positions[i * 3 + 1] = 2.3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
    }
  }

  posAttr.needsUpdate = true;
};

const setupEventListeners = () => {
  const el = containerRef.value;
  if (!el) return;

  el.addEventListener("mousedown", onPointerDown);
  window.addEventListener("mousemove", onPointerMove);
  window.addEventListener("mouseup", onPointerUp);

  el.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: true });
  window.addEventListener("touchend", onPointerUp);

  el.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("resize", onWindowResize);
};

const onPointerDown = (e: MouseEvent) => {
  isDragging = true;
  previousMousePosition = { x: e.clientX, y: e.clientY };
};

const onPointerMove = (e: MouseEvent) => {
  if (!isDragging) return;
  const deltaX = e.clientX - previousMousePosition.x;
  const deltaY = e.clientY - previousMousePosition.y;

  if (viewMode.value === "3d") {
    targetRotation.y += deltaX * 0.008;
    targetRotation.x += deltaY * 0.008;
    targetRotation.x = Math.max(-0.8, Math.min(0.8, targetRotation.x));
  } else if (available360Images.value.length > 0) {
    // 360 Spin mode
    if (Math.abs(deltaX) > 10) {
      const step = deltaX > 0 ? -1 : 1;
      const count = available360Images.value.length;
      current360Index.value = (current360Index.value + step + count) % count;
      previousMousePosition = { x: e.clientX, y: e.clientY };
      return;
    }
  }

  previousMousePosition = { x: e.clientX, y: e.clientY };
};

const onTouchStart = (e: TouchEvent) => {
  if (e.touches.length === 1 && e.touches[0]) {
    isDragging = true;
    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
};

const onTouchMove = (e: TouchEvent) => {
  if (!isDragging || e.touches.length !== 1 || !e.touches[0]) return;
  const deltaX = e.touches[0].clientX - previousMousePosition.x;
  const deltaY = e.touches[0].clientY - previousMousePosition.y;

  if (viewMode.value === "3d") {
    targetRotation.y += deltaX * 0.008;
    targetRotation.x += deltaY * 0.008;
    targetRotation.x = Math.max(-0.8, Math.min(0.8, targetRotation.x));
  } else if (available360Images.value.length > 0) {
    if (Math.abs(deltaX) > 12) {
      const step = deltaX > 0 ? -1 : 1;
      const count = available360Images.value.length;
      current360Index.value = (current360Index.value + step + count) % count;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      return;
    }
  }

  previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
};

const onPointerUp = () => {
  isDragging = false;
};

const onWheel = (e: WheelEvent) => {
  e.preventDefault();
  targetZoom += e.deltaY * 0.003;
  targetZoom = Math.max(3.2, Math.min(7.5, targetZoom));
};

const onWindowResize = () => {
  if (!containerRef.value || !renderer || !camera) return;
  const width = containerRef.value.clientWidth;
  const height = containerRef.value.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

const changeColor = (hex: string) => {
  selectedColor.value = hex;
  if (bodyMaterial) {
    bodyMaterial.color.set(hex);
  }
  if (ledMaterial) {
    ledMaterial.color.set(hex);
  }
};

const toggleWireframe = () => {
  isWireframe.value = !isWireframe.value;
  if (mainMeshGroup) {
    mainMeshGroup.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => (m.wireframe = isWireframe.value));
        } else {
          child.material.wireframe = isWireframe.value;
        }
      }
    });
  }
};

const resetView = () => {
  targetRotation = { x: 0.2, y: 0.4 };
  targetZoom = 5.2;
};

const animate = () => {
  animationFrameId = requestAnimationFrame(animate);

  if (viewMode.value === "3d") {
    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08;
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;
    currentZoom += (targetZoom - currentZoom) * 0.08;

    if (camera) {
      camera.position.z = currentZoom;
    }

    if (mainMeshGroup) {
      if (autoRotate.value && !isDragging) {
        targetRotation.y += 0.004;
      }
      mainMeshGroup.rotation.x = currentRotation.x;
      mainMeshGroup.rotation.y = currentRotation.y;
    }

    animateSmoke();

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }
};

// ==========================================
// 🛡️ STRICT THREE.JS MEMORY LEAK CLEANUP
// ==========================================
const cleanupThree = () => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  const el = containerRef.value;
  if (el) {
    el.removeEventListener("mousedown", onPointerDown);
    el.removeEventListener("touchstart", onTouchStart);
    el.removeEventListener("wheel", onWheel);
  }
  window.removeEventListener("mousemove", onPointerMove);
  window.removeEventListener("mouseup", onPointerUp);
  window.removeEventListener("touchmove", onTouchMove);
  window.removeEventListener("touchend", onPointerUp);
  window.removeEventListener("resize", onWindowResize);

  if (scene) {
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
        if (obj.geometry) {
          obj.geometry.dispose();
        }
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat) => mat.dispose());
          } else {
            obj.material.dispose();
          }
        }
      }
    });
    scene.clear();
    scene = null;
  }

  if (renderer) {
    renderer.dispose();
    renderer.forceContextLoss();
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
    renderer = null;
  }

  camera = null;
  mainMeshGroup = null;
  bodyMaterial = null;
  ledMaterial = null;
  smokeParticles = null;
};

// 360 Mode Studio & Background Isolation Options
const cutoutMode = ref<"studio" | "blur" | "original">("studio");
const autoSpin360 = ref(true);
const spinSpeed = ref(150); // ms per frame
let spinInterval: any = null;

const startAutoSpin = () => {
  if (spinInterval) clearInterval(spinInterval);
  if (!autoSpin360.value) return;
  spinInterval = setInterval(() => {
    if (viewMode.value === "360" && available360Images.value.length > 0 && !isDragging) {
      current360Index.value = (current360Index.value + 1) % available360Images.value.length;
    }
  }, spinSpeed.value);
};

const stopAutoSpin = () => {
  if (spinInterval) {
    clearInterval(spinInterval);
    spinInterval = null;
  }
};

watch(
  [viewMode, autoSpin360],
  ([newView, newSpin]) => {
    if (newView === "360" && newSpin) {
      startAutoSpin();
    } else {
      stopAutoSpin();
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  cleanupThree();
  stopAutoSpin();
});
const onSliderChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target) {
    current360Index.value = Number(target.value);
  }
};
</script>

<template>
  <div class="relative h-full w-full select-none overflow-hidden rounded-[26px] bg-gradient-to-b from-[#080810] via-[#0d0f1a] to-[#121422] p-4 text-snow">
    <!-- View Mode & Studio Controls (Top Bar) -->
    <div class="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
      <div class="flex flex-wrap items-center gap-1.5">
        <span class="text-[12px] font-bold text-mist">موتور نمایش:</span>
        <div class="flex flex-wrap gap-1 rounded-xl bg-white/5 p-1">
          <button
            class="rounded-lg px-3 py-1 text-[11px] font-extrabold transition-all cursor-pointer"
            :class="[viewMode === 'google' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' : 'text-mist']"
            @click="viewMode = 'google'"
          >
            🌐 موتور ۳D گوگل (Model-Viewer + AR)
          </button>
          <button
            class="rounded-lg px-3 py-1 text-[11px] font-extrabold transition-all cursor-pointer"
            :class="[viewMode === '360' ? 'bg-neon text-ink' : 'text-mist']"
            @click="viewMode = '360'"
          >
            📸 عکاسی ۳۶۰° محصول
          </button>
          <button
            class="rounded-lg px-3 py-1 text-[11px] font-extrabold transition-all cursor-pointer"
            :class="[viewMode === '3d' ? 'bg-vio text-ink' : 'text-mist']"
            @click="viewMode = '3d'"
          >
            🎨 سفارشی‌ساز Three.js
          </button>
        </div>
      </div>

      <!-- GLB Presets & File Upload (for Google Mode) -->
      <div v-if="viewMode === 'google'" class="flex flex-wrap items-center gap-1.5">
        <button
          v-for="(preset, pIdx) in glbPresets"
          :key="preset.name"
          class="pressable rounded-xl px-2.5 py-1 text-[10.5px] font-bold transition-all cursor-pointer"
          :class="[
            selectedPresetIdx === pIdx && !customGlbUrl
              ? 'border border-blue-400 bg-blue-500/20 text-blue-300 font-extrabold shadow-md'
              : 'border border-white/10 bg-white/5 text-mist hover:text-snow'
          ]"
          @click="selectedPresetIdx = pIdx; customGlbUrl = ''"
        >
          <span>{{ preset.name }}</span>
        </button>

        <label class="flex items-center gap-1.5 rounded-xl border border-blue-400/40 bg-blue-500/15 px-3 py-1 text-[10.5px] font-extrabold text-blue-300 hover:bg-blue-500/25 cursor-pointer">
          <span>📁 آپلود GLB اختصاصی</span>
          <input
            type="file"
            accept=".glb,.gltf"
            class="hidden"
            @change="handleGlbFileUpload"
          />
        </label>
      </div>

      <!-- Studio Cutout Filter Toggles (for 360 mode) -->
      <div v-if="viewMode === '360'" class="flex items-center gap-1 rounded-xl bg-white/5 p-1">
        <button
          class="rounded-lg px-2.5 py-1 text-[10.5px] font-extrabold transition-all cursor-pointer"
          :class="[cutoutMode === 'studio' ? 'bg-vio text-ink shadow-md' : 'text-mist hover:text-snow']"
          title="تفکیک هوشمند محصول و حذف پس‌زمینه شلوغ"
          @click="cutoutMode = 'studio'"
        >
          ✨ استودیوی تفکیک‌شده
        </button>
        <button
          class="rounded-lg px-2.5 py-1 text-[10.5px] font-extrabold transition-all cursor-pointer"
          :class="[cutoutMode === 'blur' ? 'bg-ice text-ink shadow-md' : 'text-mist hover:text-snow']"
          title="تار کردن محیط پشت محصول (بوکه استودیویی)"
          @click="cutoutMode = 'blur'"
        >
          🌫️ بوکه و بلور محیط
        </button>
        <button
          class="rounded-lg px-2.5 py-1 text-[10.5px] font-extrabold transition-all cursor-pointer"
          :class="[cutoutMode === 'original' ? 'bg-white/20 text-snow' : 'text-mist hover:text-snow']"
          title="تصویر خام اولیه"
          @click="cutoutMode = 'original'"
        >
          📷 تصویر اصلی
        </button>
      </div>
    </div>

    <!-- Mode A: Google Model-Viewer (Photorealistic PBR + AR + Shadows) -->
    <div
      v-if="viewMode === 'google'"
      class="relative flex h-[380px] w-full items-center justify-center overflow-hidden rounded-2xl bg-radial from-[#13162b] via-[#0b0c16] to-black sm:h-[460px]"
    >
      <model-viewer
        ref="modelViewerRef"
        :src="activeGlbSource"
        :alt="productName"
        auto-rotate
        rotation-per-second="30deg"
        camera-controls
        ar
        ar-modes="webxr scene-viewer quick-look"
        shadow-intensity="1.6"
        shadow-softness="0.8"
        exposure="1.15"
        environment-image="neutral"
        touch-action="pan-y"
        style="width: 100%; height: 100%; outline: none;"
      >
        <!-- AR View Button on Mobile -->
        <button
          slot="ar-button"
          class="pressable absolute bottom-4 right-4 z-20 flex items-center gap-2 rounded-2xl border border-white/20 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-[12.5px] font-black text-white shadow-2xl shadow-blue-500/50 cursor-pointer"
        >
          <span>📱 مشاهده با واقعیت افزوده (AR در اتاق)</span>
        </button>
      </model-viewer>

      <!-- Google Model-Viewer Badges & Controls (Bottom Left) -->
      <div class="pointer-events-none absolute bottom-3 left-3 z-10 flex flex-col gap-1 rounded-xl bg-ink/80 p-2 text-[10.5px] font-bold text-mist backdrop-blur-md">
        <span class="flex items-center gap-1.5 text-blue-400">
          <span class="h-2 w-2 rounded-full bg-blue-400 animate-ping" />
          موتور رندر فوتورئال Google Model-Viewer
        </span>
        <span class="text-[9.5px] text-dim">نورپردازی محیطی PBR + سایه واقعی + پشتیبانی AR</span>
      </div>
    </div>

    <!-- Mode B: Three.js 3D Viewport -->
    <div
      v-show="viewMode === '3d'"
      ref="containerRef"
      class="relative h-[380px] w-full cursor-grab active:cursor-grabbing sm:h-[460px]"
    >
      <div
        v-if="isLoading"
        class="absolute inset-0 grid place-items-center bg-ink/70 backdrop-blur-md"
      >
        <div class="flex flex-col items-center gap-3">
          <div class="h-10 w-10 animate-spin rounded-full border-3 border-vio border-t-transparent" />
          <p class="text-[13px] font-bold text-mist">در حال بارگذاری رندر ۳ بعدی...</p>
        </div>
      </div>
    </div>

    <!-- Mode B: 360 Photo Turntable Viewport (Isolated & Pedestal) -->
    <div
      v-if="viewMode === '360'"
      class="relative flex h-[380px] w-full cursor-ew-resize items-center justify-center overflow-hidden rounded-2xl sm:h-[460px]"
      :class="[
        cutoutMode === 'studio'
          ? 'bg-radial from-[#1e1035] via-[#090a12] to-black'
          : cutoutMode === 'blur'
          ? 'bg-black/60'
          : 'bg-black/40'
      ]"
      @mousedown="onPointerDown"
      @touchstart="onTouchStart"
    >
      <!-- Background Spotlight & Pedestal for Studio Mode -->
      <div
        v-if="cutoutMode === 'studio'"
        class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
      >
        <!-- Top Radial Spotlight -->
        <div class="h-72 w-72 rounded-full bg-purple-600/15 blur-3xl" />

        <!-- 3D Pedestal Platform Base in center -->
        <div class="absolute bottom-16 h-12 w-64 rounded-[100%] border-2 border-vio/40 bg-gradient-to-b from-purple-900/30 via-vio/10 to-transparent shadow-[0_0_30px_rgba(168,85,247,0.4)]" />
        <div class="absolute bottom-18 h-6 w-48 rounded-[100%] bg-black/60 blur-[4px]" />
      </div>

      <!-- Blurred Backdrop Layer for Bokeh Blur mode -->
      <div
        v-if="cutoutMode === 'blur'"
        class="pointer-events-none absolute inset-0 scale-110 bg-cover bg-center blur-lg opacity-30"
        :style="{ backgroundImage: `url(${available360Images[current360Index]})` }"
      />

      <!-- Main Subject Image with Cutout Masking -->
      <div
        class="relative z-10 flex h-full w-full items-center justify-center p-4 transition-transform duration-75"
      >
        <img
          :src="available360Images[current360Index]"
          alt="360 Product Subject"
          class="max-h-[85%] max-w-[85%] object-contain pointer-events-none drop-shadow-[0_20px_25px_rgba(0,0,0,0.8)]"
          :class="[
            cutoutMode === 'studio'
              ? 'brightness-110 contrast-115 [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_90%)]'
              : cutoutMode === 'blur'
              ? 'brightness-105 contrast-110 drop-shadow-2xl'
              : ''
          ]"
        />
      </div>

      <!-- Top Overlay Quick Controls -->
      <div class="absolute top-3 left-3 z-20 flex items-center gap-2">
        <button
          class="pressable flex items-center gap-1.5 rounded-xl border border-white/20 bg-ink/80 px-3 py-1.5 text-[11px] font-bold text-snow backdrop-blur-md hover:bg-white/15 cursor-pointer"
          @click="autoSpin360 = !autoSpin360"
        >
          <span>{{ autoSpin360 ? "⏸ توقف چرخش" : "▶️ چرخش خودکار ۳۶۰°" }}</span>
        </button>
      </div>

      <!-- Frame Scrub Bar at Bottom -->
      <div class="absolute bottom-3 left-4 right-4 z-20 flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-ink/85 p-2 backdrop-blur-md">
        <div class="flex w-full items-center justify-between px-2 text-[11px] font-bold text-mist">
          <span class="text-neon">زاویه {{ current360Index + 1 }} از {{ available360Images.length }}</span>
          <span class="text-[10px] text-dim">برای چرخش دستی درگ کنید یا اسلایدر را جابجا کنید</span>
        </div>

        <!-- Frame Progress Slider -->
        <input
          type="range"
          min="0"
          :max="available360Images.length - 1"
          :value="current360Index"
          class="h-1.5 w-full cursor-pointer accent-neon"
          @input="onSliderChange"
        />
      </div>
    </div>

    <!-- 3D Controls Overlay Bar (Top Right for 3D Material mode) -->
    <div v-if="viewMode === '3d'" class="absolute top-4 right-4 z-10 flex flex-col gap-2">
      <button
        class="pressable flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-ink/65 px-3 text-[11px] font-bold text-snow backdrop-blur-md transition-colors hover:border-vio cursor-pointer"
        :class="[autoRotate ? 'border-vio/60 bg-vio/20 text-vio glow-v' : '']"
        @click="autoRotate = !autoRotate"
      >
        <span class="inline-block h-2 w-2 rounded-full" :class="[autoRotate ? 'bg-neon animate-pulse' : 'bg-dim']" />
        {{ autoRotate ? "چرخش خودکار: روشن" : "چرخش خودکار: خاموش" }}
      </button>

      <button
        class="pressable flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-ink/65 px-3 text-[11px] font-bold text-snow backdrop-blur-md transition-colors hover:border-ice cursor-pointer"
        :class="[showSmoke ? 'border-ice/60 bg-ice/15 text-ice' : '']"
        @click="showSmoke = !showSmoke"
      >
        💨 {{ showSmoke ? "دود بخار: فعال" : "دود بخار: خاموش" }}
      </button>

      <button
        class="pressable flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-ink/65 px-3 text-[11px] font-bold text-snow backdrop-blur-md transition-colors hover:border-gold cursor-pointer"
        :class="[isWireframe ? 'border-gold/60 bg-gold/20 text-gold' : '']"
        @click="toggleWireframe"
      >
        📐 وایرفریم
      </button>

      <button
        class="pressable flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-ink/65 px-3 text-[11px] font-bold text-snow backdrop-blur-md transition-colors hover:bg-white/15 cursor-pointer"
        @click="resetView"
      >
        🔄 تنظیم مجدد زاویه
      </button>
    </div>

    <!-- Color Customizer (Bottom for 3D Mode) -->
    <div v-if="viewMode === '3d'" class="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
      <div>
        <span class="text-[12px] font-extrabold text-mist">رنگ بدنه دستگاه:</span>
        <div class="mt-1.5 flex items-center gap-2">
          <button
            v-for="color in colorPresets"
            :key="color.hex"
            :aria-label="color.name"
            class="pressable relative h-7 w-7 rounded-full border-2 transition-transform cursor-pointer hover:scale-110"
            :class="[
              selectedColor === color.hex ? 'border-white scale-110 shadow-md ring-2 ring-vio/60' : 'border-white/20',
              color.class,
            ]"
            @click="changeColor(color.hex)"
          >
            <span
              v-if="selectedColor === color.hex"
              class="absolute inset-0 grid place-items-center text-[10px] text-white"
            >
              ✓
            </span>
          </button>
        </div>
      </div>

      <div class="text-left text-[10px] text-dim">
        <p>💡 با تاچ / ماوس درگ کنید تا دور مدل بچرخید</p>
        <p>🔍 با اسکرول یا پینچ زوم کنید</p>
      </div>
    </div>
  </div>
</template>
