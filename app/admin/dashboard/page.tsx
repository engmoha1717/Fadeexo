 
// import  RecentPosts from "@/components/admin/recent-posts";
// import  QuickActions  from "@/components/admin/quick-actions";
// import { DashboardStats } from "@/components/admin/dashboard-stats";

import { DashboardStats } from "@/components/admin/dashboard-stats";
import { QuickActions } from "@/components/admin/quick-actions";
import { RecentPosts } from "@/components/admin/recent-posts";

 

 

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentPosts />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}