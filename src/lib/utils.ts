import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateShort(date: Date | string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function formatTimeAgo(date: Date | string): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " anos atrás";
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " meses atrás";
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " dias atrás";
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " horas atrás";
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutos atrás";
  
  return "agora mesmo";
}
