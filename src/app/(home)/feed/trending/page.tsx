import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { DEFAULT_LIMIT } from "@/constants";
import { TrendingView } from "@/modules/home/ui/views/trending-view";

export const dynamic = "force-dynamic";

const Page = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.video.getManyTrending.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ),
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TrendingView />
    </HydrationBoundary>
  );
};

export default Page;
