<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('buku_tamu', function (Blueprint $table) {
            $table->id();
            $table->string('nama_pengunjung');
            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan']);
            $table->enum('pendidikan_terakhir', ['TK', 'SD', 'SMP', 'SMA/SLTA/SMK', 'D3', 'S1', 'S2']);
            $table->enum('pekerjaan', ['PNS', 'TNI/POLRI', 'Guru', 'Swasta', 'BUMN/BUMD', 'Mahasiswa', 'Lainnya']);
            $table->string('alamat');
            $table->enum('keperluan_layanan', ['Bimbingan/Konsultasi', 'Peminjaman Arsip', 'Penelusuran Arsip', 'Kunjungan/ Wisata Arsip', 'Penyerahan Arsip', 'Lainnya']);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('buku_tamu');
    }
};
