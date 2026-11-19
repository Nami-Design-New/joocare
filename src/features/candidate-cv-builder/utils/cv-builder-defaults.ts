import type { CvBuilderValues } from '../types/cv-builder.types';

type Values<K extends keyof CvBuilderValues> = CvBuilderValues[K];

// Empty rows added by the "+" buttons of the repeatable sections.
export const emptyLanguage = (): Values<'personal'>['languages'][number] => ({
  language: '',
  proficiency: '',
});

export const emptyEducation = (): Values<'educations'>[number] => ({
  degree: '',
  university: '',
  country: '',
  countryLabel: '',
  startDate: '',
  endDate: '',
  gpa: '',
});

export const emptyCertificate = (): Values<'certificates'>[number] => ({
  name: '',
  organization: '',
  startDate: '',
  endDate: '',
});

export const emptyExperience = (): Values<'experience'>['items'][number] => ({
  jobTitle: '',
  jobTitleLabel: '',
  otherJobTitle: '',
  organization: '',
  employmentType: '',
  employmentTypeLabel: '',
  startDate: '',
  endDate: '',
  currentlyWorking: false,
  responsibilities: [{ value: '' }],
});

export const emptyPublication = (): Values<'research'>['items'][number] => ({
  title: '',
  link: '',
  country: '',
  countryLabel: '',
  year: '',
});

export const emptyConference = (): Values<'conferences'>['items'][number] => ({
  name: '',
  location: '',
  date: '',
});

// Values of a brand-new CV.
export function getEmptyCvValues(): CvBuilderValues {
  return {
    personal: {
      photo: '',
      fullName: '',
      nationality: '',
      nationalityLabel: '',
      yearOfBirth: '',
      maritalStatus: '',
      country: '',
      countryLabel: '',
      city: '',
      cityLabel: '',
      languages: [emptyLanguage()],
    },
    contact: { email: '', phone: '', linkedin: '' },
    jobProfile: {
      jobTitle: '',
      jobTitleLabel: '',
      yearsOfExperience: '',
      experienceLabel: '',
      specialty: '',
      specialtyLabel: '',
      subspecialty: '',
      hasLicense: false,
      availableNow: false,
    },
    summary: { text: '' },
    educations: [emptyEducation()],
    certificates: [emptyCertificate()],
    experience: {
      freshGraduate: false,
      profile: '',
      items: [emptyExperience()],
    },
    skills: [],
    research: { enabled: false, items: [emptyPublication()] },
    conferences: { enabled: false, items: [emptyConference()] },
  };
}
