import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const middleware = async (req: NextRequestWithAuth) => {
  try {
    const pathname = req.nextUrl.pathname;

    const isAuth = await getToken({ req });
    const isLoginPage = pathname.startsWith("/login");

    const sensitiveRoutes = ["/dashboard"];
    const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isLoginPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      return NextResponse.next();
    }

    if (!isAuth && isAccessingSensitiveRoute) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  } catch (error) {
    console.log(error);
  }
};

export default withAuth(middleware, {
  callbacks: {
    async authorized() {
      return true;
    },
  },
});

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
