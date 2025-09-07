import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Save, 
  Eye, 
  Video, 
  Image, 
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, apiRequestWithFiles } from "@/lib/queryClient";
import { type MediaSettings } from "@/hooks/use-media-settings";

export default function MediaManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState("hero-video");
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string }>({});
  const [pendingChanges, setPendingChanges] = useState<Partial<MediaSettings>>({});
  const [hasChanges, setHasChanges] = useState(false);
  
  const heroVideoRef = useRef<HTMLInputElement>(null);
  const homeAboutImageRef = useRef<HTMLInputElement>(null);
  const aboutPageImageRef = useRef<HTMLInputElement>(null);

  // Fetch media settings
  const { data: mediaSettings, isLoading } = useQuery<MediaSettings>({
    queryKey: ['mediaSettings'],
    queryFn: async () => {
      const response = await fetch('/api/media/settings');
      if (!response.ok) throw new Error('Failed to fetch media settings');
      return response.json();
    }
  });

  // Update media settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: Partial<MediaSettings>) => {
      const response = await fetch('/api/media/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!response.ok) throw new Error('Failed to update media settings');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaSettings'] });
      toast({
        title: "Success",
        description: "Media settings updated successfully",
        variant: "default"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update media settings",
        variant: "destructive"
      });
    }
  });

  // Upload media files mutation
  const uploadMediaMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Failed to upload media files');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['mediaSettings'] });
      toast({
        title: "Success",
        description: "Media files uploaded successfully",
        variant: "default"
      });
      setPreviewUrls({});
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload media files",
        variant: "destructive"
      });
    }
  });

  const handleFileSelect = (field: string, file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrls(prev => ({ ...prev, [field]: url }));
  };

  const handleUpload = async (field: string) => {
    const fileInput = field === 'heroVideo' ? heroVideoRef.current :
                     field === 'homeAboutImage' ? homeAboutImageRef.current :
                     aboutPageImageRef.current;
    
    if (!fileInput?.files?.[0]) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append(field, fileInput.files[0]);

    try {
      await uploadMediaMutation.mutateAsync(formData);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlUpdate = (field: keyof MediaSettings, value: string) => {
    if (mediaSettings) {
      updateSettingsMutation.mutate({
        ...mediaSettings,
        [field]: value
      });
    }
  };

  const handlePendingChange = (field: keyof MediaSettings, value: string) => {
    setPendingChanges(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleSaveAllChanges = async () => {
    if (!hasChanges || !mediaSettings) return;

    try {
      const updatedSettings = {
        ...mediaSettings,
        ...pendingChanges
      };
      
      await updateSettingsMutation.mutateAsync(updatedSettings);
      
      // Clear pending changes
      setPendingChanges({});
      setHasChanges(false);
      
      // Clear URL inputs
      const urlInputs = ['heroVideoUrl', 'homeAboutImageUrl', 'aboutPageImageUrl'];
      urlInputs.forEach(id => {
        const input = document.getElementById(id) as HTMLInputElement;
        if (input) input.value = '';
      });
      
      toast({
        title: "Success",
        description: "All media settings saved successfully",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save media settings",
        variant: "destructive"
      });
    }
  };

  const handleResetChanges = () => {
    setPendingChanges({});
    setHasChanges(false);
    
    // Reset URL inputs to current values
    const urlInputs = [
      { id: 'heroVideoUrl', value: mediaSettings?.heroVideo || '' },
      { id: 'homeAboutImageUrl', value: mediaSettings?.homeAboutImage || '' },
      { id: 'aboutPageImageUrl', value: mediaSettings?.aboutPageImage || '' }
    ];
    
    urlInputs.forEach(({ id, value }) => {
      const input = document.getElementById(id) as HTMLInputElement;
      if (input) input.value = value;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Media Management</h1>
              <p className="text-gray-600">
                Manage hero video, home page about section image, and about us page image
              </p>
            </div>
            
            {/* Global Save/Reset Controls */}
            {hasChanges && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4"
              >
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">You have unsaved changes</p>
                  <p className="text-xs">Review your changes and save when ready</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetChanges}
                    className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
                  >
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveAllChanges}
                    disabled={updateSettingsMutation.isPending}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    {updateSettingsMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save All Changes
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hero-video" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Hero Video
            </TabsTrigger>
            <TabsTrigger value="home-about" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Home About
            </TabsTrigger>
            <TabsTrigger value="about-page" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              About Page
            </TabsTrigger>
          </TabsList>

          {/* Hero Video Tab */}
          <TabsContent value="hero-video" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Hero Section Video
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Video Preview */}
                {mediaSettings?.heroVideo && (
                  <div className="space-y-4">
                    <Label>Current Video</Label>
                    <div className="relative w-full max-w-2xl">
                      <video
                        src={mediaSettings.heroVideo}
                        controls
                        className="w-full rounded-lg shadow-lg"
                        style={{ maxHeight: '300px' }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                )}

                {/* Upload New Video */}
                <div className="space-y-4">
                  <Label htmlFor="heroVideo">Upload New Video</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      ref={heroVideoRef}
                      id="heroVideo"
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileSelect('heroVideo', e.target.files[0]);
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => handleUpload('heroVideo')}
                      disabled={isUploading}
                      className="flex items-center gap-2"
                    >
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      Upload
                    </Button>
                  </div>
                  
                  {/* File Preview */}
                  {previewUrls.heroVideo && (
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <video
                        src={previewUrls.heroVideo}
                        controls
                        className="w-full max-w-md rounded-lg shadow-lg"
                        style={{ maxHeight: '200px' }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>

                {/* URL Input */}
                <div className="space-y-4">
                  <Label htmlFor="heroVideoUrl">Or enter video URL</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="heroVideoUrl"
                      type="url"
                      placeholder="https://example.com/video.mp4"
                      defaultValue={mediaSettings?.heroVideo || ''}
                      onChange={(e) => handlePendingChange('heroVideo', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => {
                        const input = document.getElementById('heroVideoUrl') as HTMLInputElement;
                        if (input.value) {
                          handleUrlUpdate('heroVideo', input.value);
                        }
                      }}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Now
                    </Button>
                  </div>
                  {pendingChanges.heroVideo && (
                    <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                      <strong>Pending change:</strong> {pendingChanges.heroVideo}
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Video Requirements:</p>
                      <ul className="mt-1 list-disc list-inside space-y-1">
                        <li>Supported formats: MP4, WebM, OGG</li>
                        <li>Maximum file size: 50MB</li>
                        <li>Recommended resolution: 1920x1080 or higher</li>
                        <li>Recommended duration: 30-60 seconds</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Home About Image Tab */}
          <TabsContent value="home-about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Home Page About Section Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Image Preview */}
                {mediaSettings?.homeAboutImage && (
                  <div className="space-y-4">
                    <Label>Current Image</Label>
                    <div className="relative w-full max-w-md">
                      <img
                        src={mediaSettings.homeAboutImage}
                        alt="Home about section"
                        className="w-full rounded-lg shadow-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/default-placeholder.jpg";
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Upload New Image */}
                <div className="space-y-4">
                  <Label htmlFor="homeAboutImage">Upload New Image</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      ref={homeAboutImageRef}
                      id="homeAboutImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileSelect('homeAboutImage', e.target.files[0]);
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => handleUpload('homeAboutImage')}
                      disabled={isUploading}
                      className="flex items-center gap-2"
                    >
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      Upload
                    </Button>
                  </div>
                  
                  {/* File Preview */}
                  {previewUrls.homeAboutImage && (
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <img
                        src={previewUrls.homeAboutImage}
                        alt="Preview"
                        className="w-full max-w-md rounded-lg shadow-lg"
                      />
                    </div>
                  )}
                </div>

                {/* URL Input */}
                <div className="space-y-4">
                  <Label htmlFor="homeAboutImageUrl">Or enter image URL</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="homeAboutImageUrl"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      defaultValue={mediaSettings?.homeAboutImage || ''}
                      onChange={(e) => handlePendingChange('homeAboutImage', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => {
                        const input = document.getElementById('homeAboutImageUrl') as HTMLInputElement;
                        if (input.value) {
                          handleUrlUpdate('homeAboutImage', input.value);
                        }
                      }}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Now
                    </Button>
                  </div>
                  {pendingChanges.homeAboutImage && (
                    <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                      <strong>Pending change:</strong> {pendingChanges.homeAboutImage}
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Image Requirements:</p>
                      <ul className="mt-1 list-disc list-inside space-y-1">
                        <li>Supported formats: JPG, PNG, WebP</li>
                        <li>Maximum file size: 10MB</li>
                        <li>Recommended resolution: 800x600 or higher</li>
                        <li>Aspect ratio: 4:3 or 16:9</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Page Image Tab */}
          <TabsContent value="about-page" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  About Us Page Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Image Preview */}
                {mediaSettings?.aboutPageImage && (
                  <div className="space-y-4">
                    <Label>Current Image</Label>
                    <div className="relative w-full max-w-md">
                      <img
                        src={mediaSettings.aboutPageImage}
                        alt="About page"
                        className="w-full rounded-lg shadow-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/default-placeholder.jpg";
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Upload New Image */}
                <div className="space-y-4">
                  <Label htmlFor="aboutPageImage">Upload New Image</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      ref={aboutPageImageRef}
                      id="aboutPageImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileSelect('aboutPageImage', e.target.files[0]);
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => handleUpload('aboutPageImage')}
                      disabled={isUploading}
                      className="flex items-center gap-2"
                    >
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      Upload
                    </Button>
                  </div>
                  
                  {/* File Preview */}
                  {previewUrls.aboutPageImage && (
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <img
                        src={previewUrls.aboutPageImage}
                        alt="Preview"
                        className="w-full max-w-md rounded-lg shadow-lg"
                      />
                    </div>
                  )}
                </div>

                {/* URL Input */}
                <div className="space-y-4">
                  <Label htmlFor="aboutPageImageUrl">Or enter image URL</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="aboutPageImageUrl"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      defaultValue={mediaSettings?.aboutPageImage || ''}
                      onChange={(e) => handlePendingChange('aboutPageImage', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => {
                        const input = document.getElementById('aboutPageImageUrl') as HTMLInputElement;
                        if (input.value) {
                          handleUrlUpdate('aboutPageImage', input.value);
                        }
                      }}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Now
                    </Button>
                  </div>
                  {pendingChanges.aboutPageImage && (
                    <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                      <strong>Pending change:</strong> {pendingChanges.aboutPageImage}
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Image Requirements:</p>
                      <ul className="mt-1 list-disc list-inside space-y-1">
                        <li>Supported formats: JPG, PNG, WebP</li>
                        <li>Maximum file size: 10MB</li>
                        <li>Recommended resolution: 1200x800 or higher</li>
                        <li>Aspect ratio: 3:2 or 16:9</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Pending Changes Summary */}
        {hasChanges && Object.keys(pendingChanges).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Pending Changes Summary
            </h3>
            <div className="space-y-3">
              {Object.entries(pendingChanges).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-white rounded border">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-sm text-gray-600 truncate max-w-md">
                      {value}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Pending
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleResetChanges}
                className="text-gray-600"
              >
                Discard Changes
              </Button>
              <Button
                onClick={handleSaveAllChanges}
                disabled={updateSettingsMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {updateSettingsMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save All Changes
              </Button>
            </div>
          </motion.div>
        )}

        {/* Last Updated Info */}
        {mediaSettings?.updatedAt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 p-4 bg-green-50 rounded-lg"
          >
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm">
                Last updated: {new Date(mediaSettings.updatedAt).toLocaleString()}
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
