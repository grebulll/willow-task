# Frontend Challenge — Investor Onboarding Flow

Hey! Thanks for taking the time to do this challenge — we know take-homes are a real ask, so we've kept this one honest: two hours, tops, and everything you need is in this repo.

## The short version

You'll build a small onboarding flow (the same one our real users go through, slightly simplified). Use whatever AI tools you like — seriously. We use Claude, Cursor and friends every day, and we'd rather see how you work *with* them than pretend it's 2019. The catch: you'll document your process, and in the next round you'll walk us through the code and extend it live. So use AI as much as you want, but make sure the code is *yours* — you should be able to explain and defend every line.

And about that timebox: two hours means two hours. A solution with rough edges and a clear "here's what I'd do next" beats a polished one that obviously took a weekend. Running out of time and cutting scope deliberately isn't failure — it's the job. Just tell us what you cut and why.

## The task

Build the WillowWealth investor onboarding flow: a new user creates an account, answers a short series of investor-profile and regulatory questions, and lands on a final screen ready to invest.

We'd prefer you use React + TypeScript — that's our stack. Other libraries and tooling are entirely up to you.

**There are no visual designs — on purpose.** The mockups below define structure and content, nothing more. The visual design is yours: whether you use a UI library or write your own styles, whether the pages are responsive (and how) — those are your calls to make, and your reasoning is part of what we read.

### The flow

```
[0] Create your account
     |
     v
(A) Interstitial: "Welcome to Willow Wealth, <FirstName>"
     |
     v
[A1] Household income --> [A2] Net worth --> [A3] Qualified purchaser
     |
     v
(B) Interstitial: "A few more questions to complete your account set-up"
     |
     v
[B1] Citizenship --> [B2] Tax residence --> [B3] Employment
     |
     v
[✓] "You're ready to invest" ----> POST /api/onboarding
```

One question per screen, grouped into two sections, each opened by an interstitial. Question screens share a common layout shell: a top nav with the brand wordmark, a back arrow, and a step progress indicator.

### Screen 0 — Create your account

```
+--------------------------------------------------------+
|                      WillowWealth                       |
|                                                         |
|                  Create your account                    |
|        Start building a portfolio tailored to           |
|                   your objectives.                      |
|                                                         |
|   [ First name                                      ]   |
|   [ Last name                                       ]   |
|   [ Email address                                   ]   |
|   [ Password                                   (o)  ]   |
|                                                         |
|   [ ] I have read and accepted the Privacy Policy,      |
|       Electronic Disclosure and Consent and Terms of    |
|       Service and I consent to the use of electronic    |
|       records in connection with this application.      |
|                                                         |
|   [==================  Continue  ===================]   |
|                                                         |
|           Already have an account?  Log in              |
+--------------------------------------------------------+
```

All fields required; the password field has a show/hide toggle `(o)`. "Log in" can be a dead link.

### Interstitial A — Welcome

```
+--------------------------------------------------------+
| WillowWealth                                            |
+--------------------------------------------------------+
|                                                         |
|  +--------------+                                       |
|  |              |    Welcome to Willow Wealth,          |
|  | illustration |    <FirstName>                        |
|  |              |                                       |
|  |              |    Let's begin setting up your        |
|  |              |    individual account. Next, we'll    |
|  |              |    ask a few quick questions to       |
|  |              |    better understand your investor    |
|  |              |    profile.                           |
|  |              |                                       |
|  |              |    [ Continue ]                       |
|  +--------------+                                       |
+--------------------------------------------------------+
```

`<FirstName>` is the first name entered on Screen 0. The illustration can be any placeholder.

### Screen A1 — Household income

```
+--------------------------------------------------------+
| WillowWealth                                            |
+--------------------------------------------------------+
|   <                                              x / x  |
|                                                         |
|         What is your annual household income?           |
|     Please include all sources of income, such as       |
|     salary, bonuses, rental properties and              |
|     investments. If you have a spouse or spousal        |
|     equivalent, please choose your joint income level.  |
|                                                         |
|        +----------------------------------------+       |
|        |  Under $200,000                        |       |
|        +----------------------------------------+       |
|        |  $201,000 - $500,000                   |       |
|        +----------------------------------------+       |
|        |  $501,000 - $1,000,000                 |       |
|        +----------------------------------------+       |
|        |  $1,000,000+                           |       |
|        +----------------------------------------+       |
+--------------------------------------------------------+
```

Option-card screens (A1–A3) have no Continue button — picking a card advances to the next screen. `<` is back, `x / x` is the step progress indicator.

### Screen A2 — Net worth

```
+--------------------------------------------------------+
| WillowWealth                                            |
+--------------------------------------------------------+
|   <                                              x / x  |
|                                                         |
|                 What is your net worth?                  |
|     Please include all your assets, minus your          |
|     primary residence and liabilities. If you have      |
|     a spouse or spousal equivalent, please choose       |
|     your joint net worth.                               |
|                                                         |
|        +----------------------------------------+       |
|        |  $0 - $500,000                         |       |
|        +----------------------------------------+       |
|        |  $500,001 - $1,000,000                 |       |
|        +----------------------------------------+       |
|        |  $1,000,001 - $5,000,000               |       |
|        +----------------------------------------+       |
|        |  $5,000,001+                           |       |
|        +----------------------------------------+       |
+--------------------------------------------------------+
```

### Screen A3 — Qualified purchaser

```
+--------------------------------------------------------+
| WillowWealth                                            |
+--------------------------------------------------------+
|   <                                              x / x  |
|                                                         |
|            Are you a qualified purchaser?               |
|     Individual qualified purchasers own $5,000,000      |
|     in investments, but you are not required to be      |
|     one to invest on Willow Wealth.                     |
|                                                         |
|        +----------------------------------------+       |
|        |  Yes                                   |       |
|        |  I meet the qualified purchaser        |       |
|        |  requirements                          |       |
|        +----------------------------------------+       |
|        |  No                                    |       |
|        |  I do not meet the qualified purchaser |       |
|        |  requirements                          |       |
|        +----------------------------------------+       |
|                                                         |
|        (?) What is a qualified purchaser?               |
+--------------------------------------------------------+
```

`(?)` hints at the SEC definition — how (or whether) you surface it is up to you.

### Interstitial B — A few more questions

```
+--------------------------------------------------------+
| WillowWealth                                            |
+--------------------------------------------------------+
|                                                         |
|  +--------------+                                       |
|  |              |    A few more questions to            |
|  | illustration |    complete your account set-up       |
|  |              |                                       |
|  |              |    As the last step in identity       |
|  |              |    verification, FINRA, our           |
|  |              |    regulator, requires us to ask      |
|  |              |    about citizenship, employment      |
|  |              |    and potential conflicts of         |
|  |              |    interest.                          |
|  |              |                                       |
|  |              |    [ Continue ]                       |
|  +--------------+                                       |
+--------------------------------------------------------+
```

### Screen B1 — Citizenship

```
+--------------------------------------------------------+
| WillowWealth                                            |
+--------------------------------------------------------+
|   <                                              x / x  |
|                                                         |
|          What countries are you a citizen of?           |
|     We are required to collect this information for     |
|     regulatory purposes and determine your account      |
|     eligibility.                                        |
|                                                         |
|        [ Country of citizenship             v ]         |
|                                                         |
|                  Add another country                    |
|                                                         |
|        [_______________ Continue ______________]        |
+--------------------------------------------------------+
```

Any static country list is fine. Dropdown screens (B1–B3) advance via the Continue button.

### Screen B2 — Tax residence

```
+--------------------------------------------------------+
| WillowWealth                                            |
+--------------------------------------------------------+
|   <                                              x / x  |
|                                                         |
|               What is your tax residence?               |
|     Willow Wealth's investments are currently only      |
|     available for U.S. taxpayers. Please confirm        |
|     your tax residence is correct.                      |
|                                                         |
|        [ Country of tax residence           v ]         |
|                                                         |
|        [_______________ Continue ______________]        |
+--------------------------------------------------------+
```

### Screen B3 — Employment

```
+--------------------------------------------------------+
| WillowWealth                                            |
+--------------------------------------------------------+
|   <                                              x / x  |
|                                                         |
|             What's your employment status?              |
|     We're required to ask for this information for      |
|     regulatory purposes.                                |
|                                                         |
|        [ Employment status                  v ]         |
|                                                         |
|        [_______________ Continue ______________]        |
+--------------------------------------------------------+
```

Pick sensible status options (e.g. Employed / Self-employed / Retired / Student / Not employed).

### Final screen — You're ready to invest

```
+--------------------------------------------------------+
| WillowWealth                                            |
+--------------------------------------------------------+
|                                                         |
|  +--------------+   (v)  You're ready to invest         |
|  |              |        on Willow Wealth               |
|  | illustration |                                       |
|  |              |   Choose the path that's best for     |
|  |              |   you below, whether you prefer to    |
|  |              |   hand-pick your investment           |
|  |              |   portfolio or let Willow Wealth      |
|  |              |   do the work for you.                |
|  |              |                                       |
|  |              |   +-----------------------------+     |
|  |              |   | Select your own investments |     |
|  |              |   | Explore a wide range of     |     |
|  |              |   | curated private markets     |     |
|  |              |   | investments spanning real   |     |
|  |              |   | estate, private credit,     |     |
|  |              |   | private equity, and more.   |     |
|  |              |   +-----------------------------+     |
|  |              |   | Set up a Managed Portfolio  |     |
|  |              |   | Select a strategy, and      |     |
|  |              |   | we'll assemble a portfolio  |     |
|  |              |   | of diversified funds from   |     |
|  |              |   | prominent asset managers.   |     |
|  |              |   +-----------------------------+     |
|  +--------------+                                       |
+--------------------------------------------------------+
```

Clicking either path card submits the full onboarding payload as JSON to a fake endpoint (`POST /api/onboarding` — mock it however you like: MSW, a stub handler, a promise with a delay). Handle both success and failure visibly.

### A note on the spec

That's the whole brief — and yes, it has gaps, just like real tickets do. Deciding what matters, making a sensible product call, and writing down your reasoning is part of the exercise. Don't wait to ask — decide, and tell us why.

## What to hand in

A GitHub or GitLab repo you create — please don't fork this one; start fresh so the history is your own. It should contain:

**1. The app.** Runs with one command after install (`pnpm dev`, `npm run dev`, whatever you use).

**2. A `README.md`.** How to run it, the decisions and trade-offs you made, and what you'd do with more time.

**3. An `AI_WORKFLOW.md` — this one matters, read carefully.** It's where you show us how you actually work with AI:

- Which tools you used (Claude Code, Cursor, Codex, Copilot, ChatGPT, …) and for what.
- Your working documents — commit any spec, plan, prompt file, or rules/context file you gave your AI (`PLAN.md`, `SPEC.md`, `CLAUDE.md`, `.cursorrules`, a pasted brief…). If you work conversationally without docs, summarize the key prompts you gave and in what order.
- The decisions: what the AI proposed that you kept, what you rejected or reworked, and why.
- At least one concrete moment where the AI got something wrong or suboptimal — how you noticed, what you did. (If everything it produced was perfect, we'll assume you didn't check.)
- A rough sense of what was AI-generated vs. hand-written or hand-edited.

**4. A real commit history.** Commit as you go — the history should tell the story of how the thing came together, not one giant "final" commit.

When you're done, send us the repo link. Make sure we can actually open it — public, or invite the person who sent you this challenge.

## How we'll evaluate it

Roughly in this order:

1. **Does it work?** Installs, runs, and holds up when we poke at it — not just the happy path.
2. **Do you own the code?** Next round, you'll walk us through your solution and extend it live (AI tools welcome there too). Expect questions about any line in the repo — "the AI wrote that part" isn't an answer we can hire on.
3. **Your AI process.** Clear instructions, evidence you verified the output, sensible accept/reject calls. A thoughtful `AI_WORKFLOW.md` counts for a lot.
4. **Code quality and structure.** Sensible component boundaries, a typed data model for the answers, consistent style. Nobody's expecting a design system.
5. **Judgment.** The gaps in the brief are the test: the calls you made, your reasoning, and whether you thought through the implications of each choice. What you cut to stay inside the timebox — and why — counts here too.

Good luck — we're looking forward to seeing how you work. 🌱
