import { UserAvatar } from "@/components/user-avatar";
import { CommentsGetManyOutput } from "../../types";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MessageSquareIcon,
  MoreVerticalIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
} from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CommentItemProps {
  comment: CommentsGetManyOutput["items"][number];
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  const { userId } = useAuth();
  const clerk = useClerk();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // 删除评论
  const remove = useMutation(
    trpc.comments.remove.mutationOptions({
      onSuccess: () => {
        toast.success("删除成功");
        queryClient.invalidateQueries(
          trpc.comments.getMany.infiniteQueryFilter({
            videoId: comment.videoId,
          }),
        );
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          toast.info("请先登录");
          clerk.openSignIn();
        }
      },
    }),
  );

  // 点赞评论
  const like = useMutation(
    trpc.commentReactions.like.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.comments.getMany.infiniteQueryFilter({
            videoId: comment.videoId,
          }),
        );
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          toast.info("请先登录");
          clerk.openSignIn();
        }
      },
    }),
  );

  // 点踩评论
  const dislike = useMutation(
    trpc.commentReactions.dislike.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.comments.getMany.infiniteQueryFilter({
            videoId: comment.videoId,
          }),
        );
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          toast.info("请先登录");
          clerk.openSignIn();
        }
      },
    }),
  );

  return (
    <div>
      <div className="flex gap-4">
        {/* 用户头像 */}
        <Link href={`/users/${comment.userId}`}>
          <UserAvatar
            size="lg"
            imageUrl={comment.user.imageUrl}
            name={comment.user.name}
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/users/${comment.userId}`}>
            <div className="flex items-center gap-2 mb-0.5">
              {/* 用户名 */}
              <span className="font-medium text-sm pb-0.5">
                {comment.user.name}
              </span>
              {/* 评论时间 */}
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(comment.updatedAt, {
                  addSuffix: true,
                  locale: zhCN,
                })}
              </span>
            </div>
          </Link>
          {/* 评论内容 */}
          <p className="text-sm">{comment.value}</p>
          {/* 回复评论 */}
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center">
              <Button
                disabled={like.isPending || dislike.isPending}
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => like.mutate({ commentId: comment.id })}
              >
                <ThumbsUpIcon
                  className={cn(
                    comment.viewerReaction == "like" && "fill-black",
                  )}
                />
              </Button>
              <span className="text-xs text-muted-foreground">
                {comment.likeCount}
              </span>
              <Button
                disabled={like.isPending || dislike.isPending}
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => dislike.mutate({ commentId: comment.id })}
              >
                <ThumbsDownIcon
                  className={cn(
                    comment.viewerReaction == "dislike" && "fill-black",
                  )}
                />
              </Button>
              <span className="text-xs text-muted-foreground">
                {comment.dislikeCount}
              </span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => {}}>
                <MessageSquareIcon className="mr-1" />
                回复
              </DropdownMenuItem>
              {comment.user.clerkId === userId && (
                <DropdownMenuItem
                  onClick={() => remove.mutate({ id: comment.id })}
                >
                  <Trash2Icon className="mr-1" />
                  删除
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
