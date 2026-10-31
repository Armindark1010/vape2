import { ref, computed, onUnmounted } from "vue";
import { toFarsi } from "~/utils/format";

const STORAGE_KEY = "vapora.reservation";

const reservationId = ref<string | null>(null);
const expiresAt = ref<string | null>(null);
const remainingSeconds = ref<number>(0);
const totalHoldSeconds = ref<number>(15 * 60);
const isExpired = ref<boolean>(false);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const conflictItem = ref<{ productId: number; name: string; available: number; requested: number } | null>(null);

let timerInterval: any = null;

function saveSession() {
  if (typeof window === "undefined") return;
  try {
    if (reservationId.value && expiresAt.value) {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          reservationId: reservationId.value,
          expiresAt: expiresAt.value,
          totalHoldSeconds: totalHoldSeconds.value,
        })
      );
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore storage issues
  }
}

function loadSession() {
  if (typeof window === "undefined") return;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data?.reservationId && data?.expiresAt) {
      const expTime = new Date(data.expiresAt).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expTime - now) / 1000));
      if (diff > 0) {
        reservationId.value = data.reservationId;
        expiresAt.value = data.expiresAt;
        totalHoldSeconds.value = data.totalHoldSeconds || 15 * 60;
        remainingSeconds.value = diff;
        isExpired.value = false;
        startTimer();
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

function startTimer() {
  if (typeof window === "undefined") return;
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (!expiresAt.value) {
      clearInterval(timerInterval);
      return;
    }
    const expTime = new Date(expiresAt.value).getTime();
    const diff = Math.max(0, Math.floor((expTime - Date.now()) / 1000));
    remainingSeconds.value = diff;

    if (diff <= 0) {
      clearInterval(timerInterval);
      isExpired.value = true;
      reservationId.value = null;
      saveSession();
    }
  }, 1000);
}

export function useReservation() {
  if (typeof window !== "undefined" && !reservationId.value && !isExpired.value) {
    loadSession();
  }

  const isReserved = computed(() => !!reservationId.value && remainingSeconds.value > 0);

  const formattedTime = computed(() => {
    const s = remainingSeconds.value;
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    const mStr = String(mins).padStart(2, "0");
    const sStr = String(secs).padStart(2, "0");
    return `${toFarsi(mStr)}:${toFarsi(sStr)}`;
  });

  const formattedTimeLatin = computed(() => {
    const s = remainingSeconds.value;
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  });

  const progressPercent = computed(() => {
    if (totalHoldSeconds.value <= 0) return 0;
    return Math.max(0, Math.min(100, (remainingSeconds.value / totalHoldSeconds.value) * 100));
  });

  /**
   * Request stock reservation on server
   */
  const reserve = async (
    items: { id: number; qty: number; variantId?: string | null; color?: string | null }[],
    holdMinutes = 15
  ) => {
    if (!items || items.length === 0) return false;

    loading.value = true;
    error.value = null;
    conflictItem.value = null;

    try {
      const res = await $fetch<{
        ok: boolean;
        reservationId: string;
        expiresAt: string;
        remainingSeconds: number;
      }>("/api/v1/cart/reserve", {
        method: "POST",
        body: {
          items: items.map((i) => ({
            productId: i.id,
            variantId: i.variantId || undefined,
            color: i.color || undefined,
            qty: i.qty,
          })),
          reservationId: reservationId.value || undefined,
          holdMinutes,
        },
      });

      if (res && res.ok) {
        reservationId.value = res.reservationId;
        expiresAt.value = res.expiresAt;
        remainingSeconds.value = res.remainingSeconds || holdMinutes * 60;
        totalHoldSeconds.value = holdMinutes * 60;
        isExpired.value = false;
        saveSession();
        startTimer();
        return true;
      }
      return false;
    } catch (err: any) {
      const conflictData = err?.data?.data?.conflictItem || err?.data?.conflictItem;
      if (conflictData) {
        conflictItem.value = conflictData;
      }
      error.value = err?.data?.message || err?.message || "امکان رزرو موجودی این کالاها وجود ندارد.";
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Release reservation
   */
  const release = async () => {
    if (timerInterval) clearInterval(timerInterval);
    const idToRelease = reservationId.value;
    reservationId.value = null;
    expiresAt.value = null;
    remainingSeconds.value = 0;
    isExpired.value = false;
    saveSession();

    if (idToRelease) {
      try {
        await $fetch("/api/v1/cart/release-reservation", {
          method: "POST",
          body: { reservationId: idToRelease },
        });
      } catch {
        // Ignore
      }
    }
  };

  return {
    reservationId,
    expiresAt,
    remainingSeconds,
    isReserved,
    isExpired,
    loading,
    error,
    conflictItem,
    formattedTime,
    formattedTimeLatin,
    progressPercent,
    reserve,
    release,
  };
}
