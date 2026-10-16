<?php

namespace App\Models;

use Database\Factories\GuestBookAnswerFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['guest_book_id', 'guest_book_question_id', 'guest_book_question_option_id'])]
class GuestBookAnswer extends Model
{
    /** @use HasFactory<GuestBookAnswerFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    /**
     * Get the guest book entry that owns this answer.
     *
     * @return BelongsTo<GuestBook, $this>
     */
    public function guestBook(): BelongsTo
    {
        return $this->belongsTo(GuestBook::class, 'guest_book_id');
    }

    /**
     * Get the question associated with this answer.
     *
     * @return BelongsTo<GuestBookQuestion, $this>
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(GuestBookQuestion::class, 'guest_book_question_id');
    }

    /**
     * Get the option selected for this answer, when the question provides options.
     *
     * @return BelongsTo<GuestBookQuestionOption, $this>
     */
    public function option(): BelongsTo
    {
        return $this->belongsTo(GuestBookQuestionOption::class, 'guest_book_question_option_id');
    }
}
