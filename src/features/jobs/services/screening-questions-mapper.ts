import { YES_NO_OPTION_IDS } from '../constants';
import type { ScreeningQuestion } from '../types/job-steps.types';
import type { JobQuestionApiItem } from '../types/jobs.types';

type ScreeningQuestionType = ScreeningQuestion['type'];
export type YesNoLabels = Record<'yes' | 'no', string>;

const TYPE_TO_API: Record<ScreeningQuestionType, string> = {
  single: 'single_choice',
  multi: 'multi_choice',
  'yes-no': 'yes_no',
};

const API_TO_TYPE: Record<string, ScreeningQuestionType> = {
  single_choice: 'single',
  multi_choice: 'multi',
  yes_no: 'yes-no',
};

function isYesNoAnswer(value: string): value is keyof YesNoLabels {
  return YES_NO_OPTION_IDS.includes(value);
}

// Step two body: picked templates + custom questions. Leaving both out
// clears every question on the job (the backend replaces the whole list).
export function appendScreeningQuestions(
  formData: FormData,
  questions: ScreeningQuestion[],
) {
  const templates = questions.filter(
    (question) => question.source === 'template' && question.templateId,
  );
  const custom = questions.filter((question) => !templates.includes(question));

  templates.forEach((question, index) => {
    const key = `question_templates[${index}]`;
    formData.append(`${key}[id]`, String(question.templateId));
    formData.append(
      `${key}[correct_answer]`,
      question.correctOptionIds[0] ?? 'yes',
    );
    // Pending backend support: the template is saved as required for now.
    formData.append(`${key}[is_required]`, question.required ? '1' : '0');
    formData.append(`${key}[mark]`, String(question.mark));
  });

  custom.forEach((question, index) => {
    const key = `custom_questions[${index}]`;
    formData.append(`${key}[question]`, question.question);
    formData.append(`${key}[is_required]`, question.required ? '1' : '0');
    formData.append(`${key}[type]`, TYPE_TO_API[question.type]);
    // Pending backend support.
    formData.append(`${key}[mark]`, String(question.mark));
    const options =
      question.type === 'yes-no'
        ? YES_NO_OPTION_IDS.map((id) => ({ id, text: id }))
        : question.options;
    options.forEach((option, optionIndex) => {
      const answerKey = `${key}[answer][${optionIndex}]`;
      formData.append(`${answerKey}[answer]`, option.text);
      formData.append(
        `${answerKey}[is_correct]`,
        question.correctOptionIds.includes(option.id) ? '1' : '0',
      );
    });
  });
}

// API question → form question. Yes/no answers keep the `yes` / `no` ids the
// form uses; other options keep the answer id from the API.
export function mapJobQuestions(
  items: JobQuestionApiItem[],
  yesNoLabels: YesNoLabels,
): ScreeningQuestion[] {
  return items.map((item) => {
    const type = API_TO_TYPE[item.type] ?? 'single';
    const answers = item.answers ?? [];
    const options =
      type === 'yes-no'
        ? YES_NO_OPTION_IDS.map((id) => ({
            id,
            text: isYesNoAnswer(id) ? yesNoLabels[id] : id,
          }))
        : answers.map((answer) => ({
            id: String(answer.id),
            text: answer.answer,
          }));
    const correctOptionIds = answers
      .filter((answer) => answer.is_correct)
      .map((answer) =>
        type === 'yes-no' ? answer.answer.toLowerCase() : String(answer.id),
      );

    return {
      id: String(item.id),
      source: item.template_id ? 'template' : 'custom',
      templateId: item.template_id ? String(item.template_id) : undefined,
      type,
      question: item.question,
      mark: item.mark ?? 1,
      options,
      correctOptionIds,
      required: item.is_required,
    };
  });
}
