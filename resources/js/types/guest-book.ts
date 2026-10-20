import type { TimeStamps } from "@/types";

export interface GuestBookQuestionOption extends Partial<TimeStamps> {
    id: string;
    label: string;
    description: string | null;
    guest_book_question_id: string;
    is_allow_custom_text: boolean | number;
    sequence_number?: number;
    is_active: boolean;
}

export interface GuestBookQuestion extends Partial<TimeStamps> {
    id: string;
    label: string;
    description: string | null;
    is_active: boolean;
    sequence_number?: number;
    options: Array<GuestBookQuestionOption>;
}
