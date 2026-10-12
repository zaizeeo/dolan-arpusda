<?php

namespace App\Exceptions;

use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Inertia\ExceptionResponse;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class ErrorHandler
{
    /**
     * Menangani response standar untuk exception pada request Inertia dan request API (/_api).
     */
    public function __invoke(ExceptionResponse $response): ?Response
    {
        if ($response->request->is('_api/*')) {
            return $this->handleApiRequest($response);
        }

        return $this->handleInertiaRequest($response);
    }

    /**
     * Menangani error pada request API dengan format JSON standar,
     * sehingga frontend cukup membaca pesan dari errors.server[0].
     */
    protected function handleApiRequest(ExceptionResponse $response): ?Response
    {
        $errors = $this->resolveValidationErrors($response->exception);

        // Request Inertia menuju route _api (mis. login) tetap memakai perilaku bawaan
        // Laravel: redirect ke halaman sebelumnya dengan membawa errors di session.
        if ($response->exception instanceof ValidationException && ! $response->response instanceof JsonResponse) {
            return null;
        }

        $statusCode = $response->statusCode();
        $message = $errors['server'][0] ?? $this->standardMessage($statusCode);

        return new JsonResponse([
            'success' => false,
            'message' => $message,
            'errors' => ['server' => [$message], ...$errors],
        ], $statusCode);
    }

    /**
     * Menangani error pada request halaman Inertia dengan merender komponen error
     * khusus (errors/404 untuk not found, errors/500 untuk error tak terduga lainnya).
     */
    protected function handleInertiaRequest(ExceptionResponse $response): ?Response
    {
        if ($response->request->expectsJson()) {
            return null;
        }

        $statusCode = $response->statusCode();
        $component = $statusCode === 404 ? 'errors/404' : 'errors/500';

        return $response
            ->render($component, [
                'status' => $statusCode,
                'message' => $this->standardMessage($statusCode),
            ])
            ->withSharedData()
            ->toResponse($response->request);
    }

    /**
     * Mengambil daftar pesan error validasi, termasuk ringkasan pesan pada key "server".
     *
     * @return array<string, array<int, string>>
     */
    protected function resolveValidationErrors(Throwable $exception): array
    {
        if (! $exception instanceof ValidationException) {
            return [];
        }

        $errors = $exception->errors();
        $errors['server'] ??= [collect($errors)->flatten()->first() ?? $this->standardMessage(422)];

        return $errors;
    }

    /**
     * Menyusun pesan error standar berdasarkan status code response.
     */
    protected function standardMessage(int $statusCode): string
    {
        return match (true) {
            $statusCode === 401 => 'Silakan login terlebih dahulu',
            $statusCode === 403 => 'Maaf, kamu tidak memiliki akses untuk melakukan aksi ini',
            $statusCode === 404 => 'Data atau halaman yang kamu cari tidak ditemukan',
            $statusCode === 405 => 'Metode request tidak diizinkan',
            $statusCode === 419 => 'Sesi halaman telah berakhir, muat ulang halaman lalu coba lagi',
            $statusCode === 422 => 'Data yang dikirim tidak valid',
            $statusCode === 429 => 'Terlalu banyak permintaan, silakan coba lagi beberapa saat',
            $statusCode >= 500 => 'Terjadi kesalahan pada server, coba lagi beberapa saat',
            default => 'Terjadi kesalahan, silakan coba lagi beberapa saat',
        };
    }
}
