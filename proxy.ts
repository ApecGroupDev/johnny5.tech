import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/apps/:path*", 
    "/ruby-queen/:path*", 
    "/project-updates/:path*", 
    "/rain-risk-dashboard.html",
    "/site360/:path*"
  ],
};
