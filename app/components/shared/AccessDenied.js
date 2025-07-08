import React from "react";
import Button from "../ui/button";
import Link from "next/link";
import { Shield } from "lucide-react";
import Card from "../ui/card";

const AccessDenied = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card variant="glass" className="p-6 sm:p-8 text-center max-w-md w-full">
        <div className="mb-6">
          <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            You must be logged in to view this page.
          </p>
        </div>
        <Link href="/login">
          <Button variant="default" className="w-full cursor-pointer">
            Sign In
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default AccessDenied;
