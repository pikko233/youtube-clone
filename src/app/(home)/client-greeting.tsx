"use client";
// <-- hooks can only be used in client components
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
export function ClientGreeting() {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(
    trpc.hello.queryOptions({ text: "world" }),
  );
  if (!data) return <div>Loading...</div>;
  return <div>{data.greeting}</div>;
}
