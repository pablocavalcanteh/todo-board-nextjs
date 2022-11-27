import { doc, getDoc } from "firebase/firestore";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import db from "../../../services/firebase";
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
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token, user }: any) {
      try {
        const lastDonate = await getDoc(
          doc(db, "users", String(token.sub))
        ).then((snapshot) => {
          if (snapshot.exists!) {
            return snapshot.data()?.lastDonate.toDate();
          }

          return null;
        });
        return {
          ...session,
          id: token.sub,
          vip: lastDonate ? true : false,
          lastDonate: lastDonate,
        };
      } catch (err) {
        return {
          ...session,
          id: null,
          vip: false,
          lastDonate: null,
        };
      }
    },
    async signIn({ user }: any) {

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
