<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BukuTamu extends Model
{
    use HasFactory;

    protected $table = 'buku_tamu';

    protected $fillable = [
        'nama_pengunjung',
        'jenis_kelamin',
        'pendidikan_terakhir',
        'pekerjaan',
        'alamat',
        'keperluan_layanan'
    ];
}
