"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
 
import { Search, Edit, Trash2, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

export function CategoriesTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    slug: "",
    description: "",
    color: "",
    isActive: true
  });

  
  const categories = useQuery(api.categories.getAllCategories);
  const updateCategory = useMutation(api.categories.updateCategory);
  const deleteCategory = useMutation(api.categories.deleteCategory);

  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setEditFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      color: category.color || "",
      isActive: category.isActive
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editFormData.name || !editFormData.slug) {
      toast("Please fill in all required fields");
      return;
    }

    try {
      await updateCategory({
        id: editingCategory._id,
        name: editFormData.name,
        slug: editFormData.slug,
        description: editFormData.description || undefined,
        color: editFormData.color || undefined,
        isActive: editFormData.isActive,
      });

      toast("Category updated successfully");

      setEditingCategory(null);
    } catch (error) {
      console.error("Error updating category:", error);
      toast("Error updating category");
    }
  };

  const handleDelete = async (categoryId: Id<"categories">) => {
    try {
      await deleteCategory({ id: categoryId });
      toast("Category deleted successfully");
    } catch (error: any) {
      console.error("Error deleting category:", error);
      toast("Error deleting category");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <CardTitle>Categories</CardTitle>
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!categories ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Loading categories...</div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">No categories found</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{category.name}</span>
                        {category.color && (
                          <div 
                            className={`w-3 h-3 rounded-full bg-${category.color}-500`}
                            style={{ backgroundColor: category.color }}
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {category.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {category.description || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={category.isActive ? "default" : "secondary"}
                        className={category.isActive ? "bg-green-100 text-green-800" : ""}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(category.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(category._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-slug">Slug *</Label>
                <Input
                  id="edit-slug"
                  value={editFormData.slug}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, slug: e.target.value }))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-color">Color</Label>
                <Input
                  id="edit-color"
                  value={editFormData.color}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, color: e.target.value }))}
                  placeholder="e.g., blue, red, green"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="edit-active"
                  type="checkbox"
                  checked={editFormData.isActive}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="edit-active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingCategory(null)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Update Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}