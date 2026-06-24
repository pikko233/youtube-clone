import { categoriesRouter } from "@/modules/categories/server/procedures";

import { createTRPCRouter } from "../init";
import { studioRouter } from "@/modules/studio/server/procedure";
import { videoRouter } from "@/modules/video/server/procedure";
import { videoViewsRouter } from "@/modules/video-views/server/procedure";
import { videoReactionsRouter } from "@/modules/video-reactions/server/procedure";
import { subscriptionsRouter } from "@/modules/subscriptions/server/procedure";
export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  studio: studioRouter,
  video: videoRouter,
  videoViews: videoViewsRouter,
  videoReactions: videoReactionsRouter,
  subscriptions: subscriptionsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
