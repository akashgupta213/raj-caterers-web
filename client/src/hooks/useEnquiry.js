import { useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

export function useEnquiry() {
  const [submitting, setSubmitting] = useState(false);

  const submit = async (form) => {
    setSubmitting(true);
    try {
      const payload = {
        fullName:        form.name,
        email:           form.email,
        phone:           form.phone,
        eventType:       form.eventType,
        estimatedGuests: form.guests ? Number(form.guests) : undefined,
        preferredDate:   form.date || undefined,
        message:         form.message,
      };

      const { data } = await api.post("/enquiries", payload);
      toast.success("Enquiry sent! We'll get back to you within 24 hours. 🎉");
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send. Please try again.";
      toast.error(msg);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  return { submit, submitting };
}