<?php

namespace App\Models;

use Database\Factories\SurveyAnswerFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['survey_response_id', 'survey_question_id', 'survey_question_option_id', 'custom_text'])]
class SurveyAnswer extends Model
{
    /** @use HasFactory<SurveyAnswerFactory> */
    use HasFactory, HasUuids, SoftDeletes;

    /**
     * Get the response that owns this answer.
     *
     * @return BelongsTo<SurveyResponse, $this>
     */
    public function response(): BelongsTo
    {
        return $this->belongsTo(SurveyResponse::class, 'survey_response_id');
    }

    /**
     * Get the question associated with this answer.
     *
     * @return BelongsTo<SurveyQuestion, $this>
     */
    public function question(): BelongsTo
    {
        return $this->belongsTo(SurveyQuestion::class, 'survey_question_id')->withTrashed();
    }

    /**
     * Get the option selected for this answer, when the question provides options.
     *
     * @return BelongsTo<SurveyQuestionOption, $this>
     */
    public function option(): BelongsTo
    {
        return $this->belongsTo(SurveyQuestionOption::class, 'survey_question_option_id')->withTrashed();
    }
}
