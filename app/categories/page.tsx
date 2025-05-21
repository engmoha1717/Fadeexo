import  {CategoriesTable}  from "@/components/admin/categories-table";
import  {CreateCategoryButton}  from "@/components/admin/create-category-button";

export default function CategoriesPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <CreateCategoryButton />
      </div>

      <CategoriesTable />
    </div>
  );
}