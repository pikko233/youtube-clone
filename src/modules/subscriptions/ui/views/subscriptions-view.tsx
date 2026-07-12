import { SubscriptionsSection } from "../sections/subscriptions-section";

export const SubscriptionsView = () => {
  return (
    <div className="max-w-[800px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <div>
        <h1 className="text-2xl font-bold">所有订阅</h1>
        <p className="text-xs text-muted-foreground">管理你的订阅项目</p>
      </div>
      <SubscriptionsSection />
    </div>
  );
};
