export const config = {
  matcher: [
    "/work/pcm-agent",
    "/work/pcm-agent.html",
    "/images/pcm-agent-full.mp4"
  ]
};

export default function middleware(request) {
  var cookie = request.headers.get("cookie") || "";
  if (/(?:^|;\s*)case_study=1(?:;|$)/.test(cookie)) {
    return;
  }
  return Response.redirect(new URL("/work/unlock.html", request.url), 302);
}
