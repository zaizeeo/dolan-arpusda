<?php

namespace App\Models;

use Database\Factories\GuestBookQuestionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['label', 'text', 'is_active'])]
class GuestBookQuestion extends Model
{
    /** @use HasFactory<GuestBookQuestionFactory> */
    use HasFactory, HasUuids;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get all answers for this question.
     *
     * @return HasMany<GuestBookAnswer, $this>
     */
    public function answers(): HasMany
    {
        return $this->hasMany(GuestBookAnswer::class);
    }

    /**
     * Get the guest books that answered this question.
     *
     * @return BelongsToMany<GuestBook, $this>
     */
    public function guestBooks(): BelongsToMany
    {
        return $this->belongsToMany(
            GuestBook::class,
            'guest_book_answers',
            'guest_book_question_id',
            'guest_book_id'
        );
    }
}
