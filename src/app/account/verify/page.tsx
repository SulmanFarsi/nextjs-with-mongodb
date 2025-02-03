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
import { VerifyUserSchema, type VerifyUserSchemeType } from "@/models/User";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { newCode, verify } from "@/server/user";

const page = () => {
  const to = useRouter();

  const [isPending, startTransition] = useTransition();
  const [success, isSuccess] = useState<boolean>(false);
  const { toast } = useToast();
  const params = useSearchParams();
  const form = useForm<VerifyUserSchemeType>({
    defaultValues: async () => {
      return {
        email_verification_token: "",
        email: params.get("email") || "",
      };
    },
    resolver: zodResolver(VerifyUserSchema),
  });
  const submit = (data: VerifyUserSchemeType) => {
    const _ = new FormData();
    _.append("email", data.email);
    _.append("email_verification_token", String(data.email_verification_token));
    startTransition(async () => {
      const response = await verify(_);
      if (!response?.success && response?.errors?.otp) {
        toast({
          title: "Error",
          description: response.message,
          duration: 5000,
          variant: "destructive",
        });
        form.setError("email_verification_token", {
          type: "manual",
          message: response.errors.otp[0],
        });
        return;
      }
      form.reset();
      isSuccess(true);
      toast({
        title: "Success",
        description: "Verify Successful!",
        duration: 5000,
      });
      setTimeout(() => {
        to.push("/account/login");
      }, 5000);
    });
  };

  return (
    <Card className="w-[450px]">
      <title>Verify - Authentication</title>

      <CardHeader>
        <CardTitle>Verify</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(submit)}>
            <FormField
              name="email_verification_token"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Otp*</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      value={field.value ?? ""}
                      onChange={(value) => field.onChange(value)}
                      onComplete={(value) => field.onChange(value)}
                      name={field.name}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot className="w-[66px]" index={0} />
                        <InputOTPSlot className="w-[66px]" index={1} />
                        <InputOTPSlot className="w-[66px]" index={2} />
                        <InputOTPSlot className="w-[66px]" index={3} />
                        <InputOTPSlot className="w-[66px]" index={4} />
                        <InputOTPSlot className="w-[66px]" index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem className="w-full flex items-center justify-between">
              <Button
                onClick={async () => {
                  isSuccess(true);

                  const _ = new FormData();
                  _.append("email", form.getValues("email"));
                  const response = await newCode(_);
                  if (!response?.success && response?.errors?.otp) {
                    isSuccess(false);

                    toast({
                      title: "Error",
                      description: response.message,
                      duration: 5000,
                      variant: "destructive",
                    });
                    form.setError("email_verification_token", {
                      type: "manual",
                      message: response.errors.otp[0],
                    });
                    return;
                  }
                  isSuccess(false);

                  toast({
                    title: "Success",
                    description: "Verification code sent!",
                    duration: 5000,
                  });
                }}
                disabled={isPending || success}
                variant={"secondary"}
              >
                Request a new Code!
              </Button>
              <Button disabled={isPending || success} type="submit">
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin text-secondary" />
                ) : (
                  "Submit"
                )}
              </Button>
            </FormItem>
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
