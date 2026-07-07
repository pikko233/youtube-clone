"use client";

import { useTRPC } from "@/trpc/client";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  UserPageBanner,
  UserPageBannerSkeleton,
} from "../components/user-page-banner";
import {
  UserPageInfo,
  UserPageInfoSkeleton,
} from "../components/user-page-info";
import { Separator } from "@/components/ui/separator";

interface UserSectionProps {
  userId: string;
}

export const UserSection = (props: UserSectionProps) => {
  return (
    <Suspense fallback={<UserSectionSkeleton />}>
      <ErrorBoundary fallback={<p>error</p>}>
        <UserSectionSuspense {...props} />
      </ErrorBoundary>
    </Suspense>
  );
};

const UserSectionSkeleton = () => {
  return (
    <div className="flex flex-col">
      <UserPageBannerSkeleton />
      <UserPageInfoSkeleton />
    </div>
  );
};

const UserSectionSuspense = ({ userId }: UserSectionProps) => {
  const trpc = useTRPC();

  const { data: user } = useSuspenseQuery(
    trpc.users.getOne.queryOptions({ id: userId }),
  );

  return (
    <div className="flex flex-col">
      {/* 用户个人资料背景 */}
      <UserPageBanner user={user} />
      {/* 用户个人信息 */}
      <UserPageInfo user={user} />
      {/* 分割线 */}
      <Separator />
    </div>
  );
};
