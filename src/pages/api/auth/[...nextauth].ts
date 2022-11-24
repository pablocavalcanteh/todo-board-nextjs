import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }: any) {
      try {
        return {
          ...session,
          id: token.sub,
        };
      } catch (err) {
        return {
          ...session,
          id: null,
        };
      }
    },
    async signIn({ user }: any) {
      const { email } = user;

      try {
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
};
export default NextAuth(authOptions);
