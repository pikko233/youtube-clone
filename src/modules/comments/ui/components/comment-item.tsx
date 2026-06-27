import { UserAvatar } from "@/components/user-avatar";
import { CommentsGetManyOutput } from "../../types";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

interface CommentItemProps {
  comment: CommentsGetManyOutput[number];
}

export const CommentItem = ({ comment }: CommentItemProps) => {
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
        </div>
      </div>
    </div>
  );
};
