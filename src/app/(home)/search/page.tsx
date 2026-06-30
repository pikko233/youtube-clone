import { DEFAULT_LIMIT } from "@/constants";
import { SearchView } from "@/modules/search/ui/views/search-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    query: string | undefined;
    categoryId: string | undefined;
  }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const { query, categoryId } = await searchParams;

  const queryClient = getQueryClient();
  // 加载分类
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());
  // 加载搜索结果视频(分页查询)
  void queryClient.prefetchInfiniteQuery(
    trpc.search.getMany.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
        query,
        categoryId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchView query={query} categoryId={categoryId} />
    </HydrationBoundary>
  );
};

export default Page;
