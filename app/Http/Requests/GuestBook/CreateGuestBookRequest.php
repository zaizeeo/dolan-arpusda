<?php

namespace App\Http\Requests\GuestBook;

use App\Models\GuestBookQuestion;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CreateGuestBookRequest extends FormRequest
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
        $activeQuestionsCount = GuestBookQuestion::where('is_active', true)->count();

        return [
            'answers' => ['array', "min:$activeQuestionsCount", "max:$activeQuestionsCount"],
            'answers.*.guest_book_question_id' => ['string', 'required'],
            'answers.*.custom_text' => ['string', 'nullable'],
            'answers.*.guest_book_question_option_id' => ['string', 'nullable'],
        ];
    }
}
