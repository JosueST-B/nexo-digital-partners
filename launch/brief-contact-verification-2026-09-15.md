# Nexo Brief beside contact - 2026-09-15

## Change

The commercial site's contact section now offers an optional route for visitors who are still defining their project: open Nexo Brief or visit its free / optional-contribution Gumroad download. The existing contact form and direct contact links remain in place. The new copy explicitly limits the tool's languages to Spanish and English even when the commercial site is viewed in another language.

No change to the downloadable product, prices, backend behavior or contact recipient. Both new links open separately with `rel="noopener"` and fixed destinations; they do not include form values in the URL. No request is automatically sent.

## Local verification

- `scripts/audit-localization.py`: 135 active source strings checked in eleven additional languages; no missing values or unreviewed English fallback. Four new source strings, not a claim of native-language certification.
- `scripts/test-offer-copy.cjs`: three offer sources, 33 translations and four unchanged prices passed.
- Browser test in the in-app browser: twelve languages x actual viewport widths 320, 390, 768 and 1440, height 900. All 48 cases matched the requested language and viewport, with no page horizontal overflow, no overlapping new links, and both links within their container.
- Screenshots inspected at 1440 x 900 and 320 x 760 in Spanish. Desktop retains the side-by-side contact layout; mobile wraps the two resource links onto separate lines.
- A separate Brave run stayed at an actual width of 1280 despite requested viewport changes. It was not counted as responsive coverage; the full matrix was repeated in the in-app browser with actual widths asserted.
- Functional check with fictional contact data: opening Nexo Brief created a separate tab with the correct working tool. Returning to the original form and preparing the request retained the test name, contact and message in the generated WhatsApp URL. The URL was inspected, not followed or sent.

The temporary localhost server was stopped after testing. CSS and the translation catalogue use the `20260915-brief` cache version. Code commit: `1fd4a6d`.

## Published verification

GitHub Pages deployment job `35014506675` completed successfully, including the localization and offer-copy gates. The public page was reloaded and showed the new Spanish copy and both correct HTTPS destinations. An additional public check at 320 pixels in Arabic confirmed RTL and no horizontal overflow. The page was restored to Spanish and the viewport override was removed.

Public page: https://josuest-b.github.io/nexo-digital-partners/#contacto

## Remaining limits

This improves resource discovery on the commercial website; it does not add a return-to-services link inside the downloadable Brief. Gumroad's ZIP and checkout were not changed or retested. No conversion lift, new inquiries or sales are established by these checks. Fiverr images and publication remain deferred at the user's request.
