"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RegisterUserSchema, type RegisterUserSchemeType } from "@/models/User";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { register } from "@/server/user";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const page = () => {
  const to = useRouter();
  const [isPending, startTransition] = useTransition();
  const [success, isSuccess] = useState<boolean>(false);
  const { toast } = useToast();
  const form = useForm<RegisterUserSchemeType>({
    defaultValues: {
      email: "",
      password: "",
      password_confirmation: "",
      username: "",
    },
    resolver: zodResolver(RegisterUserSchema),
  });
  const submit = (data: RegisterUserSchemeType) => {
    const _ = new FormData();
    _.append("username", data.username);
    _.append("email", data.email);
    _.append("password", data.password);
    _.append("password_confirmation", data.password_confirmation);
    startTransition(async () => {
      const email = form.getValues("email");
      const response = await register(_);
      if (!response.success) {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
          duration: 5000,
        });
        if (response?.errors) {
          Object.keys(response.errors).forEach((e) => {
            const errorMessages =
              response.errors?.[e as keyof typeof response.errors];
            if (errorMessages && errorMessages.length > 0) {
              form.setError(e as keyof RegisterUserSchemeType, {
                message: errorMessages[0],
                type: "manual",
              });
            }
          });
        }
        return;
      }
      form.reset();
      isSuccess(true);
      toast({
        title: "Success",
        description: "Registration Successful!",
        duration: 5000,
      });
      setTimeout(() => {
        to.push(
          `/account/verify?email=${encodeURIComponent(email)}`
        );
      }, 5000);
    });
  };
  return (
    <Card className="w-[450px]">
      <title>Register - Authentication</title>

      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(submit)}>
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username*</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending || success}
                      type="text"
                      placeholder="Username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email*</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending || success}
                      type="email"
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password*</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending || success}
                      type="password"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password_confirmation"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password*</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending || success}
                      type="password"
                      placeholder="Confirm Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isPending || success}
              type="submit"
              className="w-full"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin text-secondary" />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          variant={"link"}
          disabled={isPending || success}
          className="text-center mx-auto"
        >
          <Link href={"/account/login"}>Already have an account? Login!</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default page;
