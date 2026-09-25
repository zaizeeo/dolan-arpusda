<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BukuTamu;

class BukuTamuController extends Controller
{
    // Fungsi baru untuk menampilkan tabel pengunjung
    public function index()
    {
        // Mengambil semua data dari database, diurutkan dari yang paling baru
        $data_pengunjung = BukuTamu::orderBy('created_at', 'desc')->get();

        return view('buku-tamu.index', compact('data_pengunjung'));
    }

    public function create()
    {
        return view('buku-tamu.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_pengunjung' => 'required',
            'jenis_kelamin' => 'required',
            'pendidikan_terakhir' => 'required',
            'pekerjaan' => 'required',
            'alamat' => 'required',
            'keperluan_layanan' => 'required',
        ]);

        BukuTamu::create($request->all());

        return back()->with('success', 'Terima kasih, data kunjungan Anda berhasil disimpan!');
    }
// Fungsi untuk menghapus data pengunjung
    public function destroy($id)
    {
        $bukuTamu = BukuTamu::findOrFail($id);
        $bukuTamu->delete();

        return back()->with('success', 'Data pengunjung berhasil dihapus!');
    }
// Menampilkan halaman form edit
    public function edit($id)
    {
        $bukuTamu = BukuTamu::findOrFail($id);
        return view('buku-tamu.edit', compact('bukuTamu'));
    }

// Memproses penyimpanan data yang diedit
    public function update(Request $request, $id)
    {
        $request->validate([
            'nama_pengunjung' => 'required',
            'jenis_kelamin' => 'required',
            'pendidikan_terakhir' => 'required',
            'pekerjaan' => 'required',
            'alamat' => 'required',
            'keperluan_layanan' => 'required',
        ]);

        $bukuTamu = BukuTamu::findOrFail($id);
        $bukuTamu->update($request->all());

        return redirect()->route('buku-tamu.index')->with('success', 'Data pengunjung berhasil diperbarui!');
    }
}
