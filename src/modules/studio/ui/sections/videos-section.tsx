"use client";

import { useTRPC } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/trpc/constants";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

export const VideosSection = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseInfiniteQuery(
    trpc.studio.getMany.infiniteQueryOptions(
      { limit: DEFAULT_LIMIT },
      { getNextPageParam: (lastPage) => lastPage.nextCursor },
    ),
  );

  return <div>{JSON.stringify(data)}</div>;
};
