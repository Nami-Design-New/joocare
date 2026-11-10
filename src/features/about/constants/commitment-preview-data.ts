import type { AboutContentSection } from '../types/about.types';
import { ABOUT_FALLBACK_IMAGES } from './index';

export const ABOUT_COMMITMENT_PREVIEW_DATA: AboutContentSection = {
  title: 'The Joocare Commitment',
  description:
    'Joocare is more than a platform; it is a commitment to institutional resilience. By synthesizing Intelligence, Alignment, and Integrity, we are redefining the DNA of healthcare recruitment. We don’t just find candidates. We secure the future of your clinical operations.',
  images: [
    {
      id: 'commitment-primary',
      image: ABOUT_FALLBACK_IMAGES.primary,
      alt: 'Doctor working on a laptop',
    },
    {
      id: 'commitment-secondary',
      image: ABOUT_FALLBACK_IMAGES.secondary,
      alt: 'Healthcare worker holding a heart-shaped stethoscope',
    },
  ],
};
