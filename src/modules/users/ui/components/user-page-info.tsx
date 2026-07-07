import { UserAvatar } from "@/components/user-avatar";
import { UserGetOneOutput } from "../../types";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SubscriptionButton } from "@/modules/subscriptions/ui/components/subscription-button";
import { useSubscription } from "@/modules/subscriptions/hooks/use-subscription";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface UserPageInfoProps {
  user: UserGetOneOutput;
}

export const UserPageInfoSkeleton = () => {
  return (
    <div className="py-6">
      {/* 移动端骨架屏 */}
      <div className="flex flex-col md:hidden">
        <div className="flex items-center gap-3">
          {/* 用户头像 */}
          <Skeleton className="h-[60px] w-[60px] rounded-full" />
          {/* 用户信息 */}
          <div className="flex-1 min-w-0">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48 mt-1" />
          </div>
        </div>
        <Skeleton className="w-full h-10 mt-3 rounded-full" />
      </div>

      {/* PC端骨架屏 */}
      <div className="hidden md:flex items-start gap-4">
        <Skeleton className="h-[160px] w-[160px] rounded-full" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-48 mt-4" />
          <Skeleton className="h-10 w-32 mt-3 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const UserPageInfo = ({ user }: UserPageInfoProps) => {
  const { userId, isLoaded } = useAuth();
  const clerk = useClerk();
  const { isPending, onClick } = useSubscription({
    userId: user.id,
    isSubscribed: user.viewerSubscribed,
  });

  return (
    <div className="py-6">
      {/* 移动端 */}
      <div className="flex flex-col md:hidden">
        <div className="flex items-center gap-3">
          {/* 用户头像 */}
          <UserAvatar
            size="lg"
            imageUrl={user.imageUrl}
            name={user.name}
            className="h-[60px] w-[60px]"
            onClick={() => {
              if (user.clerkId === userId) {
                clerk.openUserProfile();
              }
            }}
          />
          {/* 用户信息 */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold">{user.name}</h1>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <span>{user.subscriberCount} 粉丝</span>
              <span>&bull;</span>
              <span>{user.videoCount} 视频</span>
            </div>
          </div>
        </div>
        {/*  */}
        {userId === user.clerkId ? (
          <Button
            asChild
            variant="secondary"
            className="w-full mt-3 py-5 rounded-full"
          >
            <Link href="/studio">前往工作台</Link>
          </Button>
        ) : (
          <SubscriptionButton
            disabled={isPending || !isLoaded}
            isSubscriped={user.viewerSubscribed}
            onClick={onClick}
            className="w-full mt-3 py-5"
          />
        )}
      </div>

      {/* PC端 */}
      <div className="hidden md:flex items-start gap-4">
        {/* 用户头像 */}
        <UserAvatar
          size="xl"
          imageUrl={user.imageUrl}
          name={user.name}
          className={cn(
            userId === user.clerkId && "cursor-pointer hover:opacity-80",
          )}
          onClick={() => {
            if (user.clerkId === userId) {
              clerk.openUserProfile();
            }
          }}
        />
        {/* 用户信息 */}
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-bold">{user.name}</h1>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-3">
            <span>{user.subscriberCount} 粉丝</span>
            <span>&bull;</span>
            <span>{user.videoCount} 视频</span>
          </div>
          {/*  */}
          {userId === user.clerkId ? (
            <Button
              asChild
              variant="secondary"
              className="w-[100px] mt-3 py-5 rounded-full"
            >
              <Link href="/studio">前往工作台</Link>
            </Button>
          ) : (
            <SubscriptionButton
              disabled={isPending || !isLoaded}
              isSubscriped={user.viewerSubscribed}
              onClick={onClick}
              className="w-[100px] mt-3 py-5"
            />
          )}
        </div>
      </div>
    </div>
  );
};
