# WillowWealth investor onboarding

A new user creates an account, answers six investor-profile and regulatory questions in two sections, and lands on a "You're ready to invest" screen that submits everything to a mocked `POST /api/onboarding`.

Built with React, TypeScript, Vite, MUI, React Router, and Vitest + React Testing Library.

## How to run it

Tested with Node 24.

```sh
npm install
npm run dev        # start the app
npm run test:run   # run the tests once (npm test for watch mode)
npm run build      # type-check and build
npm run lint       # lint
```

### Seeing the failure path

**Use an email containing `fail`** (e.g. `fail@test.com`) on the account screen. Submitting on the final screen then fails, showing an error with a Retry button. Any other email succeeds. The mocked API logs the payload to the browser console, with the password masked as `***`.

Also worth trying: refresh mid-flow (answers are kept), pick a tax residence other than the United States (not-eligible screen), or type a later URL such as `/employment` (you're sent to the first unanswered step).

## Time spent

About two hours of focused building, spread over the afternoon with breaks, plus a short cleanup and the docs afterwards.

## Main decisions

The brief leaves gaps on purpose. The full list and my reasoning is in [PLAN.md](PLAN.md); in short:

- **The flow is data.** Every screen's wording, options and order live in `src/onboarding/steps.ts`; routes, progress numbers and the route guard are computed from it.
- **Typed answers.** Every fixed choice is a string-literal union built from an `as const` array, and answers are stored as IDs, not label text. A draft type (all optional) becomes the payload type (all required) through one function, `toPayload`.
- **Routing.** Each step has its own URL, so the browser back button works. A guard stops users skipping ahead and locks the flow after a successful submit.
- **Progress counter** counts the six questions (1/6 … 6/6): I think the user mostly cares about how many steps are left.
- **Password.** The brief allows one API, so the password is sent in the onboarding payload. It's kept in memory only, never saved to `sessionStorage` or logged, and cleared after submit. A refresh loses it, so the user is sent back to the account form to re-enter it.
- **Income ranges.** The brief's options leave $200,000–$200,999 and $500,001–$500,999 uncovered and put $1,000,000 in two options. I fixed the labels; in a real team I'd confirm with product/compliance first.
- **Tax residence.** A non-US answer leads to a "not eligible" screen.
- **No extra libraries** for validation or state: the forms are small, and `useReducer` + context is enough. I tried MSW for the mock API and removed it again; a promise with a delay does the job here with less setup.

### Trade-off

Name, email and the answers are saved in `sessionStorage` until the tab closes, so a refresh doesn't lose progress. In production, drafts would be saved on the server instead.

## What I cut

- No "Re-enter your password" field on the final screen; after a refresh the user is sent back to the account form instead.
- The consent checkbox is validated but not sent in the payload.
- No conflict-of-interest questions (the second welcome screen mentions them), and no employer/occupation follow-up after "Employed".
- Contradicting answers are allowed (e.g. a low net worth with "Yes" to qualified purchaser).
- Saved data isn't validated on load: `storage.ts` trusts the shape it wrote.
- No double-click guard on the option cards, and no responsive polish beyond MUI's defaults.
- Few UI tests: the logic is unit tested; each group of screens gets one or two flow tests.

## What I'd do next

- Stricter password and email rules.
- Send the consent checkbox in the payload with a timestamp, instead of only checking it's ticked.
- **Password:** in production, account creation would be a separate sign-up call, so the password never travels in the onboarding payload.
- **State:** `useReducer` + context is enough now; if the app grows, move to Redux Toolkit.
- Save drafts on the server instead of `sessionStorage`.
- The "Re-enter your password" field on the final screen.
- A real visual design and a check across phone sizes, plus end-to-end tests for the whole flow.

## Working with AI

How I used Claude Code, what I kept and rejected, and where it got things wrong is in [AI_WORKFLOW.md](AI_WORKFLOW.md). The rules I gave it are in [CLAUDE.md](CLAUDE.md).
