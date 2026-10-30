# Unfinished

**Where was I, and how do I start again?**

Unfinished reconstructs a paused software project, surfaces disagreements between notes and code, and proposes one achievable next task. Change your constraints and compare the revised plan with the previous one.

Built for **Best Apps and Agents**, Nebius × NVIDIA Global AI Hackathon. Inference runs on **Nebius Token Factory** using **NVIDIA Nemotron 3 Super**. The application is a single Next.js/TypeScript project ready for Vercel.

**[Open the hosted demo](https://unfinished-chi.vercel.app/).** The authored example is public. Live inference needs the private testing code supplied to judges and shares a $2 lifetime reserved AI allocation; no access code or provider key is published in this repository.

![Unfinished project overview](docs/images/overview.jpg)

## Run locally

Requires Node.js 22 or later.

```sh
npm ci
npm run setup
```

Add your key to `.env.local`:

```dotenv
NEBIUS_API_KEY=your_key
```

Setup generates `STATE_SIGNING_SECRET` and preserves existing configuration. Keep `.env.local` private. Then:

```sh
npm run dev
```

Open [localhost:3000](http://127.0.0.1:3000). The first view is a clearly labelled **authored example**. **Reconstruct project** starts live model inference. Example and live sessions are stored separately in IndexedDB in the same browser.

## What to try

1. Open Sunday Store, a fictional bakery ordering project. Open the interactive 3D folder and explore **The idea**, **The clues**, and **The next step**. The chapter buttons open accepted source excerpts or the restart plan.
2. Inspect the checkout contradiction: README completion claim versus an explicit implementation stub.
3. Open a citation and inspect the actual source lines.
4. Find the basket implementation behind an unchecked TODO.
5. Select **Collection only** and inspect the changed tasks and reasons.
6. Open **Details** to distinguish sample data from measured live inference.
7. Inspect the independent PyPA snapshot under the second project.

The authored example supports the two suggested constraints only. Live mode accepts free-text constraints. Project uploads are outside the MVP.

## Interactive experience

The hero folder is built from procedural Three.js geometry and locally drawn textures. Drag to rotate it, open it to separate the three chapter cards, and select a chapter to follow its evidence. This is an illustrative interaction, not live analysis or a dependency graph; exploring it makes no model calls. Its badge identifies authored example or live results.

The introduction contains one main action and the interactive folder. The workspace has separate **Overview**, **Evidence**, **Next step**, **Files**, and **Details** views. The overview stays brief; evidence sources, plan explanations, and revision history expand on request. View links survive a refresh through URL fragments.

GSAP handles chapter transitions, scroll reveals, subtle parallax, and button feedback. Evidence cards respond to the pointer. Replanning reveals the updated task; its structured changes are available under **Changes & constraints**.

Ambient rendering pauses when the scene is outside the viewport or the page is hidden. The scene has a pause control, honors reduced motion, and keeps its chapter navigation usable with a CSS illustration when WebGL is unavailable. Source browsing and planning work without the 3D renderer.

Run browser checks against a separate local preview by setting `PLAYWRIGHT_BASE_URL` (for example, `http://127.0.0.1:3001`) before `npm run test:e2e`.

## How it works

- **Extract:** Nemotron proposes records and supporting line spans from individual line-numbered files, at most three requests concurrently. Code copies the canonical excerpt from those spans.
- **Check source excerpts:** deterministic code rejects unsupported extraction records before reconciliation.
- **Check literal source signals:** code spots named-module completion claims beside explicit stubs, unchecked tasks naming existing functions, and Python file references absent from the inspected set. These are qualified source observations, not proofs of working behaviour.
- **Reconcile:** a synthesis call and an independent source-review call merge records by feature and decision, selecting accepted evidence IDs. Code attaches their canonical citations and preserves conflicting claims.
- **Check again:** final citations must exist in the inspected snapshot and come from accepted records.
- **Plan:** generate an initial restart task, then apply new constraints while retaining task IDs and showing the diff.

The model returns schema-constrained JSON, which is validated with Zod. Invalid output receives at most one repair attempt. Inference uses one model, `nvidia/nemotron-3-super-120b-a12b`: extraction disables thinking; reconciliation and planning use low-effort reasoning. Sampling follows NVIDIA's recommendation of temperature 1.0 and top-p 0.95. See [NVIDIA's model instructions](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-BF16) and [Nebius's model cookbook](https://github.com/nebius/token-factory-cookbook/blob/main/models/nemotron/nemotron3-super-120B.md).

## Trust boundaries

- Findings distinguish explicit statements from supported inferences.
- States include documented claims, implementation found, conflicting evidence, open decisions, unverifiable sources, and absence within inspected files.
- Code presence and test definitions do **not** prove working behaviour. Project code and tests are never executed by the application.
- Citation checking validates source text and locations, **not the semantic truth of a conclusion**.
- Unverifiable findings cannot support restart tasks. Unsupported evidence is rejected, never automatically relabelled as an inference.
- A missing referenced file is reported from the existing note that names it. The application never fabricates a quote from that missing file.
- Plans describe proposed work. Replanning does not modify source files or perform live dependency tracking.
- Authored example results never serve as an automatic fallback for failed live calls.
- Source checking and model interpretation work together. The mechanical source checks use literal identifiers and clear status patterns; they can miss implicit relationships or flag a legitimate optional stub for review.

## Deploy on Vercel

The hosted demo protects paid calls with a private live-access code and a persistent **$2 lifetime reserved AI allocation**. The authored example stays public. Follow [live protection setup](docs/LIVE_PROTECTION.md), including the dedicated private Blob ledger, before enabling hosted inference. Missing protection fails closed. This app-level allocation does not cap unrelated usage on your Nebius account.

1. Put this application in your own Git repository and import it into Vercel. Use the **Next.js** framework preset and Node.js 24.
2. Add `NEBIUS_API_KEY` and a fresh `STATE_SIGNING_SECRET` of at least 32 characters to the Vercel environment. Generate a secret locally with:

   ```sh
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

3. Optional overrides: `NEBIUS_BASE_URL`, `MODEL_ID`. Defaults are documented in `.env.example`.
4. Deploy with `npm run build`. No database, Python server, Docker image, or persistent server filesystem is required.
5. Smoke-test the example, live reconstruction, source viewer, and replanning on the deployed URL.

API routes use Node.js Functions with `maxDuration = 300`. Each stage is a separate request. Model attempts have a 70-second timeout, or 40 seconds for the source-review pass, with at most two attempts per call. The reconciliation request is bounded to 220 seconds of upstream waiting. Stage inputs are bounded to 180,000 UTF-8 bytes. No function keeps processing after its response. Project files are explicitly included in Next.js output tracing. See [Vercel's function limits](https://vercel.com/docs/functions/limitations).

The Nebius key and signing secret are server-only. Checkpoints are signed and bound to source hashes. Rotating the secret or changing a source snapshot invalidates prior checkpoints; start a fresh reconstruction when that happens.

## Validation

```sh
npm run typecheck
npm test
npm run test:e2e
npm run build
npm run evaluate -- demo-shop
npm run evaluate -- sampleproject
npm run evaluate -- demo-shop --variant --fresh
```

Browser tests use installed Google Chrome (`channel: 'chrome'`). Install Chrome, or change the Playwright channel to a browser available on your CI runner. Live evaluation requires the configured key and makes billed provider calls. It saves raw findings, plans, usage, and citation-check outcomes under `eval/results/`; it reuses signed extraction checkpoints when their source hashes still match.

GitHub Actions runs installation, type checking, unit tests, and a production build on Node.js 24. Those checks need no provider credentials and make no live model calls. Browser scenarios and billed live evaluations remain separate.

The fixture answer key is **outside the inspected project** in `eval/expected.json`. Evaluation requires reviewing expected concepts against the findings; matching a source filename alone is not scored as semantic recall. The variant changes the README completion claim and replaces the subtotal implementation with a stub, without changing the prepared project on disk. The independent public snapshot has no labelled ground truth, so no recall is claimed. Measured results and limitations are documented in [eval/REPORT.md](eval/REPORT.md).

## Project structure

- `src/app`: Next.js interface and Node.js API routes.
- `src/lib/server`: source ingestion, verification, signed checkpoints, model calls, and pipeline.
- `src/components`: evidence cards, source dialog, and restart-plan interface.
- `projects`: fictional fixture and pinned public snapshot.
- `tests`, `e2e`, `eval`: verification tests, browser scenarios, and evaluation.

See [architecture](docs/ARCHITECTURE.md) and the [demo script](docs/DEMO.md).

## Limits and next steps

Inputs are `.py`, `.md`, and `.txt`; at most 32 supported files, 64 KiB per file, and 256 KiB total. Skipped files and extraction warnings remain visible. Symlinks are excluded. An exact unique excerpt can be re-anchored; ambiguous or fabricated excerpts are rejected. The model can still miss a relationship or misinterpret genuine evidence. A small prepared fixture is a sanity check, not a generalisation benchmark.

Browser history is local to one browser and origin. There is no sign-in, cloud history, general repository ingestion, Git history, external dependency research, code execution, or automatic source modification.

## License and attribution

Unfinished is [Apache-2.0 licensed](LICENSE). The retained PyPA sampleproject snapshot has its own MIT license in `projects/sampleproject/LICENSE.txt`, with its source commit in `snapshot.json`. Typography is distributed through the Fontsource packages under their included font licenses. Nemotron model use is subject to NVIDIA's model terms.
