import { useState } from "react";

export function useNotifications() {
  const [message, setMessage] = useState<string | null>(null);
  return {
    message,
    success: setMessage,
    error: setMessage,
    clear: () => setMessage(null)
  };
}
