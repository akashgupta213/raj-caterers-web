import { useEffect, useState } from "react";
import api from "../utils/api";
export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const refresh = () => { setLoading(true); api.get("/bookings").then(r => setBookings(r.data)).finally(() => setLoading(false)); };
  useEffect(refresh, []);
  return { bookings, loading, refresh };
}
