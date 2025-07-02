// Modify your authOptions to include pages and callbacks config
import { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions, getServerSession } from "next-auth";

const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        // Add logic here to look up the user from the credentials supplied
        const user = {
          id: "1",
          name: "Admin",
          email: "janusz.wozniak@jw-digital.co.uk",
        };
        if (
          credentials &&
          credentials.username === "jsmith" &&
          credentials.password === "password"
        ) {
          return user;
        } else {
          return null;
        }
      },
    }),
    // ...add more providers here
  ],
  // Customize pages
  pages: {
    signIn: "/login", // Use our custom login page
    // You can also customize other pages:
    // signOut: '/auth/signout',
    // error: '/auth/error',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // If user just signed in, redirect to admin
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/admin`;
      }

      // If the URL is the login page, redirect to admin
      if (url === `${baseUrl}/login`) {
        return `${baseUrl}/admin`;
      }

      // If it's a relative URL starting with /, prepend baseUrl
      if (url.startsWith("/")) {
        // If it's the login page, redirect to admin instead
        if (url === "/login") {
          return `${baseUrl}/admin`;
        }
        return `${baseUrl}${url}`;
      }

      // If it's an absolute URL on the same origin, allow it
      if (new URL(url).origin === baseUrl) {
        return url;
      }

      // Default fallback to admin
      return `${baseUrl}/admin`;
    },
    async signIn({ user, account, profile }) {
      // Allow sign in
      return true;
    },
    async jwt({ token, user }) {
      // Persist user data to the token
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token.user) {
        session.user = token.user as User;
      }
      return session;
    },
  },
  // For security in production, set these as environment variables
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-for-development",
  session: {
    strategy: "jwt", // Use JWT for session handling
  },
};

/**
 * Helper function to get the session on the server without having to import the authOptions object every single time
 * @returns The session object or null
 */
const getSession = () => getServerSession(authOptions);

export { authOptions, getSession };
