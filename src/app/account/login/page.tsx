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
import { LoginUserSchema, type LoginUserSchemeType } from "@/models/User";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";

const page = () => {
  const to = useRouter();
  const [isPending, startTransition] = useTransition();
  const [success, isSuccess] = useState<boolean>(false);
  const { toast } = useToast();
  const form = useForm<LoginUserSchemeType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LoginUserSchema),
  });
  const submit = (data: LoginUserSchemeType) => {
    startTransition(async () => {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (!response?.ok && response?.error) {
        toast({
          title: "Error",
          description: response.error,
          duration: 5000,
          variant: "destructive",
        });
        form.setError("email", { type: "manual", message: response.error });
        return;
      }
      form.reset();
      isSuccess(true);
      toast({
        title: "Success",
        description: "Login Successful!",
        duration: 5000,
      });
      setTimeout(() => {
        to.push("/dashboard");
      }, 5000);
    });
  };
  return (
    <Card className="w-[450px]">
      <title>Login - Authentication</title>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(submit)}>
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
          <Link href={"/account/register"}>
            Already not have an account? Register!
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default page;
