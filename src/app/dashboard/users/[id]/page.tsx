import Link from "next/link";
import React from "react";
import { z } from "zod";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      {/* Form Section */}
      <Card className="p-6">
        <CardHeader>
          <h2 className="text-xl font-bold">Create New User</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input placeholder="Enter full name" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="Enter email" />
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea placeholder="Short description about the user" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Submit</Button>
        </CardFooter>
      </Card>

      {/* Summary/Preview Section */}
      <Card className="p-6 flex items-center justify-center bg-muted">
        <div>
          <h3 className="text-lg font-semibold text-center">User Summary</h3>
          <p className="text-center text-sm text-gray-500">
            Details will be displayed here.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default page;
