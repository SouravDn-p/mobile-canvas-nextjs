import React, { useEffect, useState } from "react";
import CardContent from "../ui/cardContent";
import { CardDescription, CardTitle } from "../ui/radix/card";
import CardHeader from "../ui/cardHeader";
import Card from "../ui/card";
import { Calendar } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import Badge from "../ui/badge";
import Input from "../ui/input";
import Label from "../ui/Label";
import { Textarea } from "../ui/textarea";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useGetUserByEmailQuery } from "@/redux/api/productapi";
const ProfileTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { data: session, status } = useSession();
  const email = session?.user?.email;
  const {
    data: userData,
    error,
    isLoading,
    refetch: refetchUser,
  } = useGetUserByEmailQuery(email, {
    skip: !email,
  });
  const user = userData?.user;
  const router = useRouter();

  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    phone: "+1 (555) 123-4567",
    location: "123 Main Street, Anytown, ST 12345",
    bio: "Tech enthusiast and gadget lover",
    joinDate: "2023-01-15",
    avatar:
      session?.user?.image ||
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
  });
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      setUserProfile((prev) => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
        avatar: session.user.image || prev.avatar,
        phone: user?.phone || "",
        bio: user?.bio || "",
        location: user?.location || "",
        website: user?.website || "",
        department: user?.department || "",
      }));
    }
  }, [session, userData, user]);

  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Profile Information</CardTitle>
            <CardDescription className="text-gray-400">
              Manage your personal information
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
            <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-400 text-black text-xl">
              {userProfile.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold text-white">
              {userProfile.name}
            </h3>
            <p className="text-gray-400">{userProfile.email}</p>
            <div className="flex items-center mt-2 text-sm text-gray-400">
              <Calendar className="mr-1 h-3 w-3" />
              Member since {new Date(userProfile.joinDate).toLocaleDateString()}
            </div>
            {session.user.role === "admin" && (
              <Badge className="mt-2 bg-purple-500/20 text-purple-400">
                Admin
              </Badge>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white">
                Full Name
              </Label>
              <Input
                id="name"
                value={userProfile.name}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    name: e.target.value,
                  })
                }
                disabled={!isEditing}
                className="glass border-white/20 bg-white/5 text-white disabled:opacity-50"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={userProfile.email}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    email: e.target.value,
                  })
                }
                disabled={!isEditing}
                className="glass border-white/20 bg-white/5 text-white disabled:opacity-50"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-white">
                Phone
              </Label>
              <Input
                id="phone"
                value={userProfile.phone}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    phone: e.target.value,
                  })
                }
                disabled={!isEditing}
                className="glass border-white/20 bg-white/5 text-white disabled:opacity-50"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="location" className="text-white">
                Address
              </Label>
              <Input
                id="location"
                value={userProfile.location}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    location: e.target.value,
                  })
                }
                disabled={!isEditing}
                className="glass border-white/20 bg-white/5 text-white disabled:opacity-50"
              />
            </div>
            <div>
              <Label htmlFor="bio" className="text-white">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={userProfile.bio}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    bio: e.target.value,
                  })
                }
                disabled={!isEditing}
                className="glass border-white/20 bg-white/5 text-white disabled:opacity-50"
                rows={3}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
