const fs = require("fs");
const { execSync } = require("child_process");

try {
  const fileContent = fs.readFileSync(".env.local", "utf8");
  const lines = fileContent.split("\n");

  lines.forEach(line => {
    line = line.trim();
    if (line && !line.startsWith("#")) {
      const eqIdx = line.indexOf("=");
      if (eqIdx !== -1) {
        const key = line.slice(0, eqIdx).trim();
        const val = line.slice(eqIdx + 1).trim().replace(/^["'`]/, "").replace(/["'`]$/, "");
        console.log(`Adding ${key}...`);
        try {
          execSync(`printf "%s" "${val}" | vercel env add ${key} production`, { stdio: "inherit" });
        } catch (e) {
          console.log(`Failed or already added: ${key}`);
        }
      }
    }
  });
} catch (err) {
  console.error("Error reading .env.local file:", err.message);
}
