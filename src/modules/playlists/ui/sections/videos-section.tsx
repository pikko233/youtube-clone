"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/modules/video/ui/components/video-grid-card";
import {
  VideoRowCard,
  VideoRowCardSkeleton,
} from "@/modules/video/ui/components/video-row-card";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { toast } from "sonner";

interface VideosSectionProps {
  playlistId: string;
}

export const VideosSection = (props: VideosSectionProps) => {
  return (
    <Suspense fallback={<VideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>error</p>}>
        <VideosSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideosSectionSkeleton = () => {
  return (
    <>
      <div className="flex flex-col gap-4 md:hidden">
        {Array.from({ length: 18 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
      <div className="hidden md:flex flex-col gap-4">
        {Array.from({ length: 18 }).map((_, index) => (
          <VideoRowCardSkeleton key={index} size="compact" />
        ))}
      </div>
    </>
  );
};

const VideosSectionSuspense = ({ playlistId }: VideosSectionProps) => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const {
    data: videos,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery(
    trpc.playlists.getVideos.infiniteQueryOptions(
      { limit: DEFAULT_LIMIT, playlistId },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ),
  );

  // 将此视频从播放列表中移除
  const removeVideo = useMutation(
    trpc.playlists.removeVideo.mutationOptions({
      onSuccess: (data) => {
        toast.success("移除成功");
        void queryClient.invalidateQueries(
          trpc.playlists.getMany.infiniteQueryFilter(),
        );
        void queryClient.invalidateQueries(
          trpc.playlists.getManyForVideo.infiniteQueryFilter({
            videoId: data.videoId,
          }),
        );
        void queryClient.invalidateQueries(
          trpc.playlists.getOne.queryFilter({ id: data.playlistId }),
        );
        void queryClient.invalidateQueries(
          trpc.playlists.getVideos.infiniteQueryFilter({ playlistId }),
        );
      },
      onError: (error) => {
        toast.error(error.message || "操作失败");
      },
    }),
  );

  return (
    <div>
      <div className="flex flex-col gap-4 md:hidden">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard
              key={video.id}
              data={video}
              onRemove={() =>
                removeVideo.mutate({ playlistId, videoId: video.id })
              }
            />
          ))}
      </div>
      <div className="hidden md:flex flex-col gap-4">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard
              key={video.id}
              data={video}
              size="compact"
              onRemove={() =>
                removeVideo.mutate({ playlistId, videoId: video.id })
              }
            />
          ))}
      </div>
      <InfiniteScroll
        isFetching={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
};
