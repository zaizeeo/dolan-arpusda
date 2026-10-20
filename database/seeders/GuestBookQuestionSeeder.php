<?php

namespace Database\Seeders;

use App\Models\GuestBookQuestion;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GuestBookQuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::transaction(function () {
            $this->createQuestion(1, 'Nama', 'Isi Namamu');

            $this->createQuestion(2, 'Jenis Kelamin', 'Isi Jenis Kelamin', [
                ['label' => 'Laki-Laki'],
                ['label' => 'Perempuan'],
            ]);

            $this->createQuestion(3, 'Pendidikan Terakhir', 'Isi Pendidikan Terakhir', [
                ['label' => 'TK'],
                ['label' => 'SD'],
                ['label' => 'SMP'],
                ['label' => 'SMA/SLTA/SMK'],
                ['label' => 'D3'],
                ['label' => 'S1'],
                ['label' => 'S2'],
                ['label' => 'S3'],
            ]);

            $this->createQuestion(4, 'Pekerjaan', 'Isi Pekerjaan', [
                ['label' => 'PNS'],
                ['label' => 'TNI/POLRI'],
                ['label' => 'Guru'],
                ['label' => 'Karyawan Swasta'],
                ['label' => 'BUMN/BUMD'],
                ['label' => 'Pensiunan'],
                ['label' => 'Pelajar'],
                ['label' => 'Mahasiswa'],
                ['label' => 'Ibu Rumah Tangga'],
                ['label' => 'Dosen', 'is_active' => false],
                ['label' => 'Lainnya', 'is_allow_custom_text' => true],
            ]);

            $this->createQuestion(5, 'Alamat');

            $this->createQuestion(6, 'Keperluan Layanan', null, [
                ['label' => 'Bimbingan/Konsultasi'],
                ['label' => 'Peminjaman Arsip'],
                ['label' => 'Penelusuran Arsip'],
                ['label' => 'Kunjungan/Wisata Arsip'],
                ['label' => 'Penyerahan Arsip'],
                ['label' => 'Lainnya', 'is_allow_custom_text' => true],
            ]);
        });
    }

    /**
     * Create a guest book question together with its options.
     *
     * @param  array<int, array{label: string, description?: string|null, is_active?: bool, is_allow_custom_text?: bool}>  $options
     */
    private function createQuestion(int $sequenceNumber, string $label, ?string $description = null, array $options = []): void
    {
        $question = GuestBookQuestion::firstOrCreate(
            ['sequence_number' => $sequenceNumber],
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
