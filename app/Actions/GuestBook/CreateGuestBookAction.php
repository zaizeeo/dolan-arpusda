<?php

namespace App\Actions\GuestBook\Questions;

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

        $answers = array_map(function ($answer) use ($guestBook) {
            return [
                'id' => (string) Str::orderedUuid(),
                'guest_book_id' => $guestBook->id,
                'guest_book_question_id' => $answer['guest_book_question_id'],
                'custom_text' => $answer['custom_text'],
                'guest_book_question_option_id' => $answer['guest_book_question_option_id'],
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
