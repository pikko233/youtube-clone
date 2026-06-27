import { VideoView } from "@/modules/video/ui/views/video-view";
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
  void queryClient.prefetchQuery(
    trpc.video.getOne.queryOptions({ id: videoId }),
  );
  // TODO：记得改成分页查询
  void queryClient.prefetchQuery(
    trpc.comments.getMany.queryOptions({ videoId }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <VideoView videoId={videoId} />
    </HydrationBoundary>
  );
};

export default Page;
