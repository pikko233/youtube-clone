import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Image from "next/image";
import { ClientGreeting } from "./client-greeting";

export default async function Home() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.hello.queryOptions({
      text: "world",
    }),
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientGreeting />
    </HydrationBoundary>
  );
  return (
    <div>
      <Image src="/logo.svg" height={50} width={50} alt="Logo" />
      <p className="text-xl font-semibold tracking-tighter">NewTube</p>
      <p>加载视频...</p>
    </div>
  );
}
