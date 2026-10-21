<?php

namespace Database\Seeders;

use App\Models\Survey;
use App\Models\SurveyQuestion;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SurveySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::transaction(function () {
            $survey = Survey::firstOrCreate(
                ['title' => 'Survei Kepuasan Layanan Jeta Arsip'],
                [
                    'description' => 'Bantu kami meningkatkan kualitas layanan dengan mengisi survei singkat berikut.',
                    'is_active' => true,
                ]
            );

            $this->createQuestion($survey, 1, 'Seberapa puas Anda dengan pelayanan petugas?', 'Pilih tingkat kepuasan Anda.', [
                ['label' => 'Sangat Puas'],
                ['label' => 'Puas'],
                ['label' => 'Cukup'],
                ['label' => 'Kurang Puas'],
                ['label' => 'Tidak Puas'],
            ]);

            $this->createQuestion($survey, 2, 'Bagaimana kemudahan proses layanan yang Anda terima?', 'Pilih tingkat kemudahan proses layanan.', [
                ['label' => 'Sangat Mudah'],
                ['label' => 'Mudah'],
                ['label' => 'Cukup'],
                ['label' => 'Sulit'],
                ['label' => 'Sangat Sulit'],
            ]);

            $this->createQuestion($survey, 3, 'Apakah fasilitas ruang layanan nyaman?', 'Pilih salah satu.', [
                ['label' => 'Ya'],
                ['label' => 'Tidak'],
            ]);

            $this->createQuestion($survey, 4, 'Darimana Anda mengetahui layanan ini?', 'Pilih salah satu sumber informasi.', [
                ['label' => 'Media Sosial'],
                ['label' => 'Website'],
                ['label' => 'Rekomendasi Teman/Keluarga'],
                ['label' => 'Langsung Datang'],
                ['label' => 'Lainnya', 'is_allow_custom_text' => true],
            ]);

            $this->createQuestion($survey, 5, 'Saran dan masukan untuk peningkatan layanan', 'Tuliskan saran atau masukan Anda.');
        });
    }

    /**
     * Create a survey question together with its options.
     *
     * @param  array<int, array{label: string, description?: string|null, is_active?: bool, is_allow_custom_text?: bool}>  $options
     */
    private function createQuestion(Survey $survey, int $sequenceNumber, string $label, ?string $description = null, array $options = []): void
    {
        $question = SurveyQuestion::firstOrCreate(
            ['survey_id' => $survey->id, 'sequence_number' => $sequenceNumber],
            ['label' => $label, 'description' => $description]
        );

        foreach ($options as $index => $option) {
            $question->options()->firstOrCreate(
                ['label' => $option['label']],
                [
                    'description' => $option['description'] ?? null,
                    'is_active' => $option['is_active'] ?? true,
                    'is_allow_custom_text' => $option['is_allow_custom_text'] ?? false,
                    'sequence_number' => $index + 1,
                ]
            );
        }
    }
}
