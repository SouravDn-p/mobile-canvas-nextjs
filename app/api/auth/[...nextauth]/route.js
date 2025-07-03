import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import client from "@/lib/mongoClient";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "john@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // const client = await clientPromise;
        const db = client.db("NextInvManager");

        const user = await db
          .collection("Users")
          .findOne({ email: credentials.email });
        if (!user) throw new Error("No user found");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || "user",
          image: user.image || null,
        };
      },
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      const db = client.db("NextInvManager");
      // ⚠️ Handle OAuth logins (Google/GitHub)
      if (
        account &&
        (account.provider === "google" || account.provider === "github")
      ) {
        const email = user?.email || token.email;
        const name = user?.name || token.name;
        const image = user?.image || token.picture;

        let existingUser = null;

        if (email) {
          existingUser = await db.collection("Users").findOne({ email });
          if (!existingUser) {
            const newUser = await db.collection("Users").insertOne({
              name,
              email,
              image,
              role: "user", // default role
              createdAt: new Date(),
            });

            token.id = newUser.insertedId.toString();
            token.role = "user";
          } else {
            token.id = existingUser._id.toString();
            token.role = existingUser.role || "user";
          }

          // Always assign manually to token
          token.name = name;
          token.email = email;
          token.picture = image;
        }
      }

      if (account?.provider === "credentials" && user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.picture;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
