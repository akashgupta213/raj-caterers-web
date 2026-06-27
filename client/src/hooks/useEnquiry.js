import { useState } from "react";
import api from "../utils/api";
export function useEnquiry() {
  const [submitting, setSubmitting] = useState(false);
  const submit = async (payload) => {
    setSubmitting(true);
    try { return (await api.post("/enquiries", payload)).data; }
    finally { setSubmitting(false); }
  };
  return { submit, submitting };
}
