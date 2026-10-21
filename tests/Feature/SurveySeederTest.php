<?php

namespace Tests\Feature;

use App\Models\Survey;
use App\Models\SurveyAnswer;
use App\Models\SurveyQuestion;
use App\Models\SurveyResponse;
use Database\Seeders\SurveyQuestionSeeder;
use Database\Seeders\SurveySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SurveySeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_survey_question_seeder_creates_an_active_survey_with_questions_and_options(): void
    {
        $this->seed(SurveyQuestionSeeder::class);

        $survey = Survey::where('is_active', true)->firstOrFail();

        $this->assertDatabaseCount('surveys', 1);
        $this->assertSame('SURVEI KEPUASAN MASYARAKAT TENTANG PELAYANAN KEARSIPAN - TAHUN 2026', $survey->title);
        $this->assertSame(15, SurveyQuestion::where('survey_id', $survey->id)->count());
        $this->assertSame(60, $survey->questions()->withCount('options')->get()->sum('options_count'));
        $this->assertSame(0, $survey->questions()->where('label', 'Nama')->firstOrFail()->options()->count());
    }

    public function test_survey_seeder_creates_sample_responses_with_answers_for_every_question(): void
    {
        $this->seed(SurveySeeder::class);

        $survey = Survey::where('is_active', true)->firstOrFail();
        $questions = $survey->questions()
            ->where('is_active', true)
            ->orderBy('sequence_number')
            ->get();

        $responseIds = SurveyResponse::where('survey_id', $survey->id)->pluck('id');

        $this->assertCount(12, $responseIds);
        $this->assertSame(
            12 * $questions->count(),
            SurveyAnswer::whereIn('survey_response_id', $responseIds)->count()
        );

        $response = SurveyResponse::where('survey_id', $survey->id)->firstOrFail();
        $this->assertSame($questions->count(), $response->answers()->count());

        $nameQuestion = $questions->firstWhere('label', 'Nama');
        $genderQuestion = $questions->firstWhere('label', 'Jenis Kelamin');

        $this->assertNotNull($nameQuestion);
        $this->assertNotNull($genderQuestion);

        $nameAnswer = $response->answers()->where('survey_question_id', $nameQuestion->id)->firstOrFail();
        $genderAnswer = $response->answers()->where('survey_question_id', $genderQuestion->id)->firstOrFail();

        $this->assertNull($nameAnswer->survey_question_option_id);
        $this->assertNotNull($nameAnswer->custom_text);
        $this->assertNotNull($genderAnswer->survey_question_option_id);
        $this->assertNull($genderAnswer->custom_text);
    }

    public function test_survey_seeder_does_not_create_duplicate_responses(): void
    {
        $this->seed(SurveySeeder::class);
        $this->seed(SurveySeeder::class);

        $this->assertDatabaseCount('survey_responses', 12);
        $this->assertDatabaseCount('survey_answers', 180);
    }
}
