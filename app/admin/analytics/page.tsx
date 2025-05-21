import { AnalyticsChart } from "@/components/admin/analytics-chart";
import { TopPosts } from "@/components/admin/top-posts";
import { ViewsOverview } from "@/components/admin/views-overview";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
      </div>

      <ViewsOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnalyticsChart />
        <TopPosts />
      </div>
    </div>
  );
}