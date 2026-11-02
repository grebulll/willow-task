import type { AccountDetails, OnboardingDraft } from './types';

export type OnboardingState = {
  draft: OnboardingDraft;
  // Set after a successful submit; locks the flow.
  submitted: boolean;
};

export type AnswerUpdate = Partial<Omit<OnboardingDraft, 'account'>>;

export function answerUpdate<F extends keyof AnswerUpdate>(
  field: F,
  value: NonNullable<AnswerUpdate[F]>,
): AnswerUpdate {
  return { [field]: value } as AnswerUpdate;
}

export type OnboardingAction =
  | { type: 'setAccount'; account: AccountDetails }
  | { type: 'setAnswers'; answers: AnswerUpdate }
  | { type: 'markSubmitted' };

export const initialState: OnboardingState = { draft: {}, submitted: false };

export function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction,
): OnboardingState {
  switch (action.type) {
    case 'setAccount':
      return { ...state, draft: { ...state.draft, account: action.account } };
    case 'setAnswers':
      return { ...state, draft: { ...state.draft, ...action.answers } };
    case 'markSubmitted':
      return { ...state, submitted: true };
  }
}
