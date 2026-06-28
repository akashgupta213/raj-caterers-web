import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("rc_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("rc_token");
      localStorage.removeItem("rc_admin");
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  }
);

// ── Bookings ──────────────────────────────────
export const fetchBookings = (status) =>
  api.get("/bookings", { params: status && status !== "All" ? { status } : {} })
     .then((r) => r.data.data.bookings);

export const updateBooking = (id, body) =>
  api.put(`/bookings/${id}`, body).then((r) => r.data.data);

export const deleteBooking = (id) =>
  api.delete(`/bookings/${id}`).then((r) => r.data);

export const fetchBookingStats = () =>
  api.get("/bookings/stats").then((r) => r.data.data);

// ── Reviews ───────────────────────────────────
// Use /reviews/admin to get ALL (approved + pending)
export const fetchReviewsAdmin = () =>
  api.get("/reviews/admin").then((r) => r.data.data.reviews);

export const updateReview = (id, body) =>
  api.put(`/reviews/${id}`, body).then((r) => r.data.data);

export const deleteReview = (id) =>
  api.delete(`/reviews/${id}`).then((r) => r.data);

// ── Menu ──────────────────────────────────────
export const fetchMenuItems = () =>
  api.get("/menu").then((r) => r.data.data.items);

export const deleteMenuItem = (id) =>
  api.delete(`/menu/${id}`).then((r) => r.data);

// ── Gallery ───────────────────────────────────
export const fetchGallery = (category) =>
  api.get("/gallery", { params: category ? { category } : {} })
     .then((r) => r.data.data);

export const deleteGalleryImage = (id) =>
  api.delete(`/gallery/${id}`).then((r) => r.data);

// ── Clients ───────────────────────────────────
export const fetchClients = (search) =>
  api.get("/clients", { params: search ? { search } : {} })
     .then((r) => r.data.data.clients);

export const fetchClientStats = () =>
  api.get("/clients/stats").then((r) => r.data.data);

// ── Enquiries ─────────────────────────────────
export const fetchEnquiries = () =>
  api.get("/enquiries").then((r) => r.data.data.enquiries);

export const updateEnquiry = (id, body) =>
  api.put(`/enquiries/${id}`, body).then((r) => r.data.data);

export default api;