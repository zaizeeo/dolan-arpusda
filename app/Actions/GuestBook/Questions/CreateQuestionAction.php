<?php

namespace App\Actions\GuestBook\Questions;

use App\Http\Requests\GuestBook\Questions\CreateQuestionRequest;
use App\Models\GuestBookQuestion;
use App\Models\GuestBookQuestionOption;
use Illuminate\Support\Str;

class CreateQuestionAction
{
    /**
     * Create a new guest book question in the database.
     *
     * @param  CreateQuestionRequest  $data
     */
    public function execute(CreateQuestionRequest $data): GuestBookQuestion
    {

        $question = GuestBookQuestion::create([
            'label' => $data['label'],
            'description' => $data['description'] ?? null,
            'sequence_number' => $data['sequence_number'] ?? 0,
        ]);

        if (count($data->options) > 0) {
            $options = array_map(
                function ($option, $index) use ($question) {
                    return [
                        'id' => (string) Str::orderedUuid(),
                        'label' => $option->label,
                        'description' => $option->description || null,
                        'guest_book_question_id' => $question->id,
                        'is_allow_custom_text' => $option->is_allow_custom_text || false,
                        'sequence_number' => $index + 1,

                    ];
                },
                $data->options,
                array_keys($data->options)
            );

            GuestBookQuestionOption::insert($options);
        }

        return $question;
    }

    /**
     * Invokable alias for execute.
     *
     * @param  CreateQuestionRequest  $data
     */
    public function __invoke(CreateQuestionRequest $data): GuestBookQuestion
    {
        return $this->execute($data);
    }
}
