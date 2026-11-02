import type { CandidateCv } from '../types/candidate-cv.types';

export const candidateCvFileUrl = '/assets/company-projects/sample-cv.pdf';

const certificationIssuer = 'American Heart of Association';
const certificationPeriod = '7 / 2014 : 7 / 2022';

export const candidateCvPreview: CandidateCv = {
  name: 'Ahmed M. Ali',
  jobTitle: 'Consultant Internal Medicine',
  contact: {
    phone: '+971 50 123 4567',
    email: 'ahmed.ali@outlook.com',
    location: 'Abu Dhabi, UAE',
    linkedin: 'linkedin.com/in/ahmed-ali',
  },
  summary:
    'Consultant Internal Medicine Physician with over 12 years of clinical experience in tertiary care hospitals. Skilled in managing complex medical conditions, leading multidisciplinary teams, and delivering patient-centered care. Committed to clinical excellence, evidence-based practice, and continuous professional development to improve patient outcomes and healthcare quality.',
  skills: [
    'Internal Medicine',
    'Patient Assessment',
    'Chronic Disease Management',
    'Clinical Governance',
    'Emergency Care',
    'Leadership',
    'Research',
    'Medical Education',
    'Quality Improvement',
    'Multidisciplinary Collaboration',
  ],
  experiences: [
    {
      id: 'experience-1',
      label: 'Fresh Graduate',
      title: 'Professional Profile',
      description:
        'Ambitious and highly motivated professional at the beginning of my career, eager to contribute to organizational success through continuous learning, adaptability, collaboration, and a strong commitment to quality and professional excellence.',
      strengthsTitle: 'Professional Strengths',
      strengths: [
        'Demonstrates a strong willingness to learn, develop new skills, and continuously improve performance.',
        'Adapts effectively to new environments, responsibilities, and organizational requirements.',
        'Works collaboratively with colleagues and cross-functional teams to achieve shared objectives.',
        'Takes ownership of assigned tasks and responsibilities with professionalism and accountability.',
        'Maintains a positive attitude and remains open to feedback, coaching, and professional growth opportunities.',
        'Committed to delivering high-quality work with accuracy, efficiency, and attention to detail.',
        'Upholds organizational policies, ethical standards, and professional conduct at all times.',
      ],
    },
  ],
  publications: [
    {
      id: 'publication-1',
      title: 'The Impact of Early Intervention in Chronic Disease Management',
      meta: 'UAE · 2021',
      url: 'https://joocare.com',
    },
    {
      id: 'publication-2',
      title: 'Quality Improvement in Patient Safety: A Multicenter Study',
      meta: 'UAE · 2019',
      url: 'https://joocare.com',
    },
    {
      id: 'publication-3',
      title: 'Role of Telemedicine in Internal Medicine Practice',
      meta: 'Egypt · 2018',
      url: 'https://joocare.com',
    },
  ],
  conferences: [
    {
      id: 'conference-1',
      title: 'Arab Health Conference',
      meta: 'UAE · 27 Jan 2024',
    },
    {
      id: 'conference-2',
      title: 'European Society of Internal Medicine Congress',
      meta: 'Austria · 12 Sep 2023',
    },
    {
      id: 'conference-3',
      title: 'UAE Internal Medicine Update',
      meta: 'UAE · 05 Nov 2022',
    },
  ],
  highlights: [
    '12+ Years Experience',
    'Specialty: Internal Medicine',
    'Subspecialty: Endocrinology',
    'License: DOH – Abu Dhabi',
    'Available Now',
  ],
  certifications: [
    'Advanced Cardiac Life Support (ACLS)',
    'Basic Life Support (BLS)',
    'Infection Control Training',
    'Patient Safety and Quality Management',
    'Medical Leadership Program',
    'Clinical Research Methodology',
  ].map((title, index) => ({
    id: `certification-${index + 1}`,
    title,
    issuer: certificationIssuer,
    period: certificationPeriod,
  })),
  educations: [
    {
      id: 'education-1',
      degree: 'Master of Internal Medicine',
      institution: 'Ain Shams University, Egypt',
      period: '7 / 2014 : 7 / 2022',
    },
    {
      id: 'education-2',
      degree: 'Bachelor of Medicine and Surgery (MBBS)',
      institution: 'Cairo University, Egypt',
      period: '7 / 2014 : 7 / 2022',
    },
  ],
  languages: [
    { id: 'language-1', name: 'Arabic', level: 'Native', rating: 5 },
    { id: 'language-2', name: 'English', level: 'Fluent', rating: 5 },
    { id: 'language-3', name: 'French', level: 'Intermediate', rating: 5 },
  ],
  additionalInfo: [
    { key: 'nationality', value: 'Egyptian' },
    { key: 'year-of-birth', value: '1986' },
    { key: 'marital-status', value: 'Married' },
  ],
};
