import { cva, VariantProps } from "class-variance-authority";
import { VideoGetManyOutput } from "../../types";
import Link from "next/link";
import { VideoThumbnail } from "./video-thumbnail";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { UserInfo } from "@/modules/users/ui/components/user-info";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VideoMenu } from "./video-menu";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const videoRowCardVariants = cva("group flex min-w-0", {
  variants: {
    size: {
      default: "gap-4",
      compact: "gap-2",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const thumbnailVariants = cva("relative flex-none", {
  variants: {
    size: {
      default: "w-[38%]",
      compact: "w-[168px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface VideoRowCardProps extends VariantProps<typeof videoRowCardVariants> {
  data: VideoGetManyOutput["items"][number];
  onRemove?: () => void;
}

export const VideoRowCardSkeleton = () => {
  return (
    <div>
      <Skeleton />
    </div>
  );
};

export const VideoRowCard = ({
  data,
  size = "default",
  onRemove,
}: VideoRowCardProps) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("zh", {
      notation: "compact",
    }).format(data.viewCount);
  }, [data.viewCount]);

  const compactLikes = useMemo(() => {
    return Intl.NumberFormat("zh", {
      notation: "compact",
    }).format(data.likeCount);
  }, [data.likeCount]);

  return (
    <div className={videoRowCardVariants({ size })}>
      {/* 视频封面 */}
      <Link href={`/videos/${data.id}`} className={thumbnailVariants({ size })}>
        <VideoThumbnail
          imageUrl={data.thumbnailUrl}
          previewUrl={data.previewUrl}
          title={data.title}
          duration={data.duration ?? 0}
        />
      </Link>

      {/* 视频信息 */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <Link href={`/videos/${data.id}`} className="flex-1 min-w-0">
            {/* 视频标题 */}
            <h3
              className={cn(
                "font-medium line-clamp-2",
                size === "compact" ? "text-sm" : "text-base",
              )}
            >
              {data.title}
            </h3>
            {/* 大屏幕-视频信息横向展示 */}
            {size === "default" && (
              <p className="text-xs text-muted-foreground">
                {compactViews} 播放量 • {compactLikes} 点赞
              </p>
            )}
            {size === "default" && (
              <>
                <div className="flex items-center gap-2 my-2">
                  <UserAvatar
                    size="sm"
                    imageUrl={data.user.imageUrl}
                    name={data.user.name}
                  />
                  <UserInfo size="sm" name={data.user.name} />
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-xs text-muted-foreground w-fit line-clamp-2">
                      {data.description ?? "暂无简介"}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="center"
                    className="bg-black/70"
                  >
                    <p>来自视频简介</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
            {/* 小屏幕-视频信息纵向展示 */}
            {size === "compact" && <UserInfo size="sm" name={data.user.name} />}
            {size === "compact" && (
              <p className="text-xs text-muted-foreground">
                {compactViews} 播放量 • {compactLikes} 点赞
              </p>
            )}
          </Link>
          <div className="flex-none">
            <VideoMenu videoId={data.id} onRemove={onRemove} />
          </div>
        </div>
      </div>
    </div>
  );
};
