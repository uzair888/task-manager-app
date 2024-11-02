// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose"; // Import the JWT verify function from jose

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // Retrieve token from HTTP-only cookie

  if (token) {
    try {
      // Verify the token using the jose library
      const secret = new TextEncoder().encode(process.env.JWT_SECRET); // Convert secret to Uint8Array for jose
      const { payload } = await jwtVerify(token, secret);

      // Attach the decoded payload to the request
      (req as any).user = payload;

      return NextResponse.next(); // Continue to the route if token is valid
    } catch (err) {
      console.error("Token verification failed:", err);

      // Redirect to login if token verification fails
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  } else {
    // Redirect to login if no token is present
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/tasks/:path*"], // Protect dashboard and tasks API routes
};
