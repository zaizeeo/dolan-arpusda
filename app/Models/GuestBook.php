<?php

namespace App\Models;

use Database\Factories\GuestBookFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GuestBook extends Model
{
    /** @use HasFactory<GuestBookFactory> */
    use HasFactory, HasUuids;

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array<string>|bool
     */
    protected $guarded = [];

    /**
     * Get all answers for this guest book entry.
     *
     * @return HasMany<GuestBookAnswer, $this>
     */
    public function answers(): HasMany
    {
        return $this->hasMany(GuestBookAnswer::class);
    }

    /**
     * Get all questions answered in this guest book entry.
     *
     * @return BelongsToMany<GuestBookQuestion, $this>
     */
    public function questions(): BelongsToMany
    {
        return $this->belongsToMany(
            GuestBookQuestion::class,
            'guest_book_answers',
            'guest_book_id',
            'guest_book_question_id'
        );
    }
}
