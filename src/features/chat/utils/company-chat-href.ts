import { CHAT_ROUTES } from '../constants';

type CompanyChatHrefCandidate = {
  userId: string | number;
  name: string;
  image?: string | null;
};

/**
 * Opens the company chat with a candidate. The conversation id is the candidate's
 * user id; name and image show the candidate before the first message exists.
 */
export function getCompanyChatHref({
  userId,
  name,
  image,
}: CompanyChatHrefCandidate) {
  return {
    pathname: CHAT_ROUTES.company,
    query: {
      conversation: String(userId),
      candidateName: name,
      ...(image ? { candidateImage: image } : {}),
    },
  };
}
