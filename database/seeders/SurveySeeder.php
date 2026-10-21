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
        $surveyData = [
            'judul_survei' => 'SURVEI KEPUASAN MASYARAKAT TENTANG PELAYANAN KEARSIPAN - TAHUN 2026',
            'data_responden' => [
                [
                    'pertanyaan' => 'Nama',
                    'tipe' => 'teks',
                ],
                [
                    'pertanyaan' => 'Alamat/ Instansi',
                    'tipe' => 'teks',
                ],
                [
                    'pertanyaan' => 'Jenis Kelamin',
                    'tipe' => 'pilihan_ganda',
                    'opsi' => [
                        'Laki-laki',
                        'Perempuan',
                    ],
                ],
                [
                    'pertanyaan' => 'Pendidikan Terakhir',
                    'tipe' => 'pilihan_ganda',
                    'opsi' => [
                        'SD',
                        'SMP',
                        'SMA/SLTA',
                        'DIPLOMA',
                        'SARJANA',
                        'S2',
                        'Lainnya',
                    ],
                ],
                [
                    'pertanyaan' => 'Pekerjaan',
                    'tipe' => 'pilihan_ganda',
                    'opsi' => [
                        'PNS',
                        'TNI/POLRI',
                        'Dosen',
                        'Guru',
                        'Swasta',
                        'BUMN/BUMD',
                        'Mahasiswa',
                        'Pelajar',
                        'Lainnya',
                    ],
                ],
                [
                    'pertanyaan' => 'Keperluan Layanan',
                    'tipe' => 'pilihan_ganda',
                    'opsi' => [
                        'Bimbingan/ Konsultasi',
                        'Peminjaman Arsip',
                        'Penelusuran Arsip',
                        'Kunjungan/ Wisata Arsip',
                        'Penyerahan Arsip',
                        'Lainnya',
                    ],
                ],
            ],
            'pertanyaan_survei' => [
                [
                    'nomor' => 1,
                    'pertanyaan' => 'Bagaimana pendapat Saudara tentang kesesuaian persyaratan pelayanan dengan jenis pelayanannya?',
                    'opsi' => [
                        'Tidak Sesuai',
                        'Kurang Sesuai',
                        'Sesuai',
                        'Sangat Sesuai',
                    ],
                ],
                [
                    'nomor' => 2,
                    'pertanyaan' => 'Bagaimana pemahaman Saudara tentang kemudahan prosedur pelayanan di unit ini?',
                    'opsi' => [
                        'Tidak Mudah',
                        'Kurang Mudah',
                        'Mudah',
                        'Sangat Mudah',
                    ],
                ],
                [
                    'nomor' => 3,
                    'pertanyaan' => 'Bagaimana pendapat Saudara tentang kecepatan waktu dalam memberikan pelayanan?',
                    'opsi' => [
                        'Tidak Cepat',
                        'Kurang Cepat',
                        'Cepat',
                        'Sangat Cepat',
                    ],
                ],
                [
                    'nomor' => 4,
                    'pertanyaan' => 'Bagaimana pendapat Saudara tentang kewajaran biaya/tarif dalam pelayanan?',
                    'opsi' => [
                        'Sangat Mahal',
                        'Mahal',
                        'Murah',
                        'Gratis',
                    ],
                ],
                [
                    'nomor' => 5,
                    'pertanyaan' => 'Bagaimana pendapat Saudara tentang kesesuaian produk pelayanan antara yang tercantum dalam standar pelayanan dengan hasil yang diberikan?',
                    'opsi' => [
                        'Tidak Sesuai',
                        'Kurang Sesuai',
                        'Sesuai',
                        'Sangat Sesuai',
                    ],
                ],
                [
                    'nomor' => 6,
                    'pertanyaan' => 'Bagaimana pendapat Saudara tentang kompetensi/kemampuan petugas dalam pelayanan?',
                    'opsi' => [
                        'Tidak Kompeten',
                        'Kurang Kompeten',
                        'Kompeten',
                        'Sangat Kompeten',
                    ],
                ],
                [
                    'nomor' => 7,
                    'pertanyaan' => 'Bagaimana pendapat Saudara tentang perilaku petugas selama pelayanan terkait kesopanan dan keramahan?',
                    'opsi' => [
                        'Tidak Sopan dan Ramah',
                        'Kurang Sopan dan Ramah',
                        'Sopan dan Ramah',
                        'Sangat Sopan dan Ramah',
                    ],
                ],
                [
                    'nomor' => 8,
                    'pertanyaan' => 'Bagaimana pendapat Saudara tentang penanganan pengaduan pengguna layanan?',
                    'opsi' => [
                        'Tidak Ada',
                        'Ada Tetapi Tidak Berfungsi',
                        'Kurang Maksimal/ Kurang Baik',
                        'Dikelola Dengan Baik',
                    ],
                ],
                [
                    'nomor' => 9,
                    'pertanyaan' => 'Bagaimana pendapat Saudara tentang kualitas sarana dan prasarana?',
                    'opsi' => [
                        'Buruk',
                        'Sedang',
                        'Baik',
                        'Sangat Baik',
                    ],
                ],
            ],
        ];

        DB::transaction(function () use ($surveyData) {
            Survey::where('title', 'Survei Kepuasan Layanan Jeta Arsip')
                ->where('is_active', true)
                ->update(['is_active' => false]);

            $survey = Survey::updateOrCreate(
                ['title' => $surveyData['judul_survei']],
                [
                    'description' => 'Survei kepuasan masyarakat terhadap pelayanan kearsipan tahun 2026.',
                    'is_active' => true,
                ]
            );

            $sequenceNumber = 1;

            foreach ($surveyData['data_responden'] as $respondentQuestion) {
                $this->createQuestion(
                    $survey,
                    $sequenceNumber++,
                    $respondentQuestion['pertanyaan'],
                    $this->mapOptions($respondentQuestion['opsi'] ?? []),
                );
            }

            foreach ($surveyData['pertanyaan_survei'] as $surveyQuestion) {
                $this->createQuestion(
                    $survey,
                    $sequenceNumber++,
                    $surveyQuestion['pertanyaan'],
                    $this->mapOptions($surveyQuestion['opsi'] ?? []),
                );
            }
        });
    }

    /**
     * Create a survey question together with its options.
     *
     * @param  array<int, array{label: string}>  $options
     */
    private function createQuestion(Survey $survey, int $sequenceNumber, string $label, array $options = []): void
    {
        $question = SurveyQuestion::firstOrCreate(
            ['survey_id' => $survey->id, 'sequence_number' => $sequenceNumber],
            ['label' => $label, 'description' => null]
        );

        foreach ($options as $index => $option) {
            $question->options()->firstOrCreate(
                ['label' => $option['label']],
                [
                    'description' => null,
                    'is_active' => true,
                    'is_allow_custom_text' => false,
                    'sequence_number' => $index + 1,
                ]
            );
        }
    }

    /**
     * Convert a list of option labels into option payloads.
     *
     * @param  array<int, string>  $optionLabels
     * @return array<int, array{label: string}>
     */
    private function mapOptions(array $optionLabels): array
    {
        return array_map(fn (string $label) => ['label' => $label], $optionLabels);
    }
}
