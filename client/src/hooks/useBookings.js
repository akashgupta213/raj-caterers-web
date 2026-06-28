import { useEffect, useState, useCallback } from "react";
import { fetchBookings } from "../utils/api";

export function useBookings(status = "All") {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchBookings(status)
      .then(setBookings)
      .finally(() => setLoading(false));
  }, [status]);

  useEffect(() => { refresh(); }, [refresh]);

  return { bookings, loading, refresh };
}