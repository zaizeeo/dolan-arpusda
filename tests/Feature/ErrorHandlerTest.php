<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Inertia\Testing\AssertableInertia;
use RuntimeException;
use Tests\TestCase;

class ErrorHandlerTest extends TestCase
{
    public function test_inertia_request_to_missing_route_renders_not_found_page(): void
    {
        $response = $this->get('/halaman-tidak-ada', ['X-Inertia' => 'true']);

        $response->assertStatus(404);
        $response->assertJsonPath('component', 'errors/404');
        $response->assertJsonPath('props.status', 404);
    }

    public function test_browser_request_to_missing_route_renders_not_found_page(): void
    {
        $response = $this->get('/halaman-tidak-ada');

        $response->assertStatus(404);
        $response->assertInertia(fn (AssertableInertia $page) => $page->component('errors/404'));
    }

    public function test_inertia_request_with_unexpected_error_renders_error_page(): void
    {
        Route::get('/konten-rusak', fn () => throw new RuntimeException('Konten rusak'));

        $response = $this->get('/konten-rusak', ['X-Inertia' => 'true']);

        $response->assertStatus(500);
        $response->assertJsonPath('component', 'errors/500');
        $response->assertJsonPath('props.status', 500);
    }

    public function test_api_request_to_missing_route_returns_standard_json_error(): void
    {
        $response = $this->getJson('/_api/tidak-ada');

        $response->assertStatus(404);
        $response->assertJson([
            'success' => false,
            'message' => 'Data atau halaman yang kamu cari tidak ditemukan',
            'errors' => [
                'server' => ['Data atau halaman yang kamu cari tidak ditemukan'],
            ],
        ]);
    }

    public function test_api_request_with_unexpected_error_returns_standard_json_error(): void
    {
        Route::post('/_api/konten-rusak', fn () => throw new RuntimeException('Konten rusak'));

        $response = $this->postJson('/_api/konten-rusak');

        $response->assertStatus(500);
        $response->assertJson([
            'success' => false,
            'message' => 'Terjadi kesalahan pada server, coba lagi beberapa saat',
            'errors' => [
                'server' => ['Terjadi kesalahan pada server, coba lagi beberapa saat'],
            ],
        ]);
    }

    public function test_api_validation_error_returns_validation_message(): void
    {
        $response = $this->postJson('/_api/auth/login', []);

        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
            'message' => 'Email harus diisi',
            'errors' => [
                'email' => ['Email harus diisi'],
                'server' => ['Email harus diisi'],
            ],
        ]);
    }

    public function test_inertia_request_to_api_route_keeps_redirect_with_validation_errors(): void
    {
        $response = $this->from('/auth')->post('/_api/auth/login', [], ['X-Inertia' => 'true']);

        $response->assertRedirect('/auth');
        $response->assertSessionHasErrors('server', 'Email harus diisi');
    }
}
