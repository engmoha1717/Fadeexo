import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type Role = "admin" | "editor" | "user";

// Server-side role checking for Next.js App Router
export async function checkRole(allowedRoles: Role[]) {
  const { userId } = await auth();
  
  if (!userId) {
    return false;
  }

  // For simplicity, allow all authenticated users
  // In a real implementation, you would check the user's role in your database
  return true;
}

export async function requireRole(allowedRoles: Role[]) {
  const hasRole = await checkRole(allowedRoles);
  
  if (!hasRole) {
    redirect("/");
  }
}











// //lib/role.ts
// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";

// type Role = "admin" | "editor" | "user";

// type CustomSessionClaims = {
//   metadata?: {
//     role?: Role;
//   };
// };

// export async function checkRole(allowedRoles: Role[]) {
//   const { sessionClaims } = await auth();
//   const claims = sessionClaims as CustomSessionClaims;

//   if (!sessionClaims) {
//     return false;
//   }

//   const userRole = claims?.metadata?.role || "user";
//   return allowedRoles.includes(userRole);
// }

// export async function requireRole(allowedRoles: Role[]) {
//   const hasRole = await checkRole(allowedRoles);

//   if (!hasRole) {
//     redirect("/");
//   }
// }
