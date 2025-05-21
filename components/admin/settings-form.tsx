"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
 
import { Save, Settings, Globe, Mail, Clock } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

export function SettingsForm() {
  const [formData, setFormData] = useState({
    siteName: "Daily News",
    siteDescription: "Your trusted source for breaking news and updates",
    contactEmail: "",
    timezone: "UTC",
    defaultCategory: "",
    defaultPostStatus: "draft" as "draft" | "published",
    allowComments: true,
    requireModeration: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
 

  const settings = useQuery(api.settings.getSettings);
  const categories = useQuery(api.categories.getActiveCategories);
  const updateSettings = useMutation(api.settings.updateSettings);

  // Load existing settings
  useEffect(() => {
    if (settings) {
      setFormData({
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        contactEmail: settings.contactEmail,
        timezone: settings.timezone,
        defaultCategory: settings.defaultCategory || "",
        defaultPostStatus: settings.defaultPostStatus,
        allowComments: settings.allowComments,
        requireModeration: settings.requireModeration,
      });
    }
  }, [settings]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.siteName || !formData.siteDescription || !formData.contactEmail) {
      toast(`Please fill out all required fields`);
      return;
    }

    setIsSubmitting(true);

    try {
      await updateSettings({
        siteName: formData.siteName,
        siteDescription: formData.siteDescription,
        contactEmail: formData.contactEmail,
        timezone: formData.timezone,
        defaultCategory: formData.defaultCategory ? (formData.defaultCategory as Id<"categories">) : undefined,
        defaultPostStatus: formData.defaultPostStatus,
        allowComments: formData.allowComments,
        requireModeration: formData.requireModeration,
      });

      toast("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast("Error updating settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  const timezones = [
    { value: "UTC", label: "UTC" },
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "London (GMT)" },
    { value: "Europe/Paris", label: "Paris (CET)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Site Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Site Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">Site Name *</Label>
              <Input
                id="siteName"
                value={formData.siteName}
                onChange={(e) => handleInputChange("siteName", e.target.value)}
                placeholder="Daily News"
                required
              />
            </div>

            <div>
              <Label htmlFor="siteDescription">Site Description *</Label>
              <Textarea
                id="siteDescription"
                value={formData.siteDescription}
                onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                placeholder="Your trusted source for breaking news"
                className="min-h-[100px]"
                required
              />
            </div>

            <div>
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                placeholder="contact@dailynews.com"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={formData.timezone}
                onValueChange={(value) => handleInputChange("timezone", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="defaultCategory">Default Category</Label>
              <Select
                value={formData.defaultCategory || "none"}
                onValueChange={(value) => handleInputChange("defaultCategory", value === "none" ? "" : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select default category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No default</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="defaultPostStatus">Default Post Status</Label>
              <Select
                value={formData.defaultPostStatus}
                onValueChange={(value) => handleInputChange("defaultPostStatus", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Comment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Comment Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allowComments">Allow Comments</Label>
                <div className="text-sm text-gray-500">
                  Enable commenting on posts
                </div>
              </div>
              <Switch
                id="allowComments"
                checked={formData.allowComments}
                onCheckedChange={(checked) => handleInputChange("allowComments", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="requireModeration">Require Moderation</Label>
                <div className="text-sm text-gray-500">
                  Comments need approval before showing
                </div>
              </div>
              <Switch
                id="requireModeration"
                checked={formData.requireModeration}
                onCheckedChange={(checked) => handleInputChange("requireModeration", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Current Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Last updated:</span>
              <span className="font-medium">
                {settings ? new Date(settings.updatedAt).toLocaleDateString() : "Never"}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Comments:</span>
              <span className="font-medium">
                {formData.allowComments ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Moderation:</span>
              <span className="font-medium">
                {formData.requireModeration ? "Required" : "Auto-approve"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </form>
  );
}