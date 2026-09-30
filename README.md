# Rachel Batra, portfolio

Static HTML. Public repo: [rachel-portfolio](https://github.com/rachelbatra032-design/rachel-portfolio). Host on Vercel.

```
index.html about.html play.html
work/                 case studies
images/ fonts/
api/unlock.js         sets the PCM cookie
middleware.js         blocks Agentforce Catalog without that cookie
vercel.json
```

## Local

```bash
python3 -m http.server 3000
```

Open [http://localhost:3000](http://localhost:3000). The Agentforce Catalog password gate only runs on Vercel.

## Vercel

Import this repo. Framework: Other. Root: `.`. Build command empty. Output directory empty. Production branch: `main`.

Add environment variable `CASE_STUDY_PASSWORD` (Production and Preview).
