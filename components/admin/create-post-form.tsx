"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
 
import { Upload, X } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { RichTextEditor } from "../ui/rich-text-editor";

export function CreatePostForm() {
  const router = useRouter();
  
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    categoryId: "",
    regionId: "",
    status: "draft" as "draft" | "published" | "archived",
    featured: false,
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = useQuery(api.categories.getAllCategories);
  const regions = useQuery(api.regions.getAllRegions);
  const createPost = useMutation(api.posts.createPost);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug from title
    if (field === "title" && typeof value === "string") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const uploadImage = async (): Promise<Id<"_storage"> | null> => {
    if (!imageFile) return null;

    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": imageFile.type },
        body: imageFile,
      });

      if (!result.ok) {
        throw new Error("Failed to upload image");
      }

      const { storageId } = await result.json();
      return storageId;
    } catch (error) {
      console.error("Image upload error:", error);
      toast("Failed to upload image");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.content || !formData.categoryId) {
      toast("Please fill out all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image if selected
      const imageId = await uploadImage();

      // Create post
      await createPost({
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        content: formData.content,
        categoryId: formData.categoryId as Id<"categories">,
        regionId: formData.regionId ? (formData.regionId as Id<"regions">) : undefined,
        imageId: imageId || undefined,
        status: formData.status,
        featured: formData.featured,
      });

      toast("Post created successfully");

      router.push("/admin/posts");
    } catch (error) {
      console.error("Error creating post:", error);
      toast("Error creating post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter post title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", e.target.value)}
                  placeholder="post-url-slug"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Brief description of the post"
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(value) => handleInputChange("content", value)}
                  placeholder="Write your post content here..."
                  className="min-h-[300px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-700">Upload an image</span>
                      <span className="text-gray-500"> or drag and drop</span>
                    </Label>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publish Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleInputChange("featured", checked)}
                />
                <Label htmlFor="featured">Featured Post</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories & Regions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => handleInputChange("categoryId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="region">Region</Label>
                <Select
                  value={formData.regionId}
                  onValueChange={(value) => handleInputChange("regionId", value === "none" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No region</SelectItem>
                    {regions?.map((region) => (
                      <SelectItem key={region._id} value={region._id}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Post"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={() => router.push("/admin/posts")}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}






























// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useMutation, useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch";
 
// import { Upload, X } from "lucide-react";
// import { Id } from "@/convex/_generated/dataModel";
// import { toast } from "sonner";

// export function CreatePostForm() {
//   const router = useRouter();
  
  
//   const [formData, setFormData] = useState({
//     title: "",
//     slug: "",
//     description: "",
//     content: "",
//     categoryId: "",
//     regionId: "",
//     status: "draft" as "draft" | "published" | "archived",
//     featured: false,
//   });
  
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const categories = useQuery(api.categories.getAllCategories);
//   const regions = useQuery(api.regions.getAllRegions);
//   const createPost = useMutation(api.posts.createPost);
//   const generateUploadUrl = useMutation(api.files.generateUploadUrl);

//   const handleInputChange = (field: string, value: string | boolean) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));

//     // Auto-generate slug from title
//     if (field === "title" && typeof value === "string") {
//       const slug = value
//         .toLowerCase()
//         .replace(/[^a-z0-9\s-]/g, "")
//         .replace(/\s+/g, "-")
//         .replace(/-+/g, "-")
//         .trim();
//       setFormData(prev => ({ ...prev, slug }));
//     }
//   };

//   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       const previewUrl = URL.createObjectURL(file);
//       setImagePreview(previewUrl);
//     }
//   };

//   const removeImage = () => {
//     setImageFile(null);
//     setImagePreview(null);
//   };

//   const uploadImage = async (): Promise<Id<"_storage"> | null> => {
//     if (!imageFile) return null;

//     try {
//       const uploadUrl = await generateUploadUrl();
//       const result = await fetch(uploadUrl, {
//         method: "POST",
//         headers: { "Content-Type": imageFile.type },
//         body: imageFile,
//       });

//       if (!result.ok) {
//         throw new Error("Failed to upload image");
//       }

//       const { storageId } = await result.json();
//       return storageId;
//     } catch (error) {
//       console.error("Image upload error:", error);
//       toast("Failed to upload image");
//       return null;
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.title || !formData.description || !formData.content || !formData.categoryId) {
//       toast("Please fill in all fields");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       // Upload image if selected
//       const imageId = await uploadImage();

//       // Create post
//       await createPost({
//         title: formData.title,
//         slug: formData.slug,
//         description: formData.description,
//         content: formData.content,
//         categoryId: formData.categoryId as Id<"categories">,
//         regionId: formData.regionId ? (formData.regionId as Id<"regions">) : undefined,
//         imageId: imageId || undefined,
//         status: formData.status,
//         featured: formData.featured,
//       });

//       toast("Post created successfully");

//       router.push("/admin/posts");
//     } catch (error) {
//       console.error("Error creating post:", error);
//       toast("Error creating post");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-8">
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Main Content */}
//         <div className="lg:col-span-2 space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Post Content</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <Label htmlFor="title">Title *</Label>
//                 <Input
//                   id="title"
//                   value={formData.title}
//                   onChange={(e) => handleInputChange("title", e.target.value)}
//                   placeholder="Enter post title"
//                   required
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="slug">Slug *</Label>
//                 <Input
//                   id="slug"
//                   value={formData.slug}
//                   onChange={(e) => handleInputChange("slug", e.target.value)}
//                   placeholder="post-url-slug"
//                   required
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="description">Description *</Label>
//                 <Textarea
//                   id="description"
//                   value={formData.description}
//                   onChange={(e) => handleInputChange("description", e.target.value)}
//                   placeholder="Brief description of the post"
//                   className="min-h-[100px]"
//                   required
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="content">Content *</Label>
//                 <Textarea
//                   id="content"
//                   value={formData.content}
//                   onChange={(e) => handleInputChange("content", e.target.value)}
//                   placeholder="Full post content"
//                   className="min-h-[300px]"
//                   required
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           {/* Featured Image */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Featured Image</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {imagePreview ? (
//                 <div className="relative">
//                   <img
//                     src={imagePreview}
//                     alt="Preview"
//                     className="w-full h-64 object-cover rounded-lg"
//                   />
//                   <Button
//                     type="button"
//                     variant="destructive"
//                     size="sm"
//                     className="absolute top-2 right-2"
//                     onClick={removeImage}
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//                   <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                   <div className="space-y-2">
//                     <Label htmlFor="image-upload" className="cursor-pointer">
//                       <span className="text-blue-600 hover:text-blue-700">Upload an image</span>
//                       <span className="text-gray-500"> or drag and drop</span>
//                     </Label>
//                     <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
//                   </div>
//                   <Input
//                     id="image-upload"
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     className="hidden"
//                   />
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         {/* Sidebar */}
//         <div className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Publish Settings</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <Label htmlFor="status">Status</Label>
//                 <Select
//                   value={formData.status}
//                   onValueChange={(value) => handleInputChange("status", value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="draft">Draft</SelectItem>
//                     <SelectItem value="published">Published</SelectItem>
//                     <SelectItem value="archived">Archived</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="flex items-center space-x-2">
//                 <Switch
//                   id="featured"
//                   checked={formData.featured}
//                   onCheckedChange={(checked) => handleInputChange("featured", checked)}
//                 />
//                 <Label htmlFor="featured">Featured Post</Label>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Categories & Regions</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <Label htmlFor="category">Category *</Label>
//                 <Select
//                   value={formData.categoryId}
//                   onValueChange={(value) => handleInputChange("categoryId", value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select category" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {categories?.map((category) => (
//                       <SelectItem key={category._id} value={category._id}>
//                         {category.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <Label htmlFor="region">Region</Label>
//                 <Select
//                   value={formData.regionId}
//                   onValueChange={(value) => handleInputChange("regionId", value === "none" ? "" : value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select region" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="none">No region</SelectItem>
//                     {regions?.map((region) => (
//                       <SelectItem key={region._id} value={region._id}>
//                         {region.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Action Buttons */}
//           <div className="space-y-2">
//             <Button 
//               type="submit" 
//               className="w-full" 
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? "Creating..." : "Create Post"}
//             </Button>
//             <Button 
//               type="button" 
//               variant="outline" 
//               className="w-full"
//               onClick={() => router.push("/admin/posts")}
//             >
//               Cancel
//             </Button>
//           </div>
//         </div>
//       </div>
//     </form>
//   );
// }