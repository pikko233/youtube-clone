import { StudioView } from "@/modules/studio/ui/views/studio-view";
import { DEFAULT_LIMIT } from "@/trpc/constants";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const Page = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.studio.getMany.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
      },
      { getNextPageParam: (lastPage) => lastPage.nextCursor },
    ),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StudioView />
    </HydrationBoundary>
  );
};

export default Page;
