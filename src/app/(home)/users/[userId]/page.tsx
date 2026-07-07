import { DEFAULT_LIMIT } from "@/constants";
import { UserView } from "@/modules/users/ui/views/user-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { userId } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.users.getOne.queryOptions({ id: userId }),
  );
  void queryClient.prefetchInfiniteQuery(
    trpc.video.getMany.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
        userId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserView userId={userId} />
    </HydrationBoundary>
  );
};

export default Page;
