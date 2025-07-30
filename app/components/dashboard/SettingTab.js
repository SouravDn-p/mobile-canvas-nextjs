import React from "react";
import Button from "../ui/button";
import CardContent from "../ui/cardContent";
import { CardDescription, CardTitle } from "../ui/radix/card";
import CardHeader from "../ui/cardHeader";
import Card from "../ui/card";
import { TabsContent } from "@radix-ui/react-tabs";

const SettingTab = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Account Settings</CardTitle>
          <CardDescription className="text-gray-400">
            Manage your account preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full bg-gradient-to-r cursor-pointer from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-black">
            Change Password
          </Button>
          <Button
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10 cursor-pointer"
          >
            Two-Factor Authentication
          </Button>
          <Button
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/10 cursor-pointer"
          >
            Download My Data
          </Button>
        </CardContent>
      </Card>

      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Notifications</CardTitle>
          <CardDescription className="text-gray-400">
            Choose what you want to be notified about
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white">Order Updates</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white">New Products</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white">Promotions</span>
            <input type="checkbox" className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white">Newsletter</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingTab;
