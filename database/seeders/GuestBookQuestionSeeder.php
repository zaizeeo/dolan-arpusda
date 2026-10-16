<?php

namespace Database\Seeders;

use App\Models\GuestBookQuestion;
use App\Models\GuestBookQuestionOption;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class GuestBookQuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        GuestBookQuestion::create([
            'label' => 'Nama',
            'description' => 'Isi Namamu',
            'sequence_number' => 1,
        ]);

        $gender = GuestBookQuestion::create([
            'label' => 'Jenis Kelamin',
            'description' => 'Isi Jenis Kelamin',
            'sequence_number' => 2,
        ]);

        $rawData = ['Laki-Laki', 'Perempuan'];

        $data = array_map(function ($item, $index) use ($gender) {
            return [
                'id' => (string) Str::orderedUuid(),
                'guest_book_question_id' => $gender->id,
                'label' => $item,
                'sequence_number' => $index + 1,
            ];
        }, $rawData, array_keys($rawData));

        GuestBookQuestionOption::insert($data);

        $educationHistory = GuestBookQuestion::create([
            'label' => 'Pendidikan Terakhir',
            'description' => 'Isi Pendidikan Terakhir',
            'sequence_number' => 3,
        ]);

        $rawData = ['TK', 'SD', 'SMP', 'SMA/SLTA/SMK', 'D3', 'S1', 'S2', 'S3'];

        $data = array_map(function ($item, $index) use ($educationHistory) {
            return [
                'id' => (string) Str::orderedUuid(),
                'guest_book_question_id' => $educationHistory->id,
                'label' => $item,
                'sequence_number' => $index + 1,
            ];
        }, $rawData, array_keys($rawData));

        GuestBookQuestionOption::insert($data);

        $job = GuestBookQuestion::create([
            'label' => 'Pekerjaan',
            'description' => 'Isi Pekerjaan',
            'sequence_number' => 4,
        ]);

        $rawData = ['PNS', 'TNI/POLRI', 'Guru', 'Karyawan Swasta', 'BUMN/BUMD', 'Pensiunan', 'Pelajar', 'Mahasiswa', 'Ibu Rumah Tangga', 'Dosen', 'Lainnya'];

        $data = array_map(function ($item, $index) use ($job) {
            return [
                'id' => (string) Str::orderedUuid(),
                'guest_book_question_id' => $job->id,
                'label' => $item,
                'sequence_number' => $index + 1,
                'is_active' => $item !== 'Dosen',
                'is_allow_custom_text' => $item === 'Lainnya',
            ];
        }, $rawData, array_keys($rawData));

        GuestBookQuestionOption::insert($data);

        GuestBookQuestion::create([
            'label' => 'Alamat',
            'sequence_number' => 5,
        ]);

        $needs = GuestBookQuestion::create([
            'label' => 'Keperluan Layanan',
            'sequence_number' => 6,
        ]);

        $rawData = ['Bimbingan/Konsultasi', 'Peminjaman Arsip', 'Penelusuran Arsip', 'Kunjungan/ Wisata Arsip', 'Penyerahan Arsip', 'Lainnya'];

        $data = array_map(function ($item, $index) use ($needs) {
            return [
                'id' => (string) Str::orderedUuid(),
                'guest_book_question_id' => $needs->id,
                'label' => $item,
                'sequence_number' => $index + 1,
                'is_allow_custom_text' => $item === 'Lainnya',
            ];
        }, $rawData, array_keys($rawData));

        GuestBookQuestionOption::insert($data);
    }
}
