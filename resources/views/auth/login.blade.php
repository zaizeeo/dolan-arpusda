<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Admin - Dolan Arpusda</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gray-100 min-h-screen flex items-center justify-center py-10 px-4">

    <div class="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">

        <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-gray-900">Login Admin</h2>
            <p class="text-gray-500 mt-2 text-sm">Masuk untuk melihat data kunjungan</p>
        </div>

        <!-- Menampilkan pesan error jika login salah -->
        @if ($errors->any())
            <div class="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
                {{ $errors->first() }}
            </div>
        @endif

        <form action="{{ route('login') }}" method="POST" class="space-y-5">
            @csrf

            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Alamat Email</label>
                <input type="email" name="email" required autofocus class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all">
            </div>

            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <input type="password" name="password" required class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all">
            </div>

            <div class="pt-2">
                <button type="submit" class="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all">
                    Masuk ke Dasbor
                </button>
            </div>
        </form>

        <div class="mt-6 text-center">
            <a href="{{ url('/') }}" class="text-sm text-blue-600 hover:underline">← Kembali ke Halaman Buku Tamu</a>
        </div>
    </div>

</body>
</html>
