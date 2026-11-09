<?php

namespace Tests\Feature;

use App\Exports\SurveyResponseExport;
use App\Models\Survey;
use App\Models\SurveyAnswer;
use App\Models\SurveyQuestion;
use App\Models\SurveyQuestionOption;
use App\Models\SurveyResponse;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Maatwebsite\Excel\Facades\Excel;
use Tests\TestCase;

class SurveyResponseExportTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => 'admin']);
    }

    public function test_admin_can_download_survey_response_export(): void
    {
        Excel::fake();

        $this->actingAs($this->admin())
            ->get(route('survey-response-export'))
            ->assertOk();

        Excel::assertDownloaded('respon-survei.xlsx');
    }

    public function test_survey_response_export_returns_an_excel_file(): void
    {
        $this->actingAs($this->admin())
            ->get(route('survey-response-export'))
            ->assertOk()
            ->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    public function test_survey_response_export_uses_active_survey_question_labels_as_columns(): void
    {
        $survey = Survey::factory()->create(['is_active' => true]);
        $question = SurveyQuestion::factory()->create([
            'survey_id' => $survey->id,
            'label' => 'Kualitas Pelayanan',
            'sequence_number' => 1,
        ]);
        $option = SurveyQuestionOption::factory()->create([
            'survey_question_id' => $question->id,
            'label' => 'Sangat Baik',
            'sequence_number' => 1,
        ]);

        $response = SurveyResponse::factory()->create([
            'survey_id' => $survey->id,
            'created_at' => '2026-11-09 11:30:00',
        ]);

        SurveyAnswer::factory()->create([
            'survey_response_id' => $response->id,
            'survey_question_id' => $question->id,
            'survey_question_option_id' => $option->id,
        ]);

        $export = new SurveyResponseExport;

        $this->assertSame(['No', 'Tanggal', 'Kualitas Pelayanan'], $export->headings());
        $this->assertSame([1, '09/11/2026 11:30', 'Sangat Baik'], $export->collection()->first());
    }

    public function test_survey_response_export_ignores_inactive_surveys(): void
    {
        $inactiveSurvey = Survey::factory()->create(['is_active' => false]);
        SurveyQuestion::factory()->create([
            'survey_id' => $inactiveSurvey->id,
            'label' => 'Pertanyaan Tidak Aktif',
            'sequence_number' => 1,
        ]);

        $export = new SurveyResponseExport;

        $this->assertSame(['No', 'Tanggal'], $export->headings());
        $this->assertCount(0, $export->collection());
    }

    public function test_survey_response_export_filters_by_date_range(): void
    {
        $survey = Survey::factory()->create(['is_active' => true]);
        $question = SurveyQuestion::factory()->create([
            'survey_id' => $survey->id,
            'label' => 'Saran',
            'sequence_number' => 1,
        ]);

        $inside = SurveyResponse::factory()->create([
            'survey_id' => $survey->id,
            'created_at' => '2026-11-05 09:00:00',
        ]);
        $outside = SurveyResponse::factory()->create([
            'survey_id' => $survey->id,
            'created_at' => '2026-11-08 09:00:00',
        ]);

        foreach ([$inside, $outside] as $index => $response) {
            SurveyAnswer::factory()->create([
                'survey_response_id' => $response->id,
                'survey_question_id' => $question->id,
                'custom_text' => "Respon {$index}",
            ]);
        }

        $export = new SurveyResponseExport(
            Carbon::parse('2026-11-04'),
            Carbon::parse('2026-11-06'),
        );

        $rows = $export->collection();

        $this->assertCount(1, $rows);
        $this->assertSame('Respon 0', $rows->first()[2]);
    }

    public function test_intern_cannot_download_survey_response_export(): void
    {
        $intern = User::factory()->create(['role' => 'intern']);

        $this->actingAs($intern)
            ->get(route('survey-response-export'))
            ->assertRedirect(route('guest-book-statistics-index'));
    }
}
