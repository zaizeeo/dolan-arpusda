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
        ]);

        $gender = GuestBookQuestion::create([
            'label' => 'Jenis Kelamin',
            'description' => 'Isi Jenis Kelamin',
        ]);

        $rawData = ['Laki-Laki', 'Perempuan'];

        $data = array_map(function ($item) use ($gender) {
            return [
                'id' => (string) Str::orderedUuid(),
                'guest_book_question_id' => $gender->id,
                'label' => $item,
            ];
        }, $rawData);

        GuestBookQuestionOption::insert($data);

        $educationHistory = GuestBookQuestion::create([
            'label' => 'Pendidikan Terakhir',
            'description' => 'Isi Pendidikan Terakhir',
        ]);

        $rawData = ['TK', 'SD', 'SMP', 'SMA/SLTA/SMK', 'D3', 'S1', 'S2', 'S3'];

        $data = array_map(function ($item) use ($educationHistory) {
            return [
                'id' => (string) Str::orderedUuid(),
                'guest_book_question_id' => $educationHistory->id,
                'label' => $item,
            ];
        }, $rawData);

        GuestBookQuestionOption::insert($data);

        $job = GuestBookQuestion::create([
            'label' => 'Pekerjaan',
            'description' => 'Isi Pekerjaan',
        ]);

        $rawData = ['PNS', 'TNI/POLRI', 'Guru', 'Karyawan Swasta', 'BUMN/BUMD', 'Pensiunan', 'Pelajar', 'Mahasiswa', 'Ibu Rumah Tangga', 'Lainnya'];

        $data = array_map(function ($item) use ($job) {
            return [
                'id' => (string) Str::orderedUuid(),
                'guest_book_question_id' => $job->id,
                'label' => $item,
                'is_allow_custom_text' => $item === 'Lainnya',
            ];
        }, $rawData);

        GuestBookQuestionOption::insert($data);

        GuestBookQuestion::create([
            'label' => 'Alamat',
        ]);

        $needs = GuestBookQuestion::create([
            'label' => 'Keperluan Layanan',
        ]);

        $rawData = ['Bimbingan/Konsultasi', 'Peminjaman Arsip', 'Penelusuran Arsip', 'Kunjungan/ Wisata Arsip', 'Penyerahan Arsip', 'Lainnya'];

        $data = array_map(function ($item) use ($needs) {
            return [
                'id' => (string) Str::orderedUuid(),
                'guest_book_question_id' => $needs->id,
                'label' => $item,
                'is_allow_custom_text' => $item === 'Lainnya',
            ];
        }, $rawData);

        GuestBookQuestionOption::insert($data);
    }
}
