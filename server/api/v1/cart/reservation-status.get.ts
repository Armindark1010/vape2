import { getReservationStatus } from "../../../utils/reservation";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const reservationId = query.reservationId ? String(query.reservationId) : "";

  if (!reservationId) {
    return { active: false, remainingSeconds: 0 };
  }

  return getReservationStatus(reservationId);
});
