# Stack:

React + typescript + vite, MUI(to save time when adding dropdowns, select, checkboxes, password field etc..), vitest

# Steps:

For the content inside the steps, it should be data, so that if we ever need to add a new step, or a new question, it would be easily extendable, preferably by just touching one file.

# Validation:

For simplicity, I don't think we should add a new library for validation, we can handle it without any libraries because this is a short task.

# Gaps:

When refreshing the page, will all of the user's data be lost?

State management: this was not mentioned in the task, but this should be considered as a gap, because if the user decides to go back, they should be able to see the latest state of the fields. For our case, we can use react's own state management abilities (`useReducer` or `useState`) we don't need to use a new library, because the project is not complex and it will only be developed for this task's sake.

Password security: passing the password in the payload of the onboarding API is risky because it can get leaked during the onboarding phase. The readme file does say that we should only use one API, so making a seperate API for the account creation is out of the question, so I think for this task, keeping the password in React's state is enough.

These are the gaps that I thought of after I read the `BRIEF.md` file task. If we spot other gaps, we can think on the decisions on how we should handle these gaps.