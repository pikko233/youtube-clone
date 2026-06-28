"use client";

import { useTRPC } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/trpc/constants";
import {
  useQueryClient,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { VideoRowCard } from "../components/video-row-card";
import { VideoGridCard } from "../components/video-grid-card";
import { InfiniteScroll } from "@/components/infinite-scroll";

interface SuggestionsSectionProps {
  videoId: string;
  isManual?: boolean;
}

export const SuggestionsSection = ({
  videoId,
  isManual,
}: SuggestionsSectionProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const {
    data: videos,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery(
    trpc.suggestions.getMany.infiniteQueryOptions(
      {
        videoId,
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ),
  );

  return (
    <>
      <div className="hidden md:block space-y-3 mt-5">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard
              key={video.id}
              size="compact"
              data={video}
              onRemove={() => {}}
            />
          ))}
      </div>
      <div className="block md:hidden space-y-10 mt-5">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard key={video.id} data={video} />
          ))}
      </div>
      <InfiniteScroll
        isFetching={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isManual={isManual}
      />
    </>
  );
};
