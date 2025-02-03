import db from "@/lib/db";
import UserModel from "@/models/User";
import { compare } from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const config: NextAuthOptions = {
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { type: "text" },
                password: { type: "password" },
            },
            async authorize(credentials, req) {
                if (!credentials) throw new Error("All Fields are required!");
                await db();
                const user = await UserModel.findOne({ email: credentials.email });

                if (!user) {
                    throw new Error("Invalid email or account does not exist!");
                };
                if (!user.is_verified) {
                    throw new Error("Your email is not verified. Please check your inbox.");
                }
                
                if (user.account_status != "active") {
                    throw new Error("Your account has been banned. Contact support.");
                }
                

                const isMatched = await compare(credentials.password, user.password)
                if (!isMatched) throw new Error("Password is incorrect!");
                return {
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    account_status: user.account_status,
                    is_verified: user.is_verified,
                    id: user._id.toString() as string,
                    image: user.image,
                    name: user.username,
                };
            },
        })
    ],
    callbacks: {
        session({ token, session }) {
            if (token) {
                session.user.username = token.username;
                session.user.email = token.email;
                session.user.role = token.role;
                session.user.account_status = token.account_status;
                session.user.is_verified = token.is_verified;
                session.user.id = token.id;
                session.user.name = token.name;
            };
            return session;
        },
        jwt(params) {
            if (params.user) {
                params.token.username = params.user.username;
                params.token.email = params.user.email;
                params.token.role = params.user.role;
                params.token.id = params.user.id;
                params.token.name = params.user.name;
            };
            return params.token;
        },
    },
    pages: {
        signIn: "/account/login",
        newUser: "/account/register",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
export default config;