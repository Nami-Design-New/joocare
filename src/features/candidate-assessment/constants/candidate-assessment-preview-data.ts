import type {
  CandidateAssessment,
  CandidateAssessmentState,
} from '../types/candidate-assessment.types';
import { getAssessmentLinkExpiry } from '../utils/assessment-format';

// Design preview data until the candidate assessment API is ready (mock data, not translated).
const PREVIEW_ASSESSMENT: Omit<
  CandidateAssessment,
  'id' | 'state' | 'sentAt' | 'expiresAt'
> = {
  title: 'Clinical Knowledge Assessment',
  sentBy: 'King Fahd Medical City',
  hiringTeamEmail: 'careers@kfmc.med.sa',
  scope:
    'This assessment evaluates your clinical knowledge in acute care, patient safety and evidence-based nursing practice used in our ICU and emergency services. Ensure you are in a quiet environment before starting.',
  timeLimitMinutes: 45,
  maxAttempts: 1,
  passScore: 70,
  questions: [
    {
      id: 'q-1',
      text: 'Which clinical metric is most critical when verifying automated triage algorithms for acute chest pain?',
      options: [
        {
          id: 'a',
          text: 'Sensitivity to acute myocardial infarction (ST-elevation ECG indicators)',
        },
        {
          id: 'b',
          text: 'Algorithmic computation speed in mobile network handshakes',
        },
        {
          id: 'c',
          text: 'Database retention schedules of non-critical telemetry logs',
        },
        {
          id: 'd',
          text: 'API integration formats with local pharmaceutical vendor portals',
        },
      ],
    },
    {
      id: 'q-2',
      text: 'What is the first nursing action for a patient with suspected sepsis and low blood pressure?',
      options: [
        {
          id: 'a',
          text: 'Start IV fluid resuscitation as ordered and obtain blood cultures',
        },
        { id: 'b', text: 'Wait for the next scheduled vital signs check' },
        { id: 'c', text: 'Give oral fluids and reassess in four hours' },
        { id: 'd', text: 'Transfer the patient to a general ward' },
      ],
    },
    {
      id: 'q-3',
      text: 'Which finding best confirms correct placement of a nasogastric tube before feeding?',
      options: [
        { id: 'a', text: 'Chest X-ray confirmation of the tube position' },
        { id: 'b', text: 'The patient does not cough during insertion' },
        { id: 'c', text: 'Air is heard over the abdomen only' },
        { id: 'd', text: 'The tube is taped securely to the nose' },
      ],
    },
    {
      id: 'q-4',
      text: 'A patient on heparin infusion has an aPTT far above the target range. What should the nurse do first?',
      options: [
        {
          id: 'a',
          text: 'Hold or adjust the infusion per protocol and notify the physician',
        },
        { id: 'b', text: 'Double the infusion rate' },
        { id: 'c', text: 'Repeat the test in 24 hours' },
        { id: 'd', text: 'Give the next scheduled oral dose' },
      ],
    },
    {
      id: 'q-5',
      text: 'What is the primary diagnostic indicator of chronic heart failure in a routine echocardiogram?',
      options: [
        { id: 'a', text: 'Reduced left ventricular ejection fraction (LVEF)' },
        {
          id: 'b',
          text: 'Slightly elevated systemic blood pressure during exercise tests',
        },
        {
          id: 'c',
          text: 'Minor localized variations in thoracic nerve conduction velocities',
        },
        {
          id: 'd',
          text: 'Elevated blood glucose levels following high-carb nutrition blocks',
        },
      ],
    },
  ],
};

const PREVIEW_SUBMISSION = {
  submittedAt: '2026-09-21T14:40:00',
  durationSeconds: 22 * 60 + 14,
};

const PREVIEW_EXPIRED_SENT_AT = new Date('2026-09-20T10:15:00');
const PREVIEW_SENT_HOURS_AGO = 2;

export function getCandidateAssessmentPreview(
  id: string,
  state: CandidateAssessmentState,
): CandidateAssessment {
  // An open link was emailed a little while ago; an expired one is past its 72 hours.
  const sentAt =
    state === 'expired'
      ? PREVIEW_EXPIRED_SENT_AT
      : new Date(Date.now() - PREVIEW_SENT_HOURS_AGO * 60 * 60 * 1000);

  return {
    ...PREVIEW_ASSESSMENT,
    id,
    state,
    sentAt: sentAt.toISOString(),
    expiresAt: getAssessmentLinkExpiry(sentAt).toISOString(),
    submission: state === 'taken' ? PREVIEW_SUBMISSION : undefined,
  };
}
