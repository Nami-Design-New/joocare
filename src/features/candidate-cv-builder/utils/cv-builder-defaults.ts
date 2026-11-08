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
  startDate: '',
  endDate: '',
});

export const emptyCertificate = (): Values<'certificates'>[number] => ({
  name: '',
  organization: '',
  startDate: '',
  endDate: '',
});

export const emptyExperience = (): Values<'experience'>['items'][number] => ({
  jobTitle: '',
  otherJobTitle: '',
  organization: '',
  employmentType: '',
  startDate: '',
  endDate: '',
  currentlyWorking: false,
  responsibilities: [{ value: '' }],
});

export const emptyPublication = (): Values<'research'>['items'][number] => ({
  title: '',
  link: '',
  country: '',
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
      yearOfBirth: '',
      maritalStatus: '',
      country: '',
      city: '',
      languages: [emptyLanguage()],
    },
    contact: { email: '', phone: '', linkedin: '' },
    jobProfile: {
      jobTitle: '',
      yearsOfExperience: '',
      specialty: '',
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
