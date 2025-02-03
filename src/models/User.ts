import mongoose, { Model } from "mongoose";


import z from "zod";

export const BaseUserSchema = z.object({
    "username": z.string().min(1).max(50).regex(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,50}$/igm),
    "email": z.string().email().regex(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g),
    "password": z.string().min(8).max(50).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm),
    "password_confirmation": z.string(),
    "role": z.enum(["user", "admin", "editor", "super_admin"]).default('user'),
    "account_status": z.enum(['pending', 'banned', 'disabled', 'active']).default('pending'),
    "is_online": z.boolean().default(false),
    "bio": z.string().min(10).max(1000).regex(/^[a-zA-Z0-9.,!?@#$%^&*()_\-+=/'" \n]{10,1000}$/).nullable(),
    "email_verification_token": z.string().min(6).max(6).nullable(),
    "email_verification_token_expiry": z.date().nullable(),
    "is_verified": z.boolean().default(false),
});


export const RegisterUserSchema = BaseUserSchema.pick({ username: true, password: true, password_confirmation: true, email: true }).refine(data => data.password === data.password_confirmation, { message: "Password confirmation failed", path: ["password_confirmation"] });
export type RegisterUserSchemeType = z.infer<typeof RegisterUserSchema>;
export const LoginUserSchema = BaseUserSchema.pick({ password: true, email: true });
export type LoginUserSchemeType = z.infer<typeof LoginUserSchema>;
export const VerifyUserSchema = BaseUserSchema.pick({ email_verification_token: true, email: true }).required();
export type VerifyUserSchemeType = z.infer<typeof VerifyUserSchema>;


export interface UserDocument extends mongoose.Document {
    "_id": mongoose.Types.ObjectId;
    "username": string;
    "email": string;
    "password": string;
    "role": "user" | "admin" | "editor" | "super_admin";
    "account_status": 'pending' | 'banned' | 'disabled' | 'active';
    "is_online": boolean;
    "bio": string;
    "email_verification_token": string,
    "email_verification_token_expiry": Date,
    "is_verified": boolean,
    "image": string;
    'createdAt':Date,
    'updatedAt':Date,
}



const UserSchema = new mongoose.Schema<UserDocument>({
    username: {
        validate: {
            validator: (data) => BaseUserSchema.pick({ username: true }).safeParse({ username: data }).success,
            message: "Username is invalid",
        },
        required: true,
        unique: false,
        type: String,
    },
    email: {
        type: String,
        unique: true,

        validate: {
            validator: (data) => BaseUserSchema.pick({ email: true }).safeParse({ email: data }).success,
            message: "Email is invalid",
        },
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "admin", "editor", "super_admin"],
        default: "user",
        required: false,
    },
    account_status: {
        type: String,
        required: false,
        enum: ['pending', 'banned', 'disabled', 'active'],
        default: "pending",
    },
    is_online: {
        type: Boolean,
        default: false,
        required: false,
    },
    bio: {
        type: String,
        required: false,
    },
    email_verification_token: {
        type: String,
        required: false,
    },
    email_verification_token_expiry: {
        type: Date,
        required: false,
    },
    is_verified: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String,
        required: false,
    }
}, {
    timestamps: true,
});
const UserModel = (mongoose.models?.User as Model<UserDocument>) || (mongoose.model<UserDocument>("User", UserSchema))
export default UserModel;