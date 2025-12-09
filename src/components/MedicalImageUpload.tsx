
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { uploadMedicalImage, getMedicalImageUrl } from '@/lib/database';
import { Upload, Image, X } from 'lucide-react';

const MedicalImageUpload = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      await uploadMedicalImage(user.id, file, fileName);
      
      const imageUrl = await getMedicalImageUrl(user.id, fileName);
      setUploadedImages(prev => [...prev, imageUrl]);
      
      toast({
        title: "Success",
        description: "Medical image uploaded successfully",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload medical image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Clear the input
      event.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Medical Images
        </CardTitle>
        <CardDescription>
          Upload medical images, reports, or documents for your health records
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Choose medical images to upload
            </p>
            <Input
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              disabled={uploading}
              className="max-w-xs mx-auto"
            />
            <p className="text-xs text-muted-foreground">
              Supports: Images, PDF, DOC, DOCX files
            </p>
          </div>
        </div>

        {uploading && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        )}

        {uploadedImages.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Uploaded Images</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {uploadedImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`Medical image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MedicalImageUpload;
