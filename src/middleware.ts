import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'; // ***************** createRouteMatcher 추가
import { NextResponse } from 'next/server'; // ***************** NextResponse 추가

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']); // ***************** 보호할 라우팅 및 일치 여부 체크 함수 설정

// ****************************** 로그인 여부와 보호 라우팅 경로여부 체크하여 유효하지 않을 경우 리다이렉트 함
export default clerkMiddleware(async (auth, req) => {
    // !auth().userId : 사용자 id 가 있는지 확인함 (로그인하지 않았고) ,
    // isProtectedRoute(req) : 요청경로가 설정한 경로와 일치하는 경로가 아니라면...
    if (!(await auth()).userId && isProtectedRoute(req)) {
        return NextResponse.redirect(new URL('/login', req.url)); // 로그인 페이지로 리다이레그함
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
