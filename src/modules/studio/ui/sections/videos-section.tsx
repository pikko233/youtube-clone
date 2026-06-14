"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { useTRPC } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/trpc/constants";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { VideoThumbnail } from "@/modules/video/ui/components/video-thumbnail";
import { Globe2Icon, LockIcon } from "lucide-react";

const MUX_STATUS_LABELS: Record<string, string> = {
  waiting: "等待上传",
  preparing: "上传中",
  ready: "上传完毕",
  errored: "出错",
};

const getMuxStatusLabel = (status: string | null) => {
  if (!status) return "无";
  return MUX_STATUS_LABELS[status] ?? status;
};

export const VideosSection = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <VideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

export const VideosSectionSuspense = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const {
    data: videos,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery(
    trpc.studio.getMany.infiniteQueryOptions(
      { limit: DEFAULT_LIMIT },
      { getNextPageParam: (lastPage) => lastPage.nextCursor },
    ),
  );

  return (
    <div>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6 w-[510px]">视频</TableHead>
              <TableHead>是否可见</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>发布日期</TableHead>
              <TableHead>播放量</TableHead>
              <TableHead>评论数</TableHead>
              <TableHead>点赞量</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.pages
              .flatMap((page) => page.items)
              .map((video) => (
                <TableRow
                  className="cursor-pointer"
                  key={video.id}
                  onClick={() => router.push(`/studio/videos/${video.id}`)}
                >
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-4">
                      <div className="relative aspect-video w-36 shrink-0">
                        <VideoThumbnail
                          title={video.title}
                          imageUrl={video.thumbnailUrl}
                          previewUrl={video.previewUrl}
                          duration={video.duration}
                        />
                      </div>
                      <div className="flex flex-col overflow-hidden gap-y-1">
                        <span className="text-sm line-clamp-1">
                          {video.title}
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {video.description || "No description"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {video.visibility === "private" ? (
                        <LockIcon className="size-4" />
                      ) : (
                        <Globe2Icon className="size-4" />
                      )}
                      <span>
                        {video.visibility === "private" ? "私人" : "公开"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getMuxStatusLabel(video.muxStatus)}</TableCell>
                  <TableCell className="text-sm truncate">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>播放量</TableCell>
                  <TableCell>评论数</TableCell>
                  <TableCell>点赞量</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <InfiniteScroll
        hasNextPage={hasNextPage}
        isFetching={isFetching}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
};
