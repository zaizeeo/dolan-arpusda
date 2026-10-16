<?php

namespace App\Models;

use Database\Factories\GuestBookQuestionOptionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['label', 'description', 'is_active', 'is_allow_custom_text', 'guest_book_question_id'])]
class GuestBookQuestionOption extends Model
{
    /** @use HasFactory<GuestBookQuestionOptionFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    /**
     * Get the question this option belongs to.
     *
     * @return BelongsTo<GuestBookQuestion, $this>
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(GuestBookQuestion::class, 'guest_book_question_id');
    }

    /**
     * Get the answers that selected this option.
     *
     * @return HasMany<GuestBookAnswer, $this>
     */
    public function answers(): HasMany
    {
        return $this->hasMany(GuestBookAnswer::class);
    }

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
