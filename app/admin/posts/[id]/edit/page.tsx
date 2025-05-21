"use client";

import { notFound } from "next/navigation";
import { EditPostForm } from "@/components/admin/edit-post-form";
import { Suspense, use } from "react";

interface Params {
  id: string;
}

export default function EditPostPage({ params }: { params: Promise<Params> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <Suspense fallback={<div>Loading post...</div>}>
          <EditPostForm postId={id} />
        </Suspense>
      </div>
    </div>
  );
}




















// "use client";

// import { notFound } from "next/navigation";
// import { EditPostForm } from "@/components/admin/edit-post-form";
// import { Suspense, use } from "react";

// interface Params {
//   id: string;
// }

// export default function EditPostPage({ params }: { params: Promise<Params> }) {
//   const resolvedParams = use(params);
//   const { id } = resolvedParams;

//   return (
//     <div className="space-y-8">
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm border p-6">
//         <Suspense fallback={<div>Loading post...</div>}>
//           <EditPostForm postId={id} />
//         </Suspense>
//       </div>
//     </div>
//   );
// }










