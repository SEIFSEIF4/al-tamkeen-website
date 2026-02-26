"use client";

import { useState, useEffect } from "react";
import styles from "./countdown-timer.module.css";

interface CountdownTimerProps {
  targetDate: Date;
}

function getTimeRemaining(target: Date) {
  const now = new Date().getTime();
  const diff = target.getTime() - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [time, setTime] = useState(getTimeRemaining(targetDate));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTime(getTimeRemaining(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { value: time.seconds, label: "ثانية" },
    { value: time.minutes, label: "دقيقة" },
    { value: time.hours, label: "ساعة" },
    { value: time.days, label: "يوم" },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>الوقت المتبقي لانتهاء التقديم</div>
      <div className={styles.row}>
        {units.map((unit, i) => (
          <div className={styles.unit} key={unit.label}>
            {i > 0 && <span className={styles.separator}>:</span>}
            <div className={styles.card}>
              <span
                key={`${unit.label}-${unit.value}`}
                className={styles.number}
              >
                {mounted ? String(unit.value).padStart(2, "0") : "--"}
              </span>
              <span className={styles.label}>{unit.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
