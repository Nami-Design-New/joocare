import { z } from 'zod';

export function createTalentSearchSchema(rangeMessage: string) {
  return (
    z
      // Every filter is optional: unset fields may be undefined, empty or [].
      .record(z.string(), z.union([z.string(), z.array(z.string())]).optional())
      .superRefine((values, context) => {
        for (const range of ['current', 'expected']) {
          const minimum = values[`${range}-min`];
          const maximum = values[`${range}-max`];
          if (
            typeof minimum === 'string' &&
            typeof maximum === 'string' &&
            minimum &&
            maximum &&
            Number(minimum) > Number(maximum)
          ) {
            context.addIssue({
              code: 'custom',
              path: [`${range}-max`],
              message: rangeMessage,
            });
          }
        }
      })
  );
}
