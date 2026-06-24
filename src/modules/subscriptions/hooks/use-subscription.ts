import { useTRPC } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseSubscriptionProps {
  userId: string;
  isSubscribed: boolean;
  fromVideoId?: string;
}

export const useSubscription = ({
  userId,
  isSubscribed,
  fromVideoId,
}: UseSubscriptionProps) => {
  const clerk = useClerk();
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const subscribe = useMutation(
    trpc.subscriptions.create.mutationOptions({
      onSuccess: () => {
        toast.success("订阅成功~");
        if (fromVideoId) {
          // 如果是在视频播放页面点击的订阅
          // 重新刷新视频详情信息，获取最新订阅数
          queryClient.invalidateQueries(
            trpc.video.getOne.queryFilter({ id: fromVideoId }),
          );
        }
      },
      onError: (error) => {
        toast.error(error.message || "订阅失败");
        if (error.data?.code === "UNAUTHORIZED") {
          clerk.openSignIn(); // 打开登录弹窗，让用户登录
        }
      },
    }),
  );
  const unsubscribe = useMutation(
    trpc.subscriptions.remove.mutationOptions({
      onSuccess: () => {
        toast.success("已取消订阅~");
        if (fromVideoId) {
          // 如果是在视频播放页面点击的订阅
          // 重新刷新视频详情信息，获取最新订阅数
          queryClient.invalidateQueries(
            trpc.video.getOne.queryFilter({ id: fromVideoId }),
          );
        }
      },
      onError: (error) => {
        toast.error(error.message || "取消订阅失败");
        if (error.data?.code === "UNAUTHORIZED") {
          clerk.openSignIn(); // 打开登录弹窗，让用户登录
        }
      },
    }),
  );
  const isPending = subscribe.isPending || unsubscribe.isPending;

  const onClick = () => {
    if (isSubscribed) {
      unsubscribe.mutate({ userId });
    } else {
      subscribe.mutate({ userId });
    }
  };

  return {
    isPending,
    onClick,
  };
};
