<?php

namespace App\Actions\GuestBook;

use App\Models\GuestBook;
use App\Models\GuestBookAnswer;
use Illuminate\Support\Str;

class CreateGuestBookAction
{
    /**
     * Create a new guest book question in the database.
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(array $data): GuestBook
    {
        $guestBook = GuestBook::create();

        $now = now();
        $answers = array_map(function ($answer) use ($guestBook, $now) {
            return [
                'id' => (string) Str::orderedUuid(),
                'guest_book_id' => $guestBook->id,
                'guest_book_question_id' => $answer['guest_book_question_id'],
                'custom_text' => (isset($answer['custom_text']) && $answer['custom_text'] !== '') ? $answer['custom_text'] : null,
                'guest_book_question_option_id' => ! empty($answer['guest_book_question_option_id']) ? $answer['guest_book_question_option_id'] : null,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }, $data['answers']);

        GuestBookAnswer::insert($answers);

        return $guestBook;
    }

    /**
     * Invokable alias for execute.
     *
     * @param  array<string, mixed>  $data
     */
    public function __invoke(array $data): GuestBook
    {
        return $this->execute($data);
    }
}
