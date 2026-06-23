import { useMemo } from "react";
import { VideoGetOneOutput } from "../../types";
import { VideoDescription } from "./video-description";
import { VideoMenu } from "./video-menu";
import { VideoOwner } from "./video-owner";
import { VideoReactions } from "./video-reactions";
import { format, formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

interface VideoTopRowProps {
  video: VideoGetOneOutput;
}

export const VideoTopRow = ({ video }: VideoTopRowProps) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("zh", {
      notation: "compact",
    }).format(video.viewCount);
  }, [video.viewCount]);
  const expandedViews = useMemo(() => {
    return Intl.NumberFormat("zh", {
      notation: "standard",
    }).format(video.viewCount);
  }, [video.viewCount]);
  const compactDate = useMemo(() => {
    return formatDistanceToNow(video.createdAt, {
      addSuffix: true,
      locale: zhCN,
    });
  }, [video.createdAt]);
  const expandedDate = useMemo(() => {
    return format(video.createdAt, "yyyy年M月d日", { locale: zhCN });
  }, [video.createdAt]);
  return (
    <div className="flex flex-col gap-4 mt-4">
      {/* 视频标题 */}
      <h1 className="text-xl font-semibold">{video.title}</h1>
      {/* 视频博主信息 */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <VideoOwner user={video.user} videoId={video.id} />
        {/* 点赞/收藏 */}
        <div className="flex items-center overflow-x-auto sm:min-w-[calc(50% - 6px)] sm:justify-end sm:overflow-visible pb-2 -mb-2 sm:pb-0 sm:mb-0 gap-2">
          <VideoReactions />
          <VideoMenu videoId={video.id} variant="secondary" />
        </div>
      </div>
      {/* 视频简介信息 */}
      <VideoDescription
        compactViews={compactViews}
        expandedViews={expandedViews}
        compactDate={compactDate}
        expandedDate={expandedDate}
        description={video.description!}
      />
    </div>
  );
};
