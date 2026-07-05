"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useTRPC } from "@/trpc/client";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import "@/lib/zod-config";
import z from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_LIMIT } from "@/constants";
import { Loader2Icon, SquareCheckIcon, SquareIcon } from "lucide-react";
import { InfiniteScroll } from "@/components/infinite-scroll";

interface PlaylistCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
}

const formSchema = z.object({
  name: z.string().min(1),
});

export const PlaylistAddModal = ({
  videoId,
  open,
  onOpenChange,
}: PlaylistCreateModalProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const {
    data: playlists,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(
    trpc.playlists.getManyForVideo.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
        videoId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: !!videoId && open,
      },
    ),
  );

  const addVideo = useMutation(
    trpc.playlists.addVideo.mutationOptions({
      onSuccess: (data) => {
        toast.success("添加成功");
        void queryClient.invalidateQueries(
          trpc.playlists.getMany.infiniteQueryFilter(),
        );
        void queryClient.invalidateQueries(
          trpc.playlists.getManyForVideo.infiniteQueryFilter({ videoId }),
        );
        void queryClient.invalidateQueries(
          trpc.playlists.getOne.queryFilter({ id: data.playlistId }),
        );
        void queryClient.invalidateQueries(
          trpc.playlists.getVideos.queryFilter({ playlistId: data.playlistId }),
        );
      },
      onError: (error) => {
        toast.error(error.message || "操作失败请稍后再试");
      },
    }),
  );

  const removeVideo = useMutation(
    trpc.playlists.removeVideo.mutationOptions({
      onSuccess: () => {
        toast.success("移除成功");
        void queryClient.invalidateQueries(
          trpc.playlists.getMany.infiniteQueryFilter(),
        );
        void queryClient.invalidateQueries(
          trpc.playlists.getManyForVideo.infiniteQueryFilter({ videoId }),
        );
      },
      onError: (error) => {
        toast.error(error.message || "操作失败请稍后再试");
      },
    }),
  );

  return (
    <ResponsiveModal
      title="添加至播放列表"
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className="flex flex-col gap-2">
        {isLoading && (
          <div className="flex justify-center p-10">
            <Loader2Icon className="size-5 text-muted-foreground animate-spin" />
          </div>
        )}
        {!isLoading &&
          playlists?.pages
            .flatMap((page) => page.items)
            .map((playlist) => (
              <Button
                key={playlist.id}
                variant="ghost"
                className="w-full justify-start px-2 [&_svg]:size-5"
                size="lg"
                onClick={() => {
                  if (playlist.containsVideo) {
                    removeVideo.mutate({ videoId, playlistId: playlist.id });
                  } else {
                    addVideo.mutate({ videoId, playlistId: playlist.id });
                  }
                }}
                disabled={addVideo.isPending || removeVideo.isPending}
              >
                {playlist.containsVideo ? <SquareCheckIcon /> : <SquareIcon />}
                {playlist.name}
              </Button>
            ))}
      </div>
      <InfiniteScroll
        isFetching={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isManual
      />
    </ResponsiveModal>
  );
};
