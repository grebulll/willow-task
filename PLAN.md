# Stack:

React + typescript + vite, MUI(to save time when adding dropdowns, select, checkboxes, password field etc..), vitest, react-router (browser back button and URLs)

# Steps:

For the content inside the steps, it should be data, so that if we ever need to add a new step, or a new question, it would be easily extendable, preferably by just touching one file.

# Validation:

For simplicity, I don't think we should add a new library for validation, we can handle it without any libraries because this is a short task.

# Gaps:

When refreshing the page, will all of the user's data be lost?

State management: this was not mentioned in the task, but this should be considered as a gap, because if the user decides to go back, they should be able to see the latest state of the fields. For our case, we can use react's own state management abilities (`useReducer` or `useState`) we don't need to use a new library, because the project is not complex and it will only be developed for this task's sake.

Password security: passing the password in the payload of the onboarding API is risky because it can get leaked during the onboarding phase. The readme file does say that we should only use one API, so making a seperate API for the account creation is out of the question. For our case we do send the password in the onboarding payload, but we keep it secure: it only travels in the POST body over HTTPS (hashed on the server, not in the browser), it is kept in React's state in memory only and never saved to `sessionStorage`, it is never logged, and it is cleared after a successful submit.

These are the gaps that I thought of after I read the `BRIEF.md` file task. If we spot other gaps, we can think on the decisions on how we should handle these gaps.

# Decisions

## Account screen

- Errors show on submit (common approach).
- Names are trimmed; blank or whitespace-only names are rejected.
- Consent checkbox must be checked to continue, but it is not sent in the payload (kept simple for the timebox).

## Navigation & progress

- Add a router so the browser back button and URLs work. Visiting a step whose earlier steps aren't answered redirects to the first unanswered step.
- Progress counter counts the whole flow: the 6 question screens show 1/6 … 6/6. The account screen, the welcome screens and the final screen have no counter.
- Back on A1 goes to Welcome A. The user can still return to the account form (browser back), with their values kept.
- No back arrow on the two welcome screens or the final screen.
- After a successful submit the flow is locked: earlier steps redirect to the final screen.

## Option cards (A1–A3)

- Picking a card advances. When coming back, the previous pick is shown as selected, and clicking it again advances.
- Guard against a double-click skipping a screen.
- Cards are keyboard accessible and announced as a choice to screen readers.

## Answers & data

- Answers are stored as fixed IDs, not label text.
- Income ranges fixed. The brief's options leave gaps and overlap, so they are changed to: "Under $200,000", "$200,000 - $500,000", "$500,001 - $1,000,000", "Over $1,000,000".
  - "$201,000" left $200,000 - $200,999 uncovered.
  - "$501,000" left $500,001 - $500,999 uncovered.
  - $1,000,000 was in both "$501,000 - $1,000,000" and "$1,000,000+".
  - Only the labels change; the stored IDs stay the same. In a real team this would be confirmed with product/compliance, since the ranges may follow a regulation; the brief asks us to decide, so we decided.
- B1 Citizenship: at least one country is required; rows can be removed; countries already chosen can't be picked in another row; empty rows block Continue; maximum 3 countries (covers dual and triple citizenship, keeps the UI short).
- B2 Tax residence: choosing a country other than the US goes to a "not eligible" screen instead of continuing.
- "What is a qualified purchaser?" is an MUI Tooltip shown on hover (and keyboard focus).

## Submission

- While submitting: show a spinner and disable both path cards so it can't be submitted twice.
- Success: show a success message.
- Failure: show an error with a Retry button; all answers are kept.

## Persistence

- Progress is saved to `sessionStorage` so a refresh doesn't lose it. The password is never saved there.
- The account step counts as done once `account` is set in the draft.

## Password

- The password is sent in the `POST /api/onboarding` body (no separate API). It is never put in the URL.
- HTTPS protects it in transit; the server hashes it (bcrypt/argon2). No hashing in the browser: the hash would just become the password.
- It is kept in memory only (React state in the provider), never in the draft, so the type stops it from reaching `sessionStorage`.
- It is never logged; the mock API masks it as `***`.
- It is cleared from memory after a successful submit.
- The field uses `autocomplete="new-password"`.
- After a refresh the password is gone. The final screen then shows a "Re-enter your password to finish" field above the path cards, instead of sending the user back to the account form.

## Data model

- Every fixed choice is a string-literal union derived from an `as const` array (`src/onboarding/types.ts`, `src/onboarding/countries.ts`).
- `OnboardingDraft`: every field optional, saved while the user moves through the flow.
- `OnboardingPayload`: the draft with every field required, plus `account.password` and `investmentPath`.
- `toPayload(draft, password, investmentPath)` returns `null` if anything is missing, citizenships is empty or the password is empty.
- The "not eligible" rule for tax residence is checked when leaving B2, not in the payload type. `ELIGIBLE_TAX_RESIDENCES` lists the allowed countries.
- Adding a new answer touches 3 files (`types.ts`, `steps.ts`, `payload.ts`); the compiler catches a missed `payload.ts`. With more time, `toPayload` would loop over the question steps instead of listing fields by hand, bringing it down to 2 files.
- `storage.ts` trusts the saved shape (plain `JSON.parse` + try/catch). It started as a field-by-field check of every saved value, but that was ~60 lines that had to be updated for every new answer; cut for the timebox. Trade-off: data edited by hand in sessionStorage isn't rejected. Only `saveState` writes it, so normal use is safe.

## Defaults (not discussed, smallest sensible choice)

- Password: at least 8 characters.
- Email: simple `something@something.something` check.
- Payload: account fields with the password, all answers as IDs, and the chosen path.
- Failure trigger: the mock endpoint fails when the email contains `fail` (e.g. `fail@test.com`), so reviewers can see both outcomes.

## Cut for the timebox

- Contradicting answers (e.g. low net worth + qualified purchaser "Yes") are allowed.
- No conflict-of-interest questions, and no employer/occupation follow-up after "Employed".
- No consent record in the payload.
- At ~1h45 into the 2 hours, the core (data model, state, steps, routing) was done but no real screens. Remaining screens are built as plainly as possible, with these cuts:
  - No responsive polish beyond MUI defaults.
  - No double-click guard on the option cards.
  - No "Re-enter your password" field: after a refresh the password is gone, so the user is sent back to the account form to type it again.
  - Few UI tests: the logic (navigation, payload, state) is unit tested; screens get at most one test each.
