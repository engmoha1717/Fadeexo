"use client";

import { useState, useEffect } from "react";
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

import { Upload, X, Loader2 } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

interface EditPostFormProps {
  postId: string;
}

export function EditPostForm({ postId }: EditPostFormProps) {
  console.log("Post ID received:", postId);
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
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);

  // Try different ways to get the post
  const postBySlug = useQuery(api.posts.getPostBySlug, { slug: postId });
  // If the ID is actually a convex ID
  const postById = useQuery(api.posts.getPostById, { id: postId as Id<"posts"> });
  
  // Set a timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log("Loading timeout reached, forcing render");
        setIsLoading(false);
      }
    }, 5000); // 5 second timeout
    
    setLoadingTimeout(timeout);
    
    return () => {
      if (loadingTimeout) clearTimeout(loadingTimeout);
    };
  }, []);
  
  // If we have an actual post object from either query, use it
  useEffect(() => {
    if (postBySlug) {
      console.log("Found post by slug:", postBySlug.title);
      loadPostData(postBySlug);
      if (loadingTimeout) clearTimeout(loadingTimeout);
    } else if (postById) {
      console.log("Found post by ID:", postById.title);
      loadPostData(postById);
      if (loadingTimeout) clearTimeout(loadingTimeout);
    }
  }, [postBySlug, postById]);
  
  const categories = useQuery(api.categories.getAllCategories);
  const regions = useQuery(api.regions.getActiveRegions);
  const updatePost = useMutation(api.posts.updatePost);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  // Function to load post data into form
  const loadPostData = (post: any) => {
    console.log("Loading post data:", post.title);
    setFormData({
      title: post.title || "",
      slug: post.slug || "",
      description: post.description || "",
      content: post.content || "",
      categoryId: post.categoryId || "",
      regionId: post.regionId || "",
      status: post.status || "draft",
      featured: post.featured || false,
    });
    setCurrentImageUrl(post.imageUrl || null);
    setIsLoading(false);
  };

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

  const removeCurrentImage = () => {
    setCurrentImageUrl(null);
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
    
    const post = postBySlug || postById;
    if (!post) {
      toast("Post not found");
      return;
    }
    
    if (!formData.title || !formData.description || !formData.content || !formData.categoryId) {
      toast("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload new image if selected
      const newImageId = await uploadImage();

      // Use new image if uploaded, otherwise keep existing image ID
      const imageId = newImageId || (currentImageUrl ? post.imageId : undefined);

      // Update post
      await updatePost({
        id: post._id,
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

      toast("Post updated successfully");

      router.push("/admin/posts");
    } catch (error) {
      console.error("Error updating post:", error);
      toast("Error updating post");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // No post found after loading
  if (!postBySlug && !postById && !isLoading) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h2>
        <p className="text-gray-600">ID: {postId}</p>
        <div className="mt-4">
          <Button 
            onClick={() => router.push("/admin/posts")}
            variant="outline"
          >
            Return to Posts
          </Button>
        </div>
      </div>
    );
  }

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
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="Full post content"
                  className="min-h-[300px]"
                  required
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
              {/* Current Image */}
              {currentImageUrl && !imagePreview && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Current image:</p>
                  <div className="relative">
                    <img
                      src={currentImageUrl}
                      alt="Current image"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeCurrentImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* New Image Preview */}
              {imagePreview ? (
                <div>
                  <p className="text-sm text-gray-600 mb-2">New image:</p>
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
                </div>
              ) : !currentImageUrl && (
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

              {/* Upload new image option when current image exists */}
              {(currentImageUrl && !imagePreview) && (
                <div className="mt-4">
                  <Label htmlFor="new-image-upload" className="cursor-pointer">
                    <Button variant="outline" type="button" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload New Image
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="new-image-upload"
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
                  value={formData.regionId || "none"}
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
              {isSubmitting ? "Updating..." : "Update Post"}
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

// import { useState, useEffect } from "react";
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

// import { Upload, X, Loader2 } from "lucide-react";
// import { Id } from "@/convex/_generated/dataModel";
// import { toast } from "sonner";

// interface EditPostFormProps {
//   postId: string;
// }

// export function EditPostForm({ postId }: EditPostFormProps) {
//   console.log("--------------------------------------------------------", postId);
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
//   const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   // First try to get post by slug (if postId is a slug)
//   const postBySlug = useQuery(api.posts.getPostBySlug, { slug: postId });
  
//   // If we have an actual post object, use it
//   useEffect(() => {
//     if (postBySlug) {
//       loadPostData(postBySlug);
//     }
//   }, [postBySlug]);
  
//   const categories = useQuery(api.categories.getAllCategories);
//   const regions = useQuery(api.regions.getAllRegions);
//   const updatePost = useMutation(api.posts.updatePost);
//   const generateUploadUrl = useMutation(api.files.generateUploadUrl);

//   // Function to load post data into form
//   const loadPostData = (post: any) => {
//     setFormData({
//       title: post.title,
//       slug: post.slug,
//       description: post.description,
//       content: post.content,
//       categoryId: post.categoryId,
//       regionId: post.regionId || "",
//       status: post.status,
//       featured: post.featured,
//     });
//     setCurrentImageUrl(post.imageUrl || null);
//     setIsLoading(false);
//   };

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

//   const removeCurrentImage = () => {
//     setCurrentImageUrl(null);
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
    
//     if (!postBySlug) {
//       toast("Post not found");
//       return;
//     }
    
//     if (!formData.title || !formData.description || !formData.content || !formData.categoryId) {
//       toast("Please fill in all fields");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       // Upload new image if selected
//       const newImageId = await uploadImage();

//       // Use new image if uploaded, otherwise keep existing image ID
//       const imageId = newImageId || (currentImageUrl ? postBySlug.imageId : undefined);

//       // Update post
//       await updatePost({
//         id: postBySlug._id,
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

//       toast("Post updated successfully");

//       router.push("/admin/posts");
//     } catch (error) {
//       console.error("Error updating post:", error);
//       toast("Error updating post");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     );
//   }

//   if (!postBySlug) {
//     return (
//       <div className="text-center py-12">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">Post not found</h2>
//         <p className="text-gray-600">The post you're trying to edit doesn't exist.</p>
//       </div>
//     );
//   }

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
//               {/* Current Image */}
//               {currentImageUrl && !imagePreview && (
//                 <div className="mb-4">
//                   <p className="text-sm text-gray-600 mb-2">Current image:</p>
//                   <div className="relative">
//                     <img
//                       src={currentImageUrl}
//                       alt="Current image"
//                       className="w-full h-64 object-cover rounded-lg"
//                     />
//                     <Button
//                       type="button"
//                       variant="destructive"
//                       size="sm"
//                       className="absolute top-2 right-2"
//                       onClick={removeCurrentImage}
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               )}

//               {/* New Image Preview */}
//               {imagePreview ? (
//                 <div>
//                   <p className="text-sm text-gray-600 mb-2">New image:</p>
//                   <div className="relative">
//                     <img
//                       src={imagePreview}
//                       alt="Preview"
//                       className="w-full h-64 object-cover rounded-lg"
//                     />
//                     <Button
//                       type="button"
//                       variant="destructive"
//                       size="sm"
//                       className="absolute top-2 right-2"
//                       onClick={removeImage}
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               ) : !currentImageUrl && (
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

//               {/* Upload new image option when current image exists */}
//               {(currentImageUrl && !imagePreview) && (
//                 <div className="mt-4">
//                   <Label htmlFor="new-image-upload" className="cursor-pointer">
//                     <Button variant="outline" type="button" asChild>
//                       <span>
//                         <Upload className="h-4 w-4 mr-2" />
//                         Upload New Image
//                       </span>
//                     </Button>
//                   </Label>
//                   <Input
//                     id="new-image-upload"
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
//                   value={formData.regionId || "none"}
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
//               {isSubmitting ? "Updating..." : "Update Post"}
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
            
       














