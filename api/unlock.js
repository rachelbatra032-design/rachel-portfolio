module.exports = function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false });
    return;
  }

  var expected = process.env.CASE_STUDY_PASSWORD;
  var body = req.body || {};
  var password = typeof body.password === "string" ? body.password : "";

  if (!expected || password !== expected) {
    res.status(401).json({ ok: false });
    return;
  }

  var secure = process.env.VERCEL ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    "case_study=1; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400" + secure
  );
  res.status(200).json({ ok: true });
};
