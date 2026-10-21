<?php

namespace Tests\Feature;

use App\Models\Survey;
use App\Models\SurveyQuestion;
use Database\Seeders\SurveySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SurveySeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_survey_seeder_creates_an_active_survey_with_questions_and_options(): void
    {
        $this->seed(SurveySeeder::class);

        $survey = Survey::where('is_active', true)->firstOrFail();

        $this->assertDatabaseCount('surveys', 1);
        $this->assertSame('SURVEI KEPUASAN MASYARAKAT TENTANG PELAYANAN KEARSIPAN - TAHUN 2026', $survey->title);
        $this->assertSame(15, SurveyQuestion::where('survey_id', $survey->id)->count());
        $this->assertSame(60, $survey->questions()->withCount('options')->get()->sum('options_count'));
        $this->assertSame(0, $survey->questions()->where('label', 'Nama')->firstOrFail()->options()->count());
    }
}
