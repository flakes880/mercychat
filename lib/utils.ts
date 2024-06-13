import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import util from "util"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function deepConsole (value: any) {
  console.log(util.inspect(value, false, null, true))
  return ;
}