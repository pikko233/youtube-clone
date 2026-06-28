import { VideoView } from "@/modules/video/ui/views/video-view";
import { DEFAULT_LIMIT } from "@/trpc/constants";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface PageProps {
  params: Promise<{
    videoId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { videoId } = await params;

  const queryClient = getQueryClient();
  // 获取视频详情
  void queryClient.prefetchQuery(
    trpc.video.getOne.queryOptions({ id: videoId }),
  );
  // 获取评论列表
  void queryClient.prefetchInfiniteQuery(
    trpc.comments.getMany.infiniteQueryOptions(
      {
        videoId,
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ),
  );
  // 获取推荐视频列表
  void queryClient.prefetchInfiniteQuery(
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
    <HydrationBoundary state={dehydrate(queryClient)}>
      <VideoView videoId={videoId} />
    </HydrationBoundary>
  );
};

export default Page;
