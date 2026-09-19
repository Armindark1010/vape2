import { releaseReservation } from "../../../utils/reservation";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const reservationId = body?.reservationId ? String(body.reservationId) : null;

    if (reservationId) {
      releaseReservation(reservationId);
    }

    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message };
  }
});
