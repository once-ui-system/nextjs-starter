
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|image|images|icon|manifest|sw.js).*)',
    '/'
  ],
}


import { NextResponse, NextRequest, userAgent } from "next/server";
import { get } from '@vercel/edge-config'

// This function can be marked `async` if using `await` inside
export default async function MainMiddlewaer(request: NextRequest)
{

  const { browser } = userAgent(request)

  const url = request.nextUrl
  const hostName = url.hostname?.match(/localhost/) ? "localhost" : url.hostname
  const subDomain = hostName?.split('.')?.[2] && hostName?.split('.')?.[0] || ''
  subDomain && console.log('url.hostname =', new URL('/' + subDomain + '/' + url.pathname, url), '/' + subDomain + url.pathname)

  if (subDomain && !subDomain.match(/www.*|cnd.*|bflix.*|ufa.*|darin.*|alpha-bo.*/))
  {
    return NextResponse.rewrite(new URL('/' + subDomain, url))
  }

  /*       console.log("<<<<<<<<<<<<<<<<<<<<<<<<middleware>>>>>>>>>>>>>>>>>>>>>>>>",request)  */
  if (url.pathname.startsWith('/lobby') || url.pathname.startsWith('/auto') || url.hostname?.split('.')?.[0]?.startsWith('auto') || url.pathname.startsWith('/login') || url.pathname.startsWith('/play'))
  {
    if (browser.name?.match(/^Line/i))
    {
      url.searchParams.append("openExternalBrowser", "1")
      return NextResponse.redirect(new URL(url, request.nextUrl), 307)
    }
    else if (url.pathname.startsWith('/play'))
    {
      return NextResponse.rewrite(new URL('/login', url))
    }
  }
  else if (url.pathname.startsWith('/contact'))
  {
    return NextResponse.rewrite(new URL('/line', url))
  }
  else if (url.pathname.startsWith('/images/'))
  {
    const pathname = url.pathname
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<pathname>>>>>>>>>>>>>>>>>>>>>>>>\n", pathname)
    const redirectData = await get(`redirect`) as { [key: string]: string }
    /*   console.log("<<<<<<<<<<<<<<<<<<<<<<<<redirectData>>>>>>>>>>>>>>>>>>>>>>>>\n",typeof redirectData,redirectData)  */

    if (redirectData && typeof redirectData === 'object')
    {
      const filter = redirectData?.[pathname]
      /*     console.log("<<<<<<<<<<<<<<<<<<<<<<<<redirectjson>>>>>>>>>>>>>>>>>>>>>>>>\n",filter)  */
      if (filter && typeof filter == 'string')
        return NextResponse.redirect(filter, 307)
    }

    // No redirect found, continue without redirecting

  }
  return NextResponse.next()

}
