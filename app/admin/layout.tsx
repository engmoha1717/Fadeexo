import { redirect } from "next/navigation";
import { checkRole } from "@/lib/roles";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdminOrEditor = await checkRole(["admin", "editor"]);
  
  if (!isAdminOrEditor) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}



















// //admin/layout.tsx
// import { redirect } from "next/navigation";
// import { checkRole } from "@/lib/roles";
// import { AdminSidebar } from "@/components/admin/admin-sidebar";
// import { AdminHeader } from "@/components/admin/admin-header";

// export default async function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {

//   const isAdminOrEditor = await checkRole(["admin", "editor"]);
  
//   if (isAdminOrEditor) {
//     redirect("/");
//   }

//   return (
//     <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
//       <AdminHeader />
//       <div className="flex">
//         <AdminSidebar />
//         <main className="flex-1 p-6">
//           <div className="max-w-7xl mx-auto">
//             {children}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }