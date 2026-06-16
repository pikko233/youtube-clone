"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { StudioUploader } from "./studio-uploader";
import { useRouter } from "next/navigation";

export const StudioUploadModel = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const create = useMutation(
    trpc.video.create.mutationOptions({
      onSuccess: async () => {
        toast.success("草稿视频已创建");
        await queryClient.invalidateQueries(
          trpc.studio.getMany.infiniteQueryFilter(), // 只刷新studio列表
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const onSuccess = () => {
    if (!create.data?.video.id) return;

    create.reset();
    router.push(`/studio/videos/${create.data.video.id}`);
  };

  return (
    <>
      <ResponsiveModal
        title="上传一段视频"
        open={!!create.data?.url}
        onOpenChange={() => create.reset()}
      >
        {create.data?.url ? (
          <StudioUploader endpoint={create.data.url} onSuccess={onSuccess} />
        ) : (
          <Loader2Icon className="animate-spin" />
        )}
      </ResponsiveModal>
      <Button
        variant="secondary"
        onClick={() => {
          create.mutate();
        }}
        disabled={create.isPending}
      >
        {create.isPending ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <PlusIcon />
        )}
        创建
      </Button>
    </>
  );
};
