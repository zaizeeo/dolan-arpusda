<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data Pengunjung - Dolan Arpusda</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="relative min-h-screen bg-gray-100 py-10 px-4 sm:px-10 antialiased overflow-x-hidden">

    <!-- BACKGROUND MOTIF BUKU -->
    <div class="fixed inset-0 z-0 pointer-events-none opacity-15 bg-center"
         style="background-image: url('{{ asset('images/motif-buku.jpg') }}'); background-size: cover; background-repeat: no-repeat;">
    </div>

    <!-- KONTEN UTAMA -->
    <div class="relative z-10 max-w-7xl mx-auto">

        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/60">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Data Kunjungan</h1>
                <p class="text-gray-700 mt-1 font-medium">Daftar pengunjung Dolan Arpusda Kab. Banyumas</p>
            </div>

            <div class="flex space-x-3">
                <a href="{{ url('/') }}" target="_blank" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-xl shadow transition-all hover:-translate-y-0.5">
                    + Buka Form
                </a>

                <form action="{{ route('logout') }}" method="POST">
                    @csrf
                    <button type="submit" class="bg-white hover:bg-red-50 text-red-600 border border-red-200 font-medium py-2.5 px-5 rounded-xl shadow-sm transition-all hover:-translate-y-0.5">
                        Logout
                    </button>
                </form>
            </div>
        </div>

        <!-- Notifikasi -->
        @if(session('success'))
            <div class="bg-emerald-100/90 backdrop-blur-sm border-l-4 border-emerald-500 text-emerald-800 p-4 mb-6 rounded-r-xl shadow-sm" role="alert">
                <p class="font-medium">{{ session('success') }}</p>
            </div>
        @endif

        <!-- Tabel Data -->
        <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-white/60 text-gray-800 text-sm uppercase tracking-wider border-b border-gray-200/60">
                            <th class="py-5 px-6 font-bold whitespace-nowrap">Waktu</th>
                            <th class="py-5 px-6 font-bold whitespace-nowrap">Nama Pengunjung</th>
                            <th class="py-5 px-6 font-bold text-center whitespace-nowrap">L/P</th>
                            <th class="py-5 px-6 font-bold whitespace-nowrap">Pendidikan</th>
                            <th class="py-5 px-6 font-bold whitespace-nowrap">Pekerjaan</th>
                            <th class="py-5 px-6 font-bold whitespace-nowrap">Keperluan</th>
                            <th class="py-5 px-6 font-bold text-center whitespace-nowrap">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-700 divide-y divide-gray-200/60">
                        @forelse($data_pengunjung as $tamu)
                        <tr class="hover:bg-white/60 transition-colors">
                            <td class="py-4 px-6 text-sm whitespace-nowrap">{{ $tamu->created_at->format('d/m/Y H:i') }}</td>
                            <td class="py-4 px-6 font-semibold text-gray-900 whitespace-nowrap">{{ $tamu->nama_pengunjung }}</td>
                            <td class="py-4 px-6 text-sm text-center font-medium">{{ $tamu->jenis_kelamin == 'Laki-laki' ? 'L' : 'P' }}</td>
                            <td class="py-4 px-6 text-sm whitespace-nowrap">{{ $tamu->pendidikan_terakhir }}</td>
                            <td class="py-4 px-6 text-sm whitespace-nowrap">{{ $tamu->pekerjaan }}</td>
                            <td class="py-4 px-6 text-sm whitespace-nowrap">
                                <span class="bg-blue-100/80 text-blue-800 py-1.5 px-3 rounded-full text-xs font-bold border border-blue-200">
                                    {{ $tamu->keperluan_layanan }}
                                </span>
                            </td>
                            <td class="py-4 px-6">
                                <div class="flex items-center justify-center space-x-2">
                                    <a href="{{ route('buku-tamu.edit', $tamu->id) }}" class="text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 py-1.5 px-4 rounded-lg text-sm transition-all font-semibold shadow-sm hover:shadow-md">
                                        Edit
                                    </a>

                                    <form action="{{ route('buku-tamu.destroy', $tamu->id) }}" method="POST" onsubmit="return confirm('Apakah Anda yakin ingin menghapus data {{ $tamu->nama_pengunjung }}?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="text-red-600 hover:text-white bg-red-50 hover:bg-red-500 border border-red-100 hover:border-red-500 py-1.5 px-4 rounded-lg text-sm transition-all font-semibold shadow-sm hover:shadow-md">
                                            Hapus
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="7" class="py-12 text-center text-gray-500 font-medium">
                                Belum ada data pengunjung yang tercatat.
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</body>
</html>
