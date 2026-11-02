Tools used: Claude Code

Prompted claude code to create the project with Vite, React, TypeScript, MUI and also Vitest, to speed up the process.

Told claude code that the claude.md has been updated with the new rules

Claude code asked if we should remove the two libraries `@testing-library/user-event` and `@mui/icons-material`. I decided we can keep them for now until we reach the testing phase. And we keep `@mui/icons-material` for the back arrow button and the show/hide password icon.

Prompted claude code to read the `BRIEF.md` and the `PLAN.md` files and list the gaps that I could have missed, with an `extra high` effort.

# Improvements:

- stricter password and email formats
- checkbox goes to payload with timestamp, did basic validation by just making sure it is checked to speed up the process.
- Decided the progress counter should count the whole flow. My opinion is that the user only cares about how much steps are left to finish.
