import { connectToDB } from "@/utils/db";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import CredentialsProvider from "next-auth/providers/credentials";
import { doLogout } from "./app/actions";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        if (!credentials) return null;
        const { email } = credentials;
        const db = await connectToDB();
        const collection = db.collection("users");
        const user = await collection.findOne({ email });

        if (user) {
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role, // Include role here
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user._id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        const db = await connectToDB();
        const collection = db.collection("users");

        const email = token.email;

        if (email) {
          const user = await collection.findOne({ email:email });
          
          if (user) {
              session.user = {
                  name: user.name,
                  email: user.email,
                  role: user.role,
                };
            return session;
          } else {
            return null;
          }
        } else {
          return null;
        }
      }
    },
  },
});
