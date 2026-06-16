import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDuration = (duration: number) => {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor(duration / 60000);

  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export const snakeCaseToTitle = (str: string) => {
  return str.replace(/_/g, "").replace(/\b\w/g, (char) => char.toUpperCase());
};

export const getMuxStatusLabel = (status: string | null) => {
  if (!status) return "无";
  const MUX_STATUS_LABELS: Record<string, string> = {
    waiting: "等待上传",
    preparing: "上传中",
    ready: "上传完毕",
    errored: "出错",
  };
  return MUX_STATUS_LABELS[status] ?? status;
};

export const getVisibilityLabel = (visibility: string | null) => {
  if (!visibility) return "无";

  const VISIBILITY_LABELS: Record<string, string> = {
    public: "公开",
    private: "私密",
  };

  return VISIBILITY_LABELS[visibility];
};
