import connectDB from "@/config/database";
import User from "@/models/User";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions, Session } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }: any) {
      await connectDB();

      const userExists = await User.findOne({ email: profile.email });
      if (!userExists) {
        const username = profile.name.slice(0, 20);

        await User.create({
          email: profile.email,
          username,
          image: profile.picture,
        });
      }
      return true;
    },
    // async session({ session }: { session: Session })
    async session({ session }: any) {
      const user = await User.findOne({ email: session.user?.email });
      if (user) {
        session.user.id = user._id.toString();
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_URL_SECRET,
};
