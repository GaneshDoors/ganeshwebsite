from pathlib import Path
import re
import json
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
IGNORE = (
    "http://",
    "https://",
    "mailto:",
    "tel:",
    "#",
    "javascript:",
    "data:"
)

HTML_FILES = sorted(ROOT.rglob("*.html"))

titles = {}
descriptions = {}

errors = []
warnings = []

for html in HTML_FILES:

    text = html.read_text(encoding="utf-8", errors="ignore")

    m = re.search(r"<title>(.*?)</title>", text, re.I | re.S)

    if not m:
        errors.append(f"{html} -> Missing <title>")
    else:
        title = m.group(1).strip()

        if title in titles:
            warnings.append(f"Duplicate title:\n{title}\n{html}\n{titles[title]}")
        else:
            titles[title] = html

    m = re.search(
        r'<meta\s+name="description"\s+content="([^"]+)"',
        text,
        re.I
    )

    if not m:
        errors.append(f"{html} -> Missing meta description")
    else:

        desc = m.group(1).strip()

        if desc in descriptions:
            warnings.append(
                f"Duplicate meta description:\n{html}\n{descriptions[desc]}"
            )
        else:
            descriptions[desc] = html

    if 'rel="canonical"' not in text.lower():
        warnings.append(f"{html} -> Missing canonical tag")

    og_required = [
        "og:title",
        "og:description",
        "og:image",
        "og:url"
    ]

    for tag in og_required:

        if tag not in text:
            warnings.append(f"{html} -> Missing {tag}")

    schemas = re.findall(
        r'<script\s+type="application/ld\+json">\s*(.*?)\s*</script>',
        text,
        re.S | re.I
    )

    for s in schemas:

        try:
            json.loads(s)
        except Exception as e:
            errors.append(f"{html} -> Invalid JSON-LD ({e})")

    refs = re.findall(
        r'(?:href|src)="([^"]+)"',
        text,
        re.I
    )

    for ref in refs:

        ref = ref.split("#")[0]

        if not ref:
            continue

        if ref.startswith(IGNORE):
            continue

        target = (html.parent / ref).resolve()

        if ref.endswith("/"):
            target = target / "index.html"

        if not target.exists():
            errors.append(f"{html} -> Missing file: {ref}")

if not (ROOT / "robots.txt").exists():
    errors.append("robots.txt not found")

site = ROOT / "sitemap.xml"

if not site.exists():

    errors.append("sitemap.xml not found")

else:

    try:
        ET.parse(site)
    except Exception as e:
        errors.append(f"sitemap.xml invalid ({e})")

print("=" * 60)
print("GANESH DOORS WEBSITE CHECK")
print("=" * 60)

print(f"\nHTML Files : {len(HTML_FILES)}")

print(f"Errors     : {len(errors)}")

print(f"Warnings   : {len(warnings)}")

if errors:

    print("\nERRORS")
    print("-" * 60)

    for e in errors:
        print(e)

if warnings:
    print("\nWARNINGS")
    print("-" * 60)

    for w in warnings:
        print(w)

if errors:
    print("\nWebsite check failed.")
    raise SystemExit(1)

if warnings:
    print("\nWebsite check completed with warnings. ⚠")
else:
    print("\nWebsite check passed successfully. ✔")