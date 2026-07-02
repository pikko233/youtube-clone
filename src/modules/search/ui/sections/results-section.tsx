"use client";

import { DEFAULT_LIMIT } from "@/constants";
import { useTRPC } from "@/trpc/client";
import {
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import {
  VideoRowCard,
  VideoRowCardSkeleton,
} from "@/modules/video/ui/components/video-row-card";
import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/modules/video/ui/components/video-grid-card";
import { useIsMobile } from "@/hooks/use-mobile";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface ResultsSectionProps {
  query: string | undefined;
  categoryId: string | undefined;
}

export const ResultsSection = (props: ResultsSectionProps) => {
  return (
    <Suspense
      key={`${props.query}-${props.categoryId}`}
      fallback={<ResultsSectionSkeleton />}
    >
      <ErrorBoundary fallback={<p>error</p>}>
        <ResultsSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

export const ResultsSectionSkeleton = () => {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <div className="flex flex-col gap-4 gap-y-10">
          {Array.from({ length: 5 }).map((_, index) => (
            <VideoGridCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 gap-y-10">
          {Array.from({ length: 5 }).map((_, index) => (
            <VideoRowCardSkeleton key={index} />
          ))}
        </div>
      )}
    </>
  );
};

export const ResultsSectionSuspense = ({
  query,
  categoryId,
}: ResultsSectionProps) => {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const {
    data: videos,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(
    trpc.search.getMany.infiniteQueryOptions(
      {
        query,
        categoryId,
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ),
  );

  return (
    <>
      {isMobile ? (
        <div className="flex flex-col gap-4 gap-y-10">
          {videos.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoGridCard key={video.id} data={video} />
            ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 gap-y-10">
          {videos.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoRowCard key={video.id} data={video} />
            ))}
        </div>
      )}
      <InfiniteScroll
        isFetching={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
    </>
  );
};
