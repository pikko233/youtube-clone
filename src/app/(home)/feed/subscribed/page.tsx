import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { DEFAULT_LIMIT } from "@/constants";
import { SubscribedView } from "@/modules/home/ui/views/subscribed-view";

export const dynamic = "force-dynamic";

const Page = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.video.getManySubscribed.infiniteQueryOptions(
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
      <SubscribedView />
    </HydrationBoundary>
  );
};

export default Page;
