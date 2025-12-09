
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useHealthData } from '@/hooks/useHealthData';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Calendar, Edit, Save } from 'lucide-react';
import { useState } from 'react';

const UserProfile = () => {
  const { user } = useUser();
  const { userProfile, isLoadingProfile, updateProfile, isUpdatingProfile } = useHealthData();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: '',
    email: '',
  });

  if (!user) return null;

  if (isLoadingProfile) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleEditToggle = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      setEditForm({
        full_name: userProfile?.full_name || user.fullName || '',
        email: userProfile?.email || user.primaryEmailAddress?.emailAddress || '',
      });
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile(editForm);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const displayName = userProfile?.full_name || user.fullName || 'User';
  const displayEmail = userProfile?.email || user.primaryEmailAddress?.emailAddress;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            User Profile
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEditToggle}
            disabled={isUpdatingProfile}
          >
            {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
          </Button>
        </div>
        <CardDescription>Your account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.imageUrl} alt={displayName} />
            <AvatarFallback>
              {user.firstName?.[0]}{user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <Button onClick={handleSave} disabled={isUpdatingProfile} size="sm">
                  {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold text-lg">{displayName}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {displayEmail}
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Member since {new Date(user.createdAt!).toLocaleDateString()}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Health Enthusiast</Badge>
          <Badge variant="outline">Ayurveda</Badge>
          {userProfile && <Badge variant="outline">Profile Synced</Badge>}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
