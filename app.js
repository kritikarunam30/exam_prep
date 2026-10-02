// Renders the `programs` array (see programs.js). You normally don't edit this file.

// Copies the raw string. Never reads from the DOM, so nothing gets HTML-escaped.
async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback for non-secure contexts (e.g. file://): still copies the raw string.
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(ta);
  if (!ok) throw new Error("Copy failed");
}

function makeCard(program) {
  const card = document.createElement("section");
  card.className = "card";

  const header = document.createElement("div");
  header.className = "card-header";

  const title = document.createElement("h2");
  title.textContent = program.title;

  const actions = document.createElement("div");
  actions.className = "actions";

  const showBtn = document.createElement("button");
  showBtn.textContent = "Show code";

  const copyBtn = document.createElement("button");
  copyBtn.className = "copy";
  copyBtn.textContent = "Copy";

  // Code is only for display; textContent keeps it as plain text (no HTML parsing).
  const pre = document.createElement("pre");
  pre.hidden = true;
  const codeEl = document.createElement("code");
  codeEl.textContent = program.code;
  pre.appendChild(codeEl);

  showBtn.addEventListener("click", () => {
    pre.hidden = !pre.hidden;
    showBtn.textContent = pre.hidden ? "Show code" : "Hide code";
  });

  copyBtn.addEventListener("click", async () => {
    try {
      await copyText(program.code);
      copyBtn.textContent = "Copied!";
    } catch (e) {
      copyBtn.textContent = "Failed";
    }
    setTimeout(() => { copyBtn.textContent = "Copy"; }, 1500);
  });

  actions.append(showBtn, copyBtn);
  header.append(title, actions);
  card.append(header, pre);
  return card;
}

const container = document.getElementById("programs");
programs.forEach((p) => container.appendChild(makeCard(p)));
