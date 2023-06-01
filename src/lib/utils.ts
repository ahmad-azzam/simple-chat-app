import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(...inputs));

export const chatHrefConstructor = (id1: string, id2: string) => {
  const sortedId = [id1, id2].sort();

  return `${sortedId[0]}--${sortedId[1]}`;
};
