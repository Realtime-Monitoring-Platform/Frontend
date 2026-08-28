import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/spinner';
import { Mail } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import useUpdateProfileModal from '@/hooks/useUpdateProfileModal';
import { useQuery } from '@tanstack/react-query';
import { getUserById } from '@/services/usersAction';

 const ProfilePage = () => {
  const { user } = useAuth();
  const {
        data: userData,
        isLoading: isUserLoading
    } = useQuery({
        queryKey: ["user", user?.userId],
        queryFn: () => getUserById(user?.userId || ""),
        enabled: !!user?.userId,
        refetchOnMount: true,
    });
  console.log("user data", userData);
  if (isUserLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  
  const {onOpen}=useUpdateProfileModal();

  if(isUserLoading || !userData){
    return(
      <Spinner className="h-8 w-8" />
    )
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card>
          <CardContent className="pt-6 text-center">
            {/* <Avatar className="mx-auto mb-4 h-24 w-24">
              <AvatarFallback className="bg-primary text-4xl text-primary-foreground">
                {user.firstName}
                {user.lastName}
              </AvatarFallback>
            </Avatar> */}
            <h2 className="text-xl font-semibold">
              {userData?.firstName} {userData?.lastName}
            </h2>
            <p className="text-sm text-muted-foreground">
              {userData?.roleName || "User"}
            </p>
            <p className="text-xs text-muted-foreground">
              Member since {new Date(userData?.createdAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue={userData.firstName} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue={userData.lastName} readOnly />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input id="email" defaultValue={userData.email} readOnly className="pl-10" />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue={userData.username} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue={userData.phone} readOnly />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <p id="role" className="text-sm text-muted-foreground">
                    {`${userData?.role}`}
                  </p>
               
                </div>
              </div>
              <div className="mt-6">
                <Button onClick={onOpen}>Update Profile</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
