<?php

namespace App\Exports;

use App\Models\GuestBook;
use App\Models\GuestBookQuestion;
use Carbon\CarbonInterface;

class GuestBookExport extends AnswersExport
{
    public function __construct(?CarbonInterface $startDate = null, ?CarbonInterface $endDate = null)
    {
        $questions = GuestBookQuestion::withTrashed()
            ->orderBy('sequence_number')
            ->orderBy('label')
            ->get(['id', 'label', 'sequence_number']);

        $guestBooks = GuestBook::query()
            ->with([
                'answers.question:id,label',
                'answers.option:id,label',
            ])
            ->when($startDate, fn ($query) => $query->whereDate('created_at', '>=', $startDate?->toDateString()))
            ->when($endDate, fn ($query) => $query->whereDate('created_at', '<=', $endDate?->toDateString()))
            ->orderBy('created_at')
            ->get();

        $headings = ['No', 'Tanggal', ...$questions->pluck('label')->all()];

        $rows = $guestBooks->values()->map(function (GuestBook $guestBook, int $index) use ($questions): array {
            $answers = $guestBook->answers->keyBy('guest_book_question_id');

            $values = $questions->map(function (GuestBookQuestion $question) use ($answers): string {
                $answer = $answers->get($question->id);

                return $this->formatAnswer($answer?->option?->label, $answer?->custom_text);
            })->all();

            return [
                $index + 1,
                $guestBook->created_at?->format('d/m/Y H:i'),
                ...$values,
            ];
        });

        parent::__construct($headings, $rows, 'Buku Tamu');
    }
}
