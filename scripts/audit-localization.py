"""Audit current HTML and request-message copy without a browser dependency."""
import argparse
from html.parser import HTMLParser
import json
from pathlib import Path
import subprocess


class CopyParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.keys = set()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        skip = (bool(self.stack) and self.stack[-1][1]) or tag in {
            "script", "style", "head"
        } or attrs.get("translate") == "no" or attrs.get("aria-hidden") == "true"
        if not skip:
            for attr in ("placeholder", "aria-label", "title", "alt"):
                if attrs.get(attr):
                    self.keys.add(attrs[attr])
        if tag not in {"meta", "link", "img", "input", "br", "hr"}:
            self.stack.append((tag, skip))

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                self.stack = self.stack[:index]
                break

    def handle_data(self, value):
        if self.stack and not self.stack[-1][1] and value.strip():
            self.keys.add(" ".join(value.split()))


parser = argparse.ArgumentParser()
parser.add_argument("--node", default="node")
parser.add_argument("--report", action="store_true")
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
html = (root / "index.html").read_text(encoding="utf-8")
assert 'locale-completion.js?v=20260915-brief' in html, 'Current catalogue must be loaded by the page'
assert html.index('locale-completion.js?') < html.index('src="script.js'), 'Load translations before UI initialization'
copy = CopyParser()
copy.feed(html)
copy.keys.update({"Nombre / marca", "Mensaje copiado.", "No se pudo copiar. Abre WhatsApp o correo."})
fixed = {"Idioma / Language", "MedStock", "Scriptorium", "Psyche Lab", "Inner Oraculum", "Volia", "Landing Express"}
keys = sorted(k for k in copy.keys if k not in fixed and not k.startswith(("$", "josuepug@", "WhatsApp:")))
script = """
const fs = require('node:fs'), vm = require('node:vm');
const context = vm.createContext({window:{}});
for (const file of ['translations.js','studio-copy.js','locale-completion.js']) {
  if (fs.existsSync(file)) vm.runInContext(fs.readFileSync(file,'utf8'), context, {filename:file});
}
process.stdout.write(JSON.stringify(context.window));
"""
data = json.loads(subprocess.check_output([args.node, "-e", script], cwd=root, encoding="utf-8"))
catalogues = data["NEXO_TRANSLATIONS"]
exceptions = data.get("NEXO_LOCALE_EXCEPTIONS", {})
gaps = {}
for locale, dictionary in catalogues.items():
    for message in ("NEXO_FORM_INTRO", "NEXO_FORM_CLOSING"):
        assert data[message].get(locale, "").strip(), f"{locale}: missing {message}"
    if locale == "es":
        continue
    missing = [key for key in keys if not dictionary.get(key)]
    copied = [key for key in keys if locale != "en" and dictionary.get(key) == catalogues["en"].get(key)
              and key not in exceptions.get(locale, [])]
    if missing or copied:
        gaps[locale] = {"missing": missing, "english": copied}
if args.report:
    print(json.dumps({"source_count": len(keys), "gaps": gaps}, ensure_ascii=True, indent=2))
else:
    assert not gaps, json.dumps(gaps, ensure_ascii=True, indent=2)
    print(f"Localization: {len(keys)} active sources checked in {len(catalogues) - 1} target languages.")
    print("No missing or unreviewed English fallback values. This is not native-language certification.")
