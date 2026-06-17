import { z } from "zod";

/**
 * Regex explanation for Thai character validation:
 * ^[ก-๙0-9\s]+$
 * 
 * ^       : Start of string
 * [ก-๙]   : Thai characters (Unicode range for Thai script)
 * 0-9     : Arabic numbers
 * \s      : Whitespace characters (space, tab, newline)
 * +       : One or more of the preceding characters
 * $       : End of string
 */
export const THAI_ALPHANUMERIC_REGEX = /^[ก-๙0-9\s]+$/;

export const commentSchema = z.object({
  senderName: z.string().min(1, "Name is required").max(100),
  message: z.string()
    .min(1, "Message is required")
    .max(1000)
    .regex(THAI_ALPHANUMERIC_REGEX, "Message must contain only Thai characters, numbers, and whitespaces"),
  blogId: z.string().cuid(),
});

export type CommentInput = z.infer<typeof commentSchema>;
