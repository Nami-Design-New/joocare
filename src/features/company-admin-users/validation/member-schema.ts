import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';
import { MEMBER_TEXT_MAX_LENGTH } from '../constants';

type MemberMessages = {
  nameRequired: string;
  nameMax: string;
  emailRequired: string;
  emailInvalid: string;
  phoneRequired: string;
  phoneInvalid: string;
  roleRequired: string;
  displayedRoleNameMax: string;
};

export const createMemberSchema = (messages: MemberMessages) =>
  z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: messages.nameRequired })
      .max(MEMBER_TEXT_MAX_LENGTH, { message: messages.nameMax }),
    email: z
      .string()
      .trim()
      .min(1, { message: messages.emailRequired })
      .email({ message: messages.emailInvalid }),
    phoneNumber: z
      .string()
      .min(1, { message: messages.phoneRequired })
      .refine((value) => isValidPhoneNumber(value), {
        message: messages.phoneInvalid,
      }),
    role: z.string().min(1, { message: messages.roleRequired }),
    displayedRoleName: z
      .string()
      .trim()
      .max(MEMBER_TEXT_MAX_LENGTH, { message: messages.displayedRoleNameMax }),
  });

export type TMemberSchema = z.infer<ReturnType<typeof createMemberSchema>>;
