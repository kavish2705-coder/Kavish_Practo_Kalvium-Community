import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRefId(): string {
  return "PRAC-" + Math.floor(100000 + Math.random() * 900000);
}
