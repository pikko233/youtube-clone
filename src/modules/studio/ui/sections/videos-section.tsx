"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { useTRPC } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
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
import { Skeleton } from "@/components/ui/skeleton";
import { getMuxStatusLabel, getVisibilityLabel } from "@/lib/utils";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

export const VideosSection = () => {
  return (
    <Suspense fallback={<VideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <VideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

export const VideosSectionSkeleton = () => {
  return (
    <>
      <div className="border-y">
        <Table className="table-fixed">
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
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="pl-6 w-[510px]">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-36" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-3 w-[150px]" />
                    </div>
                  </div>
                </TableCell>
                {Array.from({ length: 6 }).map((_, index) => (
                  <TableCell key={index}>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
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
        <Table className="table-fixed">
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
                      <div className="flex flex-col overflow-hidden gap-y-1 min-w-0">
                        <span className="text-sm truncate">{video.title}</span>
                        <span className="text-xs text-muted-foreground truncate">
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
                      <span>{getVisibilityLabel(video.visibility)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getMuxStatusLabel(video.muxStatus)}</TableCell>
                  <TableCell className="text-sm truncate">
                    {format(new Date(video.createdAt), "yyyy/M/d", {
                      locale: zhCN,
                    })}
                  </TableCell>
                  <TableCell>{video.viewCount}</TableCell>
                  <TableCell>{video.commentCount}</TableCell>
                  <TableCell>{video.likeCount}</TableCell>
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
