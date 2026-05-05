import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, Resolver } from "react-hook-form";
import type { z } from "zod";

/**
 * Typed wrapper for zodResolver that fixes Zod v4 input/output type
 * mismatches with react-hook-form. In Zod v4, schemas with `z.coerce`
 * or `.optional()` can produce input types that differ from output types,
 * causing resolver type conflicts.
 */
export function typedZodResolver<TOutput extends FieldValues>(
  schema: z.ZodType<TOutput, any, any>,
): Resolver<TOutput> {
  return zodResolver(schema as any) as Resolver<TOutput>;
}
