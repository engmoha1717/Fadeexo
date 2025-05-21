import { SettingsForm } from "@/components/admin/settings-form";

 


export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      </div>

      <SettingsForm />
    </div>
  );
}