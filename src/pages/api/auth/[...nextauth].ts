import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
export const authOptions = {
  providers: [
    GithubProvider({
      clientId: "",
      clientSecret: "",
      authorization: {
        params: {
          scope: "read:user",
        },
      },
    }),
  ],
  callbacks: {
    async session({session, token, user}) {

      try {
        return {
          ...session,
          id: token.sub
        }
      } catch(err) {
        return {
          ...session,
          id: null
        }
      }
      
    },
    async signIn({ user }) {

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
