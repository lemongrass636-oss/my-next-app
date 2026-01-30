// middleware.ts
import { createServerClient } from '@supabase/ssr' // NextRequest をここから削除
import { NextResponse, type NextRequest } from 'next/server' // こちらに追加

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // ログインしていない、かつ /Homeと/About、/board や /posts にアクセスしようとしている場合
  const protectedRoutes = ['/', '/about', '/board', '/posts']
  const isProtectedRoute = protectedRoutes.some(path => request.nextUrl.pathname.startsWith(path))

  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/board/:path*', '/posts/:path*'],
}