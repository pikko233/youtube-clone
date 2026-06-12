"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";

export const StudioUploadModel = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const create = useMutation(
    trpc.video.create.mutationOptions({
      onSuccess: () => {
        toast.success("视频创建成功");
        queryClient.invalidateQueries(
          trpc.studio.getMany.infiniteQueryFilter(), // 只刷新studio列表
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  return (
    <Button
      variant="secondary"
      onClick={() => create.mutate()}
      disabled={create.isPending}
    >
      {create.isPending ? <Loader2Icon /> : <PlusIcon />}
      创建
    </Button>
  );
};
