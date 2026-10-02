// Optional test: clicks every Copy button and checks the clipboard equals the source EXACTLY.
// Not needed for deployment.
// Run (needs playwright available):  node tests/copy-test.js
// To use an installed browser instead of Playwright's:  PW_CHANNEL=msedge node tests/copy-test.js
const http = require("http");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { chromium } = require("playwright");

const root = path.join(__dirname, "..");

// Load the `programs` array from programs.js the same way the browser does.
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, "programs.js"), "utf8") + "\nthis.programs = programs;", ctx);
const programs = ctx.programs;

const server = http.createServer((req, res) => {
  const file = path.join(root, req.url === "/" ? "index.html" : req.url.split("?")[0]);
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end(); }
    const type = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" }[path.extname(file)] || "text/plain";
    res.writeHead(200, { "Content-Type": type + "; charset=utf-8" });
    res.end(data);
  });
});

// Windows stores line breaks on the OS clipboard as CRLF, so only that is normalized before comparing.
const CRLF = String.fromCharCode(13, 10);
const LF = String.fromCharCode(10);
const normalize = (s) => s.split(CRLF).join(LF);

(async () => {
  await new Promise((r) => server.listen(0, r));
  const url = `http://localhost:${server.address().port}/`;
  const browser = await chromium.launch(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {});
  const context = await browser.newContext({ permissions: ["clipboard-read", "clipboard-write"] });
  const page = await context.newPage();
  await page.goto(url);

  let failed = 0;
  const cards = page.locator(".card");
  if ((await cards.count()) !== programs.length) { console.log("FAIL: card count"); failed++; }

  for (let i = 0; i < programs.length; i++) {
    const copyBtn = cards.nth(i).locator("button.copy");
    await copyBtn.click();
    await page.waitForFunction((el) => el.textContent !== "Copy", await copyBtn.elementHandle());
    const label = await copyBtn.textContent();
    const clip = normalize(await page.evaluate(() => navigator.clipboard.readText()));
    const ok = clip === programs[i].code && label === "Copied!";
    console.log(`${ok ? "PASS" : "FAIL"}: ${programs[i].title} (${clip.length} chars, button: ${label})`);
    if (!ok) {
      failed++;
      console.log("  expected:", JSON.stringify(programs[i].code));
      console.log("  got:     ", JSON.stringify(clip));
    }
  }

  // Button text should revert to "Copy".
  await page.waitForTimeout(1800);
  const reverted = await cards.nth(0).locator("button.copy").textContent();
  console.log(`${reverted === "Copy" ? "PASS" : "FAIL"}: button reverts to "Copy"`);
  if (reverted !== "Copy") failed++;

  // Code must be hidden by default, and "Show code" must toggle it.
  const pre = cards.nth(0).locator("pre");
  const showBtn = cards.nth(0).locator("button", { hasText: /code/ });
  const hiddenFirst = !(await pre.isVisible());
  await showBtn.click();
  const shown = await pre.isVisible();
  const displayed = await pre.textContent();
  const toggleOk = hiddenFirst && shown && displayed === programs[0].code;
  console.log(`${toggleOk ? "PASS" : "FAIL"}: code hidden by default, Show code reveals exact text`);
  if (!toggleOk) failed++;

  await browser.close();
  server.close();
  console.log(failed ? `\n${failed} FAILED` : "\nAll tests passed");
  process.exit(failed ? 1 : 0);
})();
