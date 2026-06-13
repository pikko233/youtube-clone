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
                  <TableCell className="pl-6">{video.title}</TableCell>
                  <TableCell>是否可见</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell>发布日期</TableCell>
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
