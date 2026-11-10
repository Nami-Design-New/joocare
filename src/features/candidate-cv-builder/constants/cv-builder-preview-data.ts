import type { CvBuilderValues } from '../types/cv-builder.types';
import {
  emptyCertificate,
  emptyConference,
  emptyExperience,
  emptyPublication,
  getEmptyCvValues,
} from '../utils/cv-builder-defaults';

// Design-only data until the CV builder API is ready (not translated).

export const SUGGESTED_SUMMARIES = [
  'Dedicated doctor with 8+ years of experience providing exceptional patient care. Expertise in diagnosing and treating a wide range of medical conditions. Committed to delivering compassionate and effective healthcare solutions.',
  'Consultant Internal Medicine Physician with over 12 years of clinical experience in tertiary care hospitals. Skilled in managing complex medical conditions, leading multidisciplinary teams, and delivering patient-centered care.',
  'Patient-focused clinician with strong diagnostic skills and a commitment to evidence-based practice, continuous learning, and improving healthcare quality and patient outcomes.',
];

export const FRESH_GRADUATE_PROFILE = `Ambitious and highly motivated professional at the beginning of my career, eager to contribute to organizational success through continuous learning, adaptability, collaboration, and a strong commitment to quality and professional excellence.

Professional Strengths:
- Demonstrates a strong willingness to learn, develop new skills, and continuously improve performance.
- Adapts effectively to new environments, responsibilities, and organizational requirements.
- Works collaboratively with colleagues and cross-functional teams to achieve shared objectives.
- Takes ownership of assigned tasks and responsibilities with professionalism and accountability.
- Maintains a positive attitude and remains open to feedback, coaching, and professional growth opportunities.
- Committed to delivering high-quality work with accuracy, efficiency, and attention to detail.
- Upholds organizational policies, ethical standards, and professional conduct at all times.
- Respects confidentiality and ensures the appropriate handling of sensitive information.
- Focuses on providing excellent service and creating positive experiences for patients, clients, and stakeholders.
- Contributes to a culture of teamwork, continuous improvement, and organizational excellence.`;

// A finished CV (opened with "Edit CV" / shown by "Show CV").
export const CV_BUILDER_PREVIEW_VALUES: CvBuilderValues = {
  personal: {
    photo: '',
    fullName: 'Ahmed M. Ali',
    nationality: 'Egyptian',
    yearOfBirth: '1986-05-14',
    maritalStatus: 'Married',
    country: 'UAE',
    city: 'Abu Dhabi',
    languages: [
      { language: 'Arabic', proficiency: 'Native' },
      { language: 'English', proficiency: 'Fluent' },
      { language: 'French', proficiency: 'Intermediate' },
    ],
  },
  contact: {
    email: 'ahmed.ali@outlook.com',
    phone: '+971501234567',
    linkedin: 'https://linkedin.com/in/ahmed-ali',
  },
  jobProfile: {
    jobTitle: 'Consultant Internal Medicine',
    yearsOfExperience: '10+ years',
    specialty: 'Internal Medicine',
    subspecialty: 'Endocrinology',
    hasLicense: true,
    availableNow: true,
  },
  summary: { text: SUGGESTED_SUMMARIES[1] },
  educations: [
    {
      degree: 'Master of Internal Medicine',
      university: 'Ain Shams University',
      country: 'Egypt',
      startDate: '2014-07',
      endDate: '2022-07',
      gpa: '3.8',
    },
    {
      degree: 'Bachelor of Medicine and Surgery (MBBS)',
      university: 'Cairo University',
      country: 'Egypt',
      startDate: '2004-09',
      endDate: '2011-07',
      gpa: '3.6',
    },
  ],
  certificates: [
    {
      ...emptyCertificate(),
      name: 'Advanced Cardiac Life Support (ACLS)',
      organization: 'American Heart Association',
      startDate: '2014-07',
      endDate: '2022-07',
    },
    {
      ...emptyCertificate(),
      name: 'Basic Life Support (BLS)',
      organization: 'American Heart Association',
      startDate: '2014-07',
      endDate: '2022-07',
    },
  ],
  experience: {
    freshGraduate: false,
    profile: '',
    items: [
      {
        ...emptyExperience(),
        jobTitle: 'Consultant Internal Medicine',
        organization: 'Cleveland Clinic Abu Dhabi',
        employmentType: 'Full-time',
        startDate: '2021-01',
        currentlyWorking: true,
        responsibilities: [
          {
            value:
              'Lead comprehensive medical care for complex inpatient and outpatient cases',
          },
          { value: 'Supervise and mentor junior medical staff and residents' },
        ],
      },
      {
        ...emptyExperience(),
        jobTitle: 'Specialist Internal Medicine',
        organization: 'Sheikh Shakhbout Medical City',
        employmentType: 'Full-time',
        startDate: '2016-03',
        endDate: '2020-12',
        responsibilities: [
          {
            value:
              'Managed a wide range of internal medicine cases across inpatient and outpatient settings',
          },
        ],
      },
    ],
  },
  skills: ['Clinical Leadership', 'Cardiac Surgery', 'Patient Safety'],
  research: {
    enabled: true,
    items: [
      {
        ...emptyPublication(),
        title: 'The Impact of Early Intervention in Chronic Disease Management',
        link: 'https://journal.com/article',
        country: 'UAE',
        year: '2021',
      },
    ],
  },
  conferences: {
    enabled: true,
    items: [
      {
        ...emptyConference(),
        name: 'Arab Health Conference',
        location: 'Dubai, UAE',
        date: '2024-01-27',
      },
    ],
  },
};

// A draft with the first five steps completed (opened with "Continue CV").
export function getDraftCvValues(): CvBuilderValues {
  const empty = getEmptyCvValues();
  const finished = CV_BUILDER_PREVIEW_VALUES;

  return {
    ...empty,
    personal: finished.personal,
    contact: finished.contact,
    jobProfile: finished.jobProfile,
    summary: finished.summary,
    educations: finished.educations,
  };
}
