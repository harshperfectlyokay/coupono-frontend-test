export const authConfig = {
  session: {
    strategy: "jwt", // Use JWT-based session strategy
    maxAge: 24 * 60 * 60, // 1 Day
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: []
};
