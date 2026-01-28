"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AutoLogout() {
  const router = useRouter();
  // 10 perc = 600000 milliszekundum
  const TIMEOUT_MS = 10 * 60 * 1000; 
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // A kijelentkeztető függvény
  const logoutUser = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/"; // Teljes újratöltés, hogy biztosan eltűnjön a név
    } catch (error) {
      console.error("Logout hiba", error);
    }
  };

  // Az időzítő újraindítása (ha van aktivitás)
  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logoutUser, TIMEOUT_MS);
  };

  useEffect(() => {
    // Események, amikre figyelünk (egérmozgás, kattintás, gépelés, görgetés)
    const events = ["click", "mousemove", "keypress", "scroll", "touchstart"];

    // Eseményfigyelők hozzáadása
    events.forEach((event) => 
      window.addEventListener(event, resetTimer)
    );

    // Induláskor indítjuk az órát
    resetTimer();

    // Takarítás kilépéskor
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => 
        window.removeEventListener(event, resetTimer)
      );
    };
  }, []);

  return null; // Ez a komponens láthatatlan, csak a logikát csinálja
}