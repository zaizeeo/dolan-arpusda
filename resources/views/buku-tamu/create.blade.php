<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dolan Dinarpus - Banyumas</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="relative min-h-screen bg-gray-100 flex justify-center items-center py-10 px-4 antialiased overflow-x-hidden">

    <!-- BACKGROUND MOTIF BUKU -->
    <!-- Opacity diatur rendah (misal 10% atau 15%) agar form tetap mudah dibaca -->
    <div class="fixed inset-0 z-0 pointer-events-none opacity-15 bg-center"
         style="background-image: url('{{ asset('images/motif-buku.jpg') }}'); background-size: cover; background-repeat: no-repeat;">
    </div>>

    <!-- KOTAK FORMULIR (Efek Kaca) -->
    <!-- bg-white/70 membuat kotak transparan 70%, backdrop-blur-sm memberi efek buram halus di latar -->
    <div class="relative z-10 w-full max-w-2xl bg-white/70 backdrop-blur-sm p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/60">

        <div class="flex flex-col items-center text-center mb-10">
            <img src="{{ asset('images/logo-banyumas.png') }}" alt="Logo Banyumas" class="w-24 mb-4 drop-shadow-md">
            <h2 class="text-3xl font-bold text-gray-900 tracking-tight">Dolan Dinarpus</h2>
            <p class="text-gray-700 mt-2 font-medium">Dinas Arsip dan Perpustakaan Daerah Kab. Banyumas</p>
           <p class="mt-5 text-sm text-gray-500 italic">Silakan lengkapi data kunjungan Anda di bawah ini.</p>
        </div>

        @if(session('success'))
            <div class="bg-emerald-100/90 border-l-4 border-emerald-500 text-emerald-800 p-4 mb-8 rounded-r-lg" role="alert">
                <p class="font-semibold">{{ session('success') }}</p>
            </div>
        @endif

        <form action="{{ route('buku-tamu.store') }}" method="POST" class="space-y-6">
            @csrf

            <div>
                <label class="block text-sm font-semibold text-gray-800 mb-1.5">Nama Pengunjung <span class="text-red-500">*</span></label>
                <input type="text" name="nama_pengunjung" required placeholder="Masukkan nama lengkap" class="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all shadow-sm">
            </div>

            <div>
                <label class="block text-sm font-semibold text-gray-800 mb-2">Jenis Kelamin <span class="text-red-500">*</span></label>
                <div class="flex space-x-4">
                    <label class="flex items-center p-3.5 bg-white/90 border border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:shadow-md transition-all w-1/2">
                        <input type="radio" name="jenis_kelamin" value="Laki-laki" required class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300">
                        <span class="ml-3 text-sm font-medium text-gray-800">Laki-laki</span>
                    </label>
                    <label class="flex items-center p-3.5 bg-white/90 border border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:shadow-md transition-all w-1/2">
                        <input type="radio" name="jenis_kelamin" value="Perempuan" required class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300">
                        <span class="ml-3 text-sm font-medium text-gray-800">Perempuan</span>
                    </label>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-semibold text-gray-800 mb-1.5">Pendidikan Terakhir <span class="text-red-500">*</span></label>
                    <select name="pendidikan_terakhir" required class="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all shadow-sm text-sm">
                        <option value="" disabled selected>Pilih Pendidikan</option>
                        <option value="TK">TK</option>
                        <option value="SD">SD</option>
                        <option value="SMP">SMP</option>
                        <option value="SMA/SLTA/SMK">SMA/SLTA/SMK</option>
                        <option value="D3">D3</option>
                        <option value="S1">S1</option>
                        <option value="S2">S2</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-800 mb-1.5">Pekerjaan <span class="text-red-500">*</span></label>
                    <select name="pekerjaan" required class="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all shadow-sm text-sm">
                        <option value="" disabled selected>Pilih Pekerjaan</option>
                        <option value="PNS">PNS</option>
                        <option value="TNI/POLRI">TNI/POLRI</option>
                        <option value="Guru">Guru</option>
                        <option value="Swasta">Swasta</option>
                        <option value="BUMN/BUMD">BUMN/BUMD</option>
                        <option value="Mahasiswa">Mahasiswa</option>
                        <option value="Lainnya">Lainnya</option>
                    </select>
                </div>
            </div>

            <div>
                <label class="block text-sm font-semibold text-gray-800 mb-1.5">Alamat <span class="text-red-500">*</span></label>
                <textarea name="alamat" rows="2" required placeholder="Contoh: Jl. Gatot Subroto No.1, Purwokerto" class="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all shadow-sm text-sm"></textarea>
            </div>

            <div>
                <label class="block text-sm font-semibold text-gray-800 mb-1.5">Keperluan Layanan <span class="text-red-500">*</span></label>
                <select name="keperluan_layanan" required class="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all shadow-sm text-sm">
                    <option value="" disabled selected>Pilih Keperluan Layanan</option>
                    <option value="Bimbingan/Konsultasi">Bimbingan/Konsultasi</option>
                    <option value="Peminjaman Arsip">Peminjaman Arsip</option>
                    <option value="Penelusuran Arsip">Penelusuran Arsip</option>
                    <option value="Kunjungan/ Wisata Arsip">Kunjungan/ Wisata Arsip</option>
                    <option value="Penyerahan Arsip">Penyerahan Arsip</option>
                    <option value="Lainnya">Lainnya</option>
                </select>
            </div>

            <div class="pt-6">
                <button type="submit" class="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1">
                    Simpan Data Kunjungan
                </button>
            </div>
        </form>
    </div>

</body>
</html>
