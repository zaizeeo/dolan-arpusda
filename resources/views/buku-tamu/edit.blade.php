<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Data Kunjungan - Dolan Arpusda</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="relative min-h-screen bg-gray-100 py-10 px-4 flex justify-center items-center antialiased overflow-x-hidden">

    <!-- BACKGROUND MOTIF BUKU -->
    <div class="fixed inset-0 z-0 pointer-events-none opacity-15 bg-center"
         style="background-image: url('{{ asset('images/motif-buku.jpg') }}'); background-size: cover; background-repeat: no-repeat;">
    </div>

    <div class="relative z-10 w-full max-w-2xl bg-white/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/60">

        <div class="flex justify-between items-center mb-8 pb-4 border-b border-gray-200/60">
            <h2 class="text-2xl font-bold text-gray-900">Edit Data Pengunjung</h2>
            <a href="{{ route('buku-tamu.index') }}" class="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
                ✕ Batal
            </a>
        </div>

        <form action="{{ route('buku-tamu.update', $bukuTamu->id) }}" method="POST" class="space-y-5">
            @csrf
            @method('PUT')

            <div>
                <label class="block text-sm font-semibold text-gray-800 mb-1.5">Nama Pengunjung</label>
                <input type="text" name="nama_pengunjung" value="{{ $bukuTamu->nama_pengunjung }}" required class="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all shadow-sm">
            </div>

            <div>
                <label class="block text-sm font-semibold text-gray-800 mb-2">Jenis Kelamin</label>
                <div class="flex space-x-4">
                    <label class="flex items-center p-3.5 bg-white/90 border border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 transition-all w-1/2">
                        <input type="radio" name="jenis_kelamin" value="Laki-laki" {{ $bukuTamu->jenis_kelamin == 'Laki-laki' ? 'checked' : '' }} required class="w-4 h-4 text-blue-600 border-gray-300">
                        <span class="ml-3 text-sm font-medium text-gray-800">Laki-laki</span>
                    </label>
                    <label class="flex items-center p-3.5 bg-white/90 border border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 transition-all w-1/2">
                        <input type="radio" name="jenis_kelamin" value="Perempuan" {{ $bukuTamu->jenis_kelamin == 'Perempuan' ? 'checked' : '' }} required class="w-4 h-4 text-blue-600 border-gray-300">
                        <span class="ml-3 text-sm font-medium text-gray-800">Perempuan</span>
                    </label>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-semibold text-gray-800 mb-1.5">Pendidikan Terakhir</label>
                    <select name="pendidikan_terakhir" required class="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all shadow-sm text-sm">
                        <option value="TK" {{ $bukuTamu->pendidikan_terakhir == 'TK' ? 'selected' : '' }}>TK</option>
                        <option value="SD" {{ $bukuTamu->pendidikan_terakhir == 'SD' ? 'selected' : '' }}>SD</option>
                        <option value="SMP" {{ $bukuTamu->pendidikan_terakhir == 'SMP' ? 'selected' : '' }}>SMP</option>
                        <option value="SMA/SLTA/SMK" {{ $bukuTamu->pendidikan_terakhir == 'SMA/SLTA/SMK' ? 'selected' : '' }}>SMA/SLTA/SMK</option>
                        <option value="D3" {{ $bukuTamu->pendidikan_terakhir == 'D3' ? 'selected' : '' }}>D3</option>
                        <option value="S1" {{ $bukuTamu->pendidikan_terakhir == 'S1' ? 'selected' : '' }}>S1</option>
                        <option value="S2" {{ $bukuTamu->pendidikan_terakhir == 'S2' ? 'selected' : '' }}>S2</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-800 mb-1.5">Pekerjaan</label>
                    <select name="pekerjaan" required class="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all shadow-sm text-sm">
                        <option value="PNS" {{ $bukuTamu->pekerjaan == 'PNS' ? 'selected' : '' }}>PNS</option>
                        <option value="TNI/POLRI" {{ $bukuTamu->pekerjaan == 'TNI/POLRI' ? 'selected' : '' }}>TNI/POLRI</option>
                        <option value="Guru" {{ $bukuTamu->pekerjaan == 'Guru' ? 'selected' : '' }}>Guru</option>
                        <option value="Swasta" {{ $bukuTamu->pekerjaan == 'Swasta' ? 'selected' : '' }}>Swasta</option>
                        <option value="BUMN/BUMD" {{ $bukuTamu->pekerjaan == 'BUMN/BUMD' ? 'selected' : '' }}>BUMN/BUMD</option>
                        <option value="Mahasiswa" {{ $bukuTamu->pekerjaan == 'Mahasiswa' ? 'selected' : '' }}>Mahasiswa</option>
                        <option value="Lainnya" {{ $bukuTamu->pekerjaan == 'Lainnya' ? 'selected' : '' }}>Lainnya</option>
                    </select>
                </div>
            </div>

            <div>
                <label class="block text-sm font-semibold text-gray-800 mb-1.5">Alamat</label>
                <textarea name="alamat" rows="2" required class="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all shadow-sm text-sm">{{ $bukuTamu->alamat }}</textarea>
            </div>

            <div>
                <label class="block text-sm font-semibold text-gray-800 mb-1.5">Keperluan Layanan</label>
                <select name="keperluan_layanan" required class="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all shadow-sm text-sm">
                    <option value="Bimbingan/Konsultasi" {{ $bukuTamu->keperluan_layanan == 'Bimbingan/Konsultasi' ? 'selected' : '' }}>Bimbingan/Konsultasi</option>
                    <option value="Peminjaman Arsip" {{ $bukuTamu->keperluan_layanan == 'Peminjaman Arsip' ? 'selected' : '' }}>Peminjaman Arsip</option>
                    <option value="Penelusuran Arsip" {{ $bukuTamu->keperluan_layanan == 'Penelusuran Arsip' ? 'selected' : '' }}>Penelusuran Arsip</option>
                    <option value="Kunjungan/ Wisata Arsip" {{ $bukuTamu->keperluan_layanan == 'Kunjungan/ Wisata Arsip' ? 'selected' : '' }}>Kunjungan/ Wisata Arsip</option>
                    <option value="Penyerahan Arsip" {{ $bukuTamu->keperluan_layanan == 'Penyerahan Arsip' ? 'selected' : '' }}>Penyerahan Arsip</option>
                    <option value="Lainnya" {{ $bukuTamu->keperluan_layanan == 'Lainnya' ? 'selected' : '' }}>Lainnya</option>
                </select>
            </div>

            <div class="pt-4">
                <button type="submit" class="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1">
                    Simpan Perubahan
                </button>
            </div>
        </form>
    </div>

</body>
</html>
