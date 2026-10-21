import type { TimeStamps } from "@/types";

export interface SurveyQuestionOption extends Partial<TimeStamps> {
    id: string;
    label: string;
    description: string | null;
    survey_question_id: string;
    is_allow_custom_text: boolean | number;
    sequence_number?: number | null;
    is_active: boolean;
}

export interface SurveyQuestion extends Partial<TimeStamps> {
    id: string;
    label: string;
    description: string | null;
    is_active: boolean;
    sequence_number?: number | null;
    options: Array<SurveyQuestionOption>;
}

export interface Survey extends Partial<TimeStamps> {
    id: string;
    title: string;
    description: string | null;
    is_active: boolean;
    questions: Array<SurveyQuestion>;
}

export interface PublicSurveyQuestionOption {
    id: string;
    label: string;
    description?: string | null;
    is_allow_custom_text: boolean;
    sequence_number?: number | null;
}

export interface PublicSurveyQuestion {
    id: string;
    label: string;
    description?: string | null;
    sequence_number?: number | null;
    options: Array<PublicSurveyQuestionOption>;
}

export interface PublicSurvey {
    id: string;
    title: string;
    description?: string | null;
    questions: Array<PublicSurveyQuestion>;
}

export interface SurveyAnswerItem {
    id: string;
    survey_question_id: string;
    survey_question_option_id: string | null;
    custom_text: string | null;
    question: {
        id: string;
        label: string;
        description: string | null;
        sequence_number: number | null;
    } | null;
    option: {
        id: string;
        label: string;
        description: string | null;
        is_allow_custom_text: boolean;
    } | null;
}

export interface SurveyResponseItem {
    id: string;
    created_at: string | null;
    created_at_human: string | null;
    answers: Array<SurveyAnswerItem>;
}
