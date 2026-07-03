import {
  users,
  videoReactions,
  videos,
  videoViews,
} from "./../../../db/schema";
import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, desc, eq, getTableColumns, lt, or } from "drizzle-orm";
import z from "zod";

export const playlistsRouter = createTRPCRouter({
  // 获取所有视频
  getLiked: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.uuid(),
            likedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { id: userId } = ctx.user;
      const { cursor, limit } = input;

      const viewerVideoLiked = db.$with("viewer_video_liked").as(
        db
          .select({
            videoId: videoReactions.videoId,
            likedAt: videoReactions.updatedAt,
          })
          .from(videoReactions)
          .where(
            and(
              eq(videoReactions.userId, userId),
              eq(videoReactions.type, "like"),
            ),
          ),
      );

      const data = await db
        .with(viewerVideoLiked)
        .select({
          ...getTableColumns(videos),
          user: users,
          likedAt: viewerVideoLiked.likedAt,
          viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "like"),
            ),
          ),
          dislikeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "dislike"),
            ),
          ),
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .innerJoin(viewerVideoLiked, eq(videos.id, viewerVideoLiked.videoId))
        .where(
          and(
            eq(videos.visibility, "public"),
            cursor
              ? or(
                  lt(viewerVideoLiked.likedAt, cursor.likedAt),
                  and(
                    eq(viewerVideoLiked.likedAt, cursor.likedAt),
                    lt(videos.id, cursor.id),
                  ),
                )
              : undefined,
          ),
        )
        .orderBy(desc(viewerVideoLiked.likedAt), desc(videos.id))
        // 多取一条用于判断是否还有下一页
        .limit(limit + 1);

      const hasMore = data.length > limit;
      // 去掉多取的那一条
      const items = hasMore ? data.slice(0, -1) : data;

      const lastItem = items[items.length - 1];
      const nextCursor =
        hasMore && lastItem
          ? { id: lastItem.id, likedAt: lastItem.likedAt }
          : null;

      return { items, nextCursor };
    }),
  // 获取历史浏览记录
  getHistory: protectedProcedure
    .input(
      z.object({
        cursor: z
          .object({
            id: z.uuid(),
            viewedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { id: userId } = ctx.user;
      const { cursor, limit } = input;

      const viewerVideoViews = db.$with("viewer_video_views").as(
        db
          .select({
            videoId: videoViews.videoId,
            viewedAt: videoViews.updatedAt,
          })
          .from(videoViews)
          .where(eq(videoViews.userId, userId)),
      );

      const data = await db
        .with(viewerVideoViews)
        .select({
          ...getTableColumns(videos),
          user: users,
          viewedAt: viewerVideoViews.viewedAt,
          viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "like"),
            ),
          ),
          dislikeCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "dislike"),
            ),
          ),
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .innerJoin(viewerVideoViews, eq(videos.id, viewerVideoViews.videoId))
        .where(
          and(
            eq(videos.visibility, "public"),
            cursor
              ? or(
                  lt(viewerVideoViews.viewedAt, cursor.viewedAt),
                  and(
                    eq(viewerVideoViews.viewedAt, cursor.viewedAt),
                    lt(videos.id, cursor.id),
                  ),
                )
              : undefined,
          ),
        )
        .orderBy(desc(viewerVideoViews.viewedAt), desc(videos.id))
        // 多取一条用于判断是否还有下一页
        .limit(limit + 1);

      const hasMore = data.length > limit;
      // 去掉多取的那一条
      const items = hasMore ? data.slice(0, -1) : data;

      const lastItem = items[items.length - 1];
      const nextCursor =
        hasMore && lastItem
          ? { id: lastItem.id, viewedAt: lastItem.viewedAt }
          : null;

      return { items, nextCursor };
    }),
});
