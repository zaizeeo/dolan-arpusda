<?php

namespace App\Actions\GuestBook\Questions;

use App\Models\GuestBookQuestion;
use App\Models\GuestBookQuestionOption;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CreateQuestionAction
{
    /**
     * Create a new guest book question in the database.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data): GuestBookQuestion
    {
        return DB::transaction(function () use ($data) {
            $question = GuestBookQuestion::create([
                'label' => $data['label'],
                'description' => $data['description'] ?? null,
                'sequence_number' => (GuestBookQuestion::max('sequence_number') ?? 0) + 1,
            ]);

            $options = $data['options'] ?? [];

            if (count($options) > 0) {
                $now = now();

                $rows = array_map(
                    function ($option, $index) use ($question, $now) {
                        return [
                            'id' => (string) Str::orderedUuid(),
                            'label' => $option['label'],
                            'description' => $option['description'] ?? null,
                            'guest_book_question_id' => $question->id,
                            'is_allow_custom_text' => $option['is_allow_custom_text'] ?? false,
                            'sequence_number' => $index + 1,
                            'is_active' => true,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ];
                    },
                    $options,
                    array_keys($options)
                );

                GuestBookQuestionOption::insert($rows);
            }

            return $question;
        });
    }

    /**
     * Invokable alias for execute.
     *
     * @param  array<string, mixed>  $data
     */
    public function __invoke(array $data): GuestBookQuestion
    {
        return $this->execute($data);
    }
}
