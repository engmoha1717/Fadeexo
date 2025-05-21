import {CreatePostForm}  from "@/components/admin/create-post-form";

export default function CreatePostPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <CreatePostForm />
      </div>
    </div>
  );
}