import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { HomeView } from "@/modules/home/ui/views/home-view";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    categoryId?: string;
  }>;
}

const Page = async ({ searchParams }: PageProps) => {
  const { categoryId } = await searchParams;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeView categoryId={categoryId} />
    </HydrationBoundary>
  );
};

interface PageProps {
  searchParams: Promise<{
    categoryId?: string;
  }>;
}

export default Page;
