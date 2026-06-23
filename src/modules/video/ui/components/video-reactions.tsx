import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";

import { VideoGetOneOutput } from "../../types";
import { useClerk } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";

interface VideoReactionsProps {
  videoId: string;
  likes: number;
  dislikes: number;
  viewerReaction: VideoGetOneOutput["viewerReaction"];
}

export const VideoReactions = ({
  videoId,
  likes,
  dislikes,
  viewerReaction,
}: VideoReactionsProps) => {
  const clerk = useClerk();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const like = useMutation(
    trpc.videoReactions.like.mutationOptions({
      onError: (error) => {
        if (error.message) {
          toast.error(error.message);
        }
        if (error.data?.code === "UNAUTHORIZED") {
          clerk.openSignIn();
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.video.getOne.queryFilter({ id: videoId }),
        );
      },
    }),
  );
  const dislike = useMutation(
    trpc.videoReactions.dislike.mutationOptions({
      onError: (error) => {
        if (error.message) {
          toast.error(error.message);
        }
        if (error.data?.code === "UNAUTHORIZED") {
          clerk.openSignIn();
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.video.getOne.queryFilter({ id: videoId }),
        );
      },
    }),
  );

  return (
    <div className="flex items-center flex-none">
      <Button
        variant="secondary"
        className="rounded-l-full rounded-r-none gap-2 px-4"
        onClick={() => like.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
      >
        <ThumbsUpIcon
          className={cn("size-5", viewerReaction === "like" && "fill-black")}
        />
        {likes}
      </Button>
      <Separator orientation="vertical" className="h-8" />
      <Button
        variant="secondary"
        className="rounded-r-full rounded-l-none gap-2 px-4"
        onClick={() => dislike.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
      >
        <ThumbsDownIcon
          className={cn("size-5", viewerReaction !== "like" && "fill-black")}
        />
        {dislikes}
      </Button>
    </div>
  );
};
