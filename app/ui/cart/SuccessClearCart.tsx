"use client";

import { useEffect } from "react";

export default function SuccessClearCart({
  sessionId,
}: {
  sessionId: string | undefined;
}) {
  useEffect(() => {
    if (!sessionId) return;
    fetch("/api/checkout/clear-cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then((res) => {
        if (res.ok) window.dispatchEvent(new Event("cartUpdated"));
      })
      .catch(() => {});
  }, [sessionId]);

  return null;
}
