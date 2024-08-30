import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
// import { isAccessible } from "./lib/Actions/accessControlActions";
import { checkAccess, updateRoute } from "./services/accessControlService";
// import { checkAccess, updateRoute } from "./services/accessControlService";
// import NextAuth from "next-auth";
// import { authConfig } from "./auth.config";
// const {auth} = NextAuth(authConfig)
export async function middleware(req) {
  // console.log('secret - ',process.env.NEXTAUTH_SECRET);
  // const session = await auth()
  // console.log('session in middleware - ',session);
  const { pathname, origin } = req.nextUrl;
  const method = req.method;
  const referer = req.headers.get("referer");
  console.log(
    "this is requested path, origin, referer : ",
    pathname,
    origin,
    referer
  );
  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/private")) {
    return NextResponse.next();
  }
  // const res = await updateRoute(pathname, origin, referer,method);
  // console.log('new route storing response - ',res);
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.redirect(`${process.env.baseURL}/login`);
  } else if (token && token?.role == "ADMIN") {
    return NextResponse.next();
  } else {
    // const res = await checkAccess(pathname, referer, token);
    // console.log("checkAccess res - ", res);
    if (res.success) {
      return NextResponse.next();
    } else {
      return NextResponse.json({
        message: "Permission denied: You do not have access to this route.",
        success: false,
      });
    }
  }
  // if(pathname===`/login` || pathname===`/signup` || pathname.startsWith('/api/auth') || pathname==="/"){
  // return NextResponse.next();
  // }
  // if (
  //   pathname &&
  //   !pathname.includes("/api/auth/session")
  // ) {
  //   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  //   if (!token && pathname.startsWith("/admin")) {
  //     // return NextResponse.redirect(`${process.env.baseURL}/login`);
  //     return NextResponse.json({success:false,message:"Kindly Login To Proceed. Go to url /login"});
  //   }

  // console.log("this is requested path : ", pathname);
  //   const res = await checkAccess(pathname, origin, referer, token?.role);
  //   console.log('checkAccess res - ',res);
  //   if (res.success) {
  //     return NextResponse.next();
  //   } else {
  // const res = await updateRoute(pathname, origin, referer);
  //     console.log('updateRoute res - ',res);
  //     return NextResponse.json({
  //       message: "Permission denied: You do not have access to this route.",
  //       success: false,
  //     });
  //   }
  // }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
