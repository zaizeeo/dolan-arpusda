<?php

namespace App\Models;

use Database\Factories\SurveyResponseFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['survey_id'])]
class SurveyResponse extends Model
{
    /** @use HasFactory<SurveyResponseFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    /**
     * Get the survey this response belongs to.
     *
     * @return BelongsTo<Survey, $this>
     */
    public function survey(): BelongsTo
    {
        return $this->belongsTo(Survey::class);
    }

    /**
     * Get the answers submitted in this response.
     *
     * @return HasMany<SurveyAnswer, $this>
     */
    public function answers(): HasMany
    {
        return $this->hasMany(SurveyAnswer::class);
    }
}
