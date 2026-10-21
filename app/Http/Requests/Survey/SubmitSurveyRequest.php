<?php

namespace App\Http\Requests\Survey;

use App\Models\Survey;
use App\Models\SurveyQuestion;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Validator as ValidatorContract;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Validator;

class SubmitSurveyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $surveyId = $this->input('survey_id');

        $activeQuestionCount = is_string($surveyId) && $surveyId !== ''
            ? SurveyQuestion::where('survey_id', $surveyId)->where('is_active', true)->count()
            : 0;

        return [
            'survey_id' => [
                'required',
                'string',
                Rule::exists('surveys', 'id')->where('is_active', true)->whereNull('deleted_at'),
            ],
            'answers' => ['required', 'array', "size:$activeQuestionCount"],
            'answers.*.survey_question_id' => [
                'required',
                'string',
                'distinct',
                Rule::exists('survey_questions', 'id')
                    ->where('survey_id', $surveyId)
                    ->where('is_active', true)
                    ->whereNull('deleted_at'),
            ],
            'answers.*.survey_question_option_id' => ['nullable', 'string'],
            'answers.*.custom_text' => ['nullable', 'string', 'max:5000'],
        ];
    }

    /**
     * Get the "after" validation callables for the request.
     *
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [
            function (Validator $validator) {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                $survey = Survey::with([
                    'questions' => fn ($query) => $query->where('is_active', true),
                    'questions.options' => fn ($query) => $query->where('is_active', true),
                ])->find($this->input('survey_id'));

                if (! $survey) {
                    return;
                }

                $questions = $survey->questions->keyBy('id');

                foreach ($this->input('answers', []) as $index => $answer) {
                    $question = $questions->get($answer['survey_question_id'] ?? null);

                    if (! $question) {
                        $validator->errors()->add(
                            "answers.$index.survey_question_id",
                            'Pertanyaan yang dipilih tidak valid.'
                        );

                        continue;
                    }

                    $optionId = $answer['survey_question_option_id'] ?? null;
                    $customText = trim((string) ($answer['custom_text'] ?? ''));

                    if ($question->options->isNotEmpty()) {
                        if (empty($optionId)) {
                            $validator->errors()->add(
                                "answers.$index.survey_question_option_id",
                                'Pilih salah satu jawaban yang tersedia.'
                            );

                            continue;
                        }

                        $option = $question->options->firstWhere('id', $optionId);

                        if (! $option) {
                            $validator->errors()->add(
                                "answers.$index.survey_question_option_id",
                                'Pilihan jawaban tidak sesuai dengan pertanyaan.'
                            );

                            continue;
                        }

                        if ($option->is_allow_custom_text && $customText === '') {
                            $validator->errors()->add(
                                "answers.$index.custom_text",
                                'Isi jawaban tambahan untuk pilihan ini.'
                            );
                        }

                        continue;
                    }

                    if ($customText === '') {
                        $validator->errors()->add(
                            "answers.$index.custom_text",
                            'Jawaban pertanyaan ini wajib diisi.'
                        );
                    }
                }
            },
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'survey_id.required' => 'Survei tidak ditemukan.',
            'survey_id.exists' => 'Survei tidak tersedia atau sudah tidak aktif.',
            'answers.required' => 'Jawaban survei wajib diisi.',
            'answers.array' => 'Format jawaban survei tidak valid.',
            'answers.size' => 'Semua pertanyaan survei wajib dijawab.',
            'answers.*.survey_question_id.required' => 'Pertanyaan wajib diisi.',
            'answers.*.survey_question_id.distinct' => 'Pertanyaan tidak boleh dijawab lebih dari sekali.',
            'answers.*.survey_question_id.exists' => 'Pertanyaan tidak sesuai dengan survei.',
            'answers.*.survey_question_option_id.string' => 'Pilihan jawaban tidak valid.',
            'answers.*.custom_text.string' => 'Jawaban tambahan harus berupa teks.',
            'answers.*.custom_text.max' => 'Jawaban tambahan maksimal 5000 karakter.',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(ValidatorContract $validator)
    {
        $messages = $validator->errors()->toArray();
        $messages['server'] = [$validator->errors()->first()];

        throw ValidationException::withMessages($messages)
            ->redirectTo($this->getRedirectUrl());
    }
}
