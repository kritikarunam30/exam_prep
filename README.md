# Exam Prep Programs

A tiny static site: each program shows a title, a **Show code** button and a **Copy** button.
Copy puts the exact original source on the clipboard.

## Edit programs
Open `programs.js`. Change a title, replace `code`, add an entry, or delete one. The page renders from that list.
Read the comment at the top of the file for the paste rules (backslashes are fine; avoid backticks and `${` unless you follow the note there).

## Run locally
Open `index.html` in a browser, or run `npx serve .` / `python -m http.server`.

## Test (optional)
`npm i playwright && npx playwright install chromium`, then `node tests/copy-test.js`.

## Push to GitHub
```
cd C:\Users\kriti\.vscode\exams_prep
git init            # skip if already its own repo
git add .
git commit -m "Initial commit"
git branch -M main
```
Create an **empty** repo on github.com (no README), then:
```
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## Deploy on Vercel (auto-deploys on every push)
1. Sign in at vercel.com with GitHub.
2. **Add New → Project** → import your repo.
3. Framework Preset: **Other**. Leave Build Command and Output Directory empty. Click **Deploy**.
4. From now on, `git push` to `main` redeploys automatically; other branches get preview URLs.
