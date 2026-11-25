import { useEffect, useState } from "react";

// Har 30 second mein naya "abhi ka time" deta hai, taaki countdowns update hote rahein
export function useNow(intervalMs = 30000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
