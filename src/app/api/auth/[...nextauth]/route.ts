import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "password", type: "password" }
        },

        async authorize(credentials, req) {
            const user = { id: "1", name: "Ashish", email: "ashish@example.com" };
            if (
                credentials?.email === "ashish@example.com" && credentials?.password === "Test@123"
            ) {
                return user;
            }
            return null
        }
    })],
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login"
    }
})

export { handler as GET, handler as POST } 