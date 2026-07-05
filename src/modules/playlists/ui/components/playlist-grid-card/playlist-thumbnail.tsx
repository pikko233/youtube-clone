"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { THUMBNAIL_FALLBACK } from "@/modules/video/constants";
import { ListVideoIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

interface PlaylistThumbnailProps {
  title: string;
  videoCount: number;
  className?: string;
  thumbnailUrl?: string;
}

export const PlaylistThumbnailSkeleton = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-xl aspect-video">
      <Skeleton className="size-full" />
    </div>
  );
};

export const PlaylistThumbnail = ({
  title,
  videoCount,
  className,
  thumbnailUrl,
}: PlaylistThumbnailProps) => {
  const compactVideoCount = useMemo(() => {
    return Intl.NumberFormat("zh", {
      notation: "compact",
    }).format(videoCount);
  }, [videoCount]);

  return (
    <div className={cn("relative pt-3 group", className)}>
      <div className="relative">
        {/* 占位元素：撑起容器高度 */}
        <div className="w-full aspect-video" aria-hidden="true" />
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[97%] overflow-hidden rounded-xl bg-black/20 aspect-video"></div>
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-[98.5%] overflow-hidden rounded-xl bg-black/25 aspect-video"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full overflow-hidden rounded-xl aspect-video">
          <Image
            src={thumbnailUrl || THUMBNAIL_FALLBACK}
            alt={title}
            className="w-full h-full object-cover"
            fill
          />

          {/* 鼠标悬浮效果 */}
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex justify-center items-center">
            <div className="flex items-center gap-2">
              <PlayIcon className="size-4 text-white fill-white" />
              <span className="text-white font-medium">播放全部</span>
            </div>
          </div>

          {/* 视频数量 */}
          <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded-sm bg-black/80 text-white text-xs font-medium flex items-center gap-x-1">
            <ListVideoIcon className="size-4" />
            {compactVideoCount} 条视频
          </div>
        </div>
      </div>
    </div>
  );
};
