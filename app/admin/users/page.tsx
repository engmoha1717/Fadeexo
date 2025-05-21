import {UsersTable} from "@/components/admin/users-table";
import { checkRole } from "@/lib/roles";
import { redirect } from "next/navigation";
 

export default async function UsersPage() {
  // Only admins can access user management
  const isAdmin = await checkRole(["admin"]);
  
  if (!isAdmin) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
      </div>

      <UsersTable/>
    </div>
  );
}