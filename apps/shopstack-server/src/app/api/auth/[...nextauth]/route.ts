import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

if (
  !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_CLIENT_SECRET
)
  throw Error('Missing environment variables');

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
});

export { handler as GET, handler as POST };
