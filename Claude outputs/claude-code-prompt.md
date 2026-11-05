# Claude Code prompt: finish the Ultraa Albums homepage

Paste everything below the line into Claude Code, run from the project root (`~/Downloads/ultraa`). Before you start, do the setup steps in the section right after this one.

## Setup (do once, before pasting the prompt)

1. Install the skills: `bash install-skills.sh` (puts nine skill folders in `~/.claude/skills`). Restart Claude Code and check `/skills` lists them.
2. Copy `manus-homepage-brief-v2.md` into the project root and rename it `BRIEF.md`.
3. Make sure Node 22+ is installed. Chrome is needed for the skills' render checks.
4. Run `git init && git add -A && git commit -m "Manus baseline"` so every change is reviewable. Do not push anywhere.

---

You are finishing a competition-entry homepage for **Ultraa Albums** (Mumbai wedding-album studio). A previous tool (Manus) built a first version and ran out of credits. The project is a Vite + Three.js static site in this folder. Do not ask me questions unless you are truly blocked; make reasonable decisions and record them in `HANDOFF.md`.

## 0. Read first

1. `BRIEF.md` is the source of truth for rules, copy limits and the hard bans.
2. Read `PRODUCT.md`, `DESIGN.md`, `plan.md`, `TODO.md`, `README.md`, `src/content.js`, `src/main.js`, `src/album-scene.js`, `scripts/render-home.mjs` and `src/site.css`.
3. Load and follow these skills (read each SKILL.md and the references it names): **taste-skill, hallmark, impeccable, apple-design, better-typography, motion-design, laws-of-ux** (plus laws-of-ux-review and laws-of-ux-checklist). If two disagree, the hard bans in taste-skill, hallmark and impeccable win, then `BRIEF.md`, then everything else. Tell me at the start which skills actually loaded.
4. Light mode only. Never push to any remote. Commit locally in small, named commits.

## 1. Get it running and look at it

- Install dependencies (use pnpm if available, otherwise npm) and **create the lockfile**. Fix the README to match what actually works.
- Build, then screenshot the page at 375, 390, 768, 1024 and 1440 px wide (Playwright is fine). Look at every screenshot. Record what you find before changing anything.
- Confirm the first screen at 1280×800 shows the h1, the sentence, both buttons and the top of the album without scrolling. If it doesn't, fix the hero layout.

## 2. Known defects to fix (found in review)

1. **Broken 3D hero textures.** `src/content.js` loads the album's page photos from `/manus-storage/async-images/...`, which does not exist in this project. The scene throws and silently falls back to the still image, so the opening animation never runs and the audience switch can't change the book pages. Repoint `pageImages` and `pagesForModel` to local images in `public/assets/images/` (the three `editing-pair-*` wedding photos are suitable), then confirm in a real browser that the album opens once on load, shows the fully open book under reduced motion, and falls back correctly when WebGL is unavailable. Remove every reference to `/manus-storage`.
2. **Contact form looks broken on first load.** It shows "The form is not connected" and a disabled button. Replace this: when no endpoint is configured, the form should work by opening the visitor's email app with a prefilled message to the real email in `PRODUCT.md`, and say plainly that this is what happens. When `VITE_ULTRAA_FORM_ENDPOINT` is set, keep the current POST behaviour. Never show a fake success state. Add `.env.example`.
3. **Fake before/after.** The slider shows one photo with two CSS filters. Restructure the data so each example is `{ before, after }` image files so real pairs can be dropped in later. Until real pairs exist, keep the slider only if the demo still reads honestly; list it as a stand-in in `HANDOFF.md`. Do not present it as client work or evidence of results.
4. **Copy bugs.** The Photo Books row says "finish choices listed below" but nothing lists them: fix it. The nav label "Packages" does not match the section "Album options": make them consistent (prefer "Album options").
5. **Leftovers.** Remove the design-notes HTML comment that `scripts/render-home.mjs` writes into `index.html`. Remove Manus-platform files (`public/manus-routes.json`, `app.config.ts`) after confirming nothing imports them.

## 3. Missing deliverables

Create `HANDOFF.md`: decisions, verified sources, every generated stand-in image, absent items (tiers, blog titles, form endpoint), which skills loaded, which checks ran or could not run, and limitations. Create the lockfile and `.env.example`.

## 4. Quality passes (run each, fix every failure, report results)

- **taste-skill:** its consistency, layout (five widths) and performance checks.
- **hallmark:** `sloplint --render`, then its judged gates and finish review.
- **impeccable:** `audit`, then `polish`, in Persuade mode, plus the craft floor.
- **better-typography:** review the built page; fix measure, scale, widows, numerals, font loading.
- **motion-design:** run its quality checklist on every animation; Premium archetype.
- **apple-design:** pointer-down feedback, interruptible motion, reduced motion / transparency / contrast.
- **laws-of-ux:** run `laws-of-ux-review` (0–60 score with prioritised fixes) and the 12-point checklist; fix everything critical; include the score in `HANDOFF.md`.
- Lighthouse: aim for 95+ in all four categories on the built page. Report real numbers.

## 5. Then push the quality higher, inside the rules

This is judged on how professional and polished it looks. After the passes above, spend the remaining effort on the details that make it feel built, not assembled: typography rhythm, spacing, photograph crops, hover and focus states, the hero composition, button and table design, and themed browser surfaces (selection, caret, scrollbar, focus ring). Do not add anything the hard bans forbid (no scroll-triggered motion, no marquee, no invented proof, no eyebrows, no captions under images, no gradients, no glass).

## 6. Finish

Give me: a short summary, the screenshots you checked, the check results, anything you could not do and why, and the exact commands to run the site. Do not push.
