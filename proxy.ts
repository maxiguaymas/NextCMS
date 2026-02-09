import { withAuth } from "next-auth/middleware";

export default withAuth(
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const role = token?.role;
        const pathname = req.nextUrl.pathname;

        if (pathname.startsWith("/dashboard/users")) {
          return role === "ADMIN";
        }

        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};