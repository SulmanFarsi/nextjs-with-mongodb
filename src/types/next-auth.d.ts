import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            "username": string;
            "email": string;
            "role": "user" | "admin" | "editor" | "super_admin";
            "account_status": 'pending' | 'banned' | 'disabled' | 'active';
            "is_verified": boolean,
            "id": string;
            name: string;
        } & DefaultSession['user'],
    }
    interface User extends DefaultUser {
        "username": string;
        "email": string;
        "role": "user" | "admin" | "editor" | "super_admin";
        "account_status": 'pending' | 'banned' | 'disabled' | 'active';
        "is_verified": boolean,
        "id": string;
        name: string;
    }
}


declare module 'next-auth/jwt' {
    interface JWT {
        "username": string;
        "email": string;
        "role": "user" | "admin" | "editor" | "super_admin";
        "account_status": 'pending' | 'banned' | 'disabled' | 'active';
        "is_verified": boolean,
        "id": string;
        name: string;
    }
}