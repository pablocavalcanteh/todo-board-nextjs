import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
export const authOptions = {

  providers: [
    GithubProvider({
      clientId: '',
      clientSecret: '',
      authorization: {
        params: {
            scope: "read:user"
        }
      }
    }),

  ],
}
export default NextAuth(authOptions)