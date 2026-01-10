// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  () => NextResponse.next(),
  {
    callbacks: {
      authorized: ({ token }) => {
        // Require authentication to access /admin routes.
        //we keep server-side role checks for write operations.
        return !!token;
      }
    }
  }
);

export const config = { matcher: ["/admin/:path*"] };
