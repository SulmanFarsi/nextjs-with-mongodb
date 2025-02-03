"use server";

import config from "@/app/api/auth/[...nextauth]/config";
import generateOTP from "@/lib/create-otp";
import db from "@/lib/db";
import { log } from "@/lib/utils";
import UserModel, { BaseUserSchema, RegisterUserSchema, RegisterUserSchemeType, UserDocument } from "@/models/User";
import sendEmailVerificationEmail from "@/templates/emailVerify/send";
import { hash } from "bcryptjs";
import { Document, Types } from "mongoose";
import { getServerSession, User } from "next-auth";


export async function register(_: FormData): Promise<CustomResponse<undefined, RegisterFormFields>> {
    await db();
    try {
        const { data, success, error } = RegisterUserSchema.safeParse({
            username: _.get("username"),
            email: _.get("email"),
            password: _.get("password"),
            password_confirmation: _.get("password_confirmation"),
        });
        if (!success && error) {
            const formattedErrors = error.format();
            return {
                success: false,
                message: "Invalid Form Fields!",
                errors: Object.keys(formattedErrors).reduce((acc, key) => {
                    const formattedError = formattedErrors[key as keyof typeof formattedErrors];
                    const errorMessages = Array.isArray(formattedError)
                        ? formattedError
                        : formattedError?._errors;

                    if (errorMessages?.length) {
                        acc[key as RegisterFormFields] = [errorMessages[0]];
                    }
                    return acc;
                }, {} as Partial<Record<RegisterFormFields, string[]>>),

            };
        }
        const exists = await UserModel.findOne({
            $or: [
                {
                    email: data.email,
                },
                {
                    account_status: { $ne: "pending" },
                    is_verified: true,
                    username: data.username,
                }
            ]
        });

        if (exists) {
            return {
                message: "User already exists",
                errors: {
                    "email": ["Email or username already taken!"],
                },
                success: false,
            };
        };
        const otp = generateOTP(6);
        const date = new Date();
        date.setMinutes(date.getMinutes() + 1);
        await sendEmailVerificationEmail({
            email: data.email,
            username: data.username,
            otp: otp,
        });
        await UserModel.create({
            ...data,
            password: await hash(data.password, 10),
            email_verification_token: otp,
            email_verification_token_expiry: date,
        });
        return {
            message: "Registration Successful!",
            success: true,
        };
    } catch (error) {
        return {
            message: "Failed to register!",
            success: false,
            errors: {
                email: ["Unexpected error occurred"],
            },
        };
    };
};


export async function verify(_: FormData): Promise<CustomResponse<undefined, "otp">> {
    await db();
    try {
        const { data, success, error } = BaseUserSchema.pick({ email: true, email_verification_token: true }).safeParse({
            email: _.get("email"),
            email_verification_token: _.get("email_verification_token"),
        });
        if (!success && error) {
            const formattedErrors = error.format();
            return {
                success: false,
                message: "Invalid Form Fields!",
                errors: {
                    otp: ["Incorrect fields!"],
                }

            };
        }
        const exists = await UserModel.findOne({
            email: data.email,
            email_verification_token: data.email_verification_token,
        });


        if (!exists) {
            return {
                message: "Incorrect Otp",
                errors: {
                    "otp": ["Incorrect Otp!"],
                },
                success: false,
            };
        };
        const checkDate = (new Date(exists.email_verification_token_expiry) < new Date());
        if (checkDate) {
            return {
                message: "Otp is expired!",
                errors: {
                    "otp": ["Otp is expired!"],
                },
                success: false,
            };
        };

        exists.is_verified = true;
        exists.account_status = "active";
        await exists.save();
        return {
            message: "Verification Complete",
            success: true,
        };
    } catch (error) {
        return {
            message: "Failed to Verify!",
            success: false,
            errors: {
                otp: ["Unexpected error occurred"],
            },
        };
    };
};

export async function newCode(_: FormData): Promise<CustomResponse<undefined, "otp">> {
    await db();
    try {
        const { data, success, error } = BaseUserSchema.pick({ email: true }).safeParse({
            email: _.get("email"),
        });
        if (!success && error) {
            const formattedErrors = error.format();
            return {
                success: false,
                message: "Invalid Form Fields!",
                errors: {
                    otp: ["Incorrect fields!"],
                }

            };
        }
        const exists = await UserModel.findOne({
            email: data.email,
        });


        if (!exists) {
            return {
                message: "User not found",
                errors: {
                    "otp": ["User not found!"],
                },
                success: false,
            };
        };
        if (new Date() < new Date(exists.email_verification_token_expiry)) {
            return {
                message: "Can't request a new code",
                errors: {
                    "otp": ["Can't request a new code!"],
                },
                success: false,
            };
        }
        const otp = generateOTP(6);
        const date = new Date();
        date.setMinutes(date.getMinutes() + 1);
        await sendEmailVerificationEmail({
            email: data.email,
            username: exists.username,
            otp: otp,
        });

        exists.email_verification_token = otp;
        exists.email_verification_token_expiry = date;
        await exists.save();
        return {
            message: "Code successfully sent!",
            success: true,
        };
    } catch (error) {
        return {
            message: "Failed to Send New Code!",
            success: false,
            errors: {
                otp: ["Unexpected error occurred"],
            },
        };
    };
};





export async function getCurrentUser(): Promise<{
    success: boolean;
    user?: {
        _id: string;
        username: string;
        email: string;
        role: string;
        account_status: string;
        is_online: boolean;
        is_verified: boolean;
        createdAt: string;
        updatedAt: string;
        __v: number;
    } | null;
}> {
    try {
        const session = await getServerSession(config);
        if (!session) return { success: false };
        await db();
        const user = await UserModel.findById(session.user.id)
            .select({
                password: 0,
                email_verification_token: 0,
                email_verification_token_expiry: 0,
            })
        if (!user) return { success: false };
        return {
            success: true,
            user: {
                __v: user.__v,
                _id: user._id.toString() as string,
                username: user.username,
                email: user.email,
                role: user.role,
                account_status: user.account_status,
                createdAt: user.createdAt.toString(),
                updatedAt: user.updatedAt.toString(),
                is_online: user.is_online,
                is_verified: user.is_verified,
            },
        };
    } catch (error) {
        return { success: false };
    }
};
