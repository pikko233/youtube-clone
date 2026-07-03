import { categoriesRouter } from "@/modules/categories/server/procedures";

import { createTRPCRouter } from "../init";
import { studioRouter } from "@/modules/studio/server/procedure";
import { videoRouter } from "@/modules/video/server/procedure";
import { videoViewsRouter } from "@/modules/video-views/server/procedure";
import { videoReactionsRouter } from "@/modules/video-reactions/server/procedure";
import { subscriptionsRouter } from "@/modules/subscriptions/server/procedure";
import { commentsRouter } from "@/modules/comments/server/procedure";
import { commentReactionsRouter } from "@/modules/commentReactions/server/procedure";
import { suggestionsRouter } from "@/modules/suggestions/server/procedure";
import { searchRouter } from "@/modules/search/server/procedure";
import { playlistsRouter } from "@/modules/playlists/server/procedure";
export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  studio: studioRouter,
  video: videoRouter,
  playlists: playlistsRouter,
  search: searchRouter,
  videoViews: videoViewsRouter,
  videoReactions: videoReactionsRouter,
  subscriptions: subscriptionsRouter,
  comments: commentsRouter,
  commentReactions: commentReactionsRouter,
  suggestions: suggestionsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
