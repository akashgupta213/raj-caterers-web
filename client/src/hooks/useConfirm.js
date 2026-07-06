import { useState, useCallback, useRef } from "react";

// Promise-based confirm: `const ok = await confirm("Delete this?")`
export function useConfirm() {
  const [dialog, setDialog] = useState({ open: false, title: "", message: "", confirmLabel: "Delete" });
  const resolver = useRef(null);

  const confirm = useCallback((message, options = {}) => {
    setDialog({
      open: true,
      title: options.title || "Are you sure?",
      message,
      confirmLabel: options.confirmLabel || "Delete",
    });
    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setDialog((d) => ({ ...d, open: false }));
    resolver.current?.(true);
  }, []);

  const handleCancel = useCallback(() => {
    setDialog((d) => ({ ...d, open: false }));
    resolver.current?.(false);
  }, []);

  return { confirm, dialog, handleConfirm, handleCancel };
}