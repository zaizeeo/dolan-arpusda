<?php

namespace Tests\Feature;

use App\Exports\GuestBookExport;
use App\Models\GuestBook;
use App\Models\GuestBookAnswer;
use App\Models\GuestBookQuestion;
use App\Models\GuestBookQuestionOption;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Maatwebsite\Excel\Facades\Excel;
use Tests\TestCase;

class GuestBookExportTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => 'admin']);
    }

    public function test_admin_can_download_guest_book_export(): void
    {
        Excel::fake();

        $this->actingAs($this->admin())
            ->get(route('guest-book-export'))
            ->assertOk();

        Excel::assertDownloaded('buku-tamu.xlsx');
    }

    public function test_guest_book_export_returns_an_excel_file(): void
    {
        $this->actingAs($this->admin())
            ->get(route('guest-book-export'))
            ->assertOk()
            ->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    public function test_guest_book_export_uses_question_labels_as_columns(): void
    {
        $nameQuestion = GuestBookQuestion::factory()->create(['label' => 'Nama', 'sequence_number' => 1]);
        $genderQuestion = GuestBookQuestion::factory()->create(['label' => 'Jenis Kelamin', 'sequence_number' => 2]);
        $maleOption = GuestBookQuestionOption::factory()->create([
            'guest_book_question_id' => $genderQuestion->id,
            'label' => 'Laki-Laki',
            'sequence_number' => 1,
        ]);

        $guestBook = GuestBook::factory()->create(['created_at' => '2026-11-09 10:15:00']);

        GuestBookAnswer::factory()->create([
            'guest_book_id' => $guestBook->id,
            'guest_book_question_id' => $nameQuestion->id,
            'custom_text' => 'Budi',
        ]);

        GuestBookAnswer::factory()->create([
            'guest_book_id' => $guestBook->id,
            'guest_book_question_id' => $genderQuestion->id,
            'guest_book_question_option_id' => $maleOption->id,
        ]);

        $export = new GuestBookExport;

        $this->assertSame(['No', 'Tanggal', 'Nama', 'Jenis Kelamin'], $export->headings());
        $this->assertSame([1, '09/11/2026 10:15', 'Budi', 'Laki-Laki'], $export->collection()->first());
    }

    public function test_guest_book_export_combines_option_with_custom_text(): void
    {
        $question = GuestBookQuestion::factory()->create(['label' => 'Pekerjaan', 'sequence_number' => 1]);
        $option = GuestBookQuestionOption::factory()->create([
            'guest_book_question_id' => $question->id,
            'label' => 'Lainnya',
            'sequence_number' => 1,
        ]);

        $guestBook = GuestBook::factory()->create(['created_at' => '2026-11-09 10:15:00']);

        GuestBookAnswer::factory()->create([
            'guest_book_id' => $guestBook->id,
            'guest_book_question_id' => $question->id,
            'guest_book_question_option_id' => $option->id,
            'custom_text' => 'Petani',
        ]);

        $export = new GuestBookExport;

        $this->assertSame('Lainnya (Petani)', $export->collection()->first()[2]);
    }

    public function test_guest_book_export_filters_by_date_range(): void
    {
        $question = GuestBookQuestion::factory()->create(['label' => 'Nama', 'sequence_number' => 1]);

        $inside = GuestBook::factory()->create(['created_at' => '2026-11-05 09:00:00']);
        $outside = GuestBook::factory()->create(['created_at' => '2026-11-08 09:00:00']);

        foreach ([$inside, $outside] as $index => $guestBook) {
            GuestBookAnswer::factory()->create([
                'guest_book_id' => $guestBook->id,
                'guest_book_question_id' => $question->id,
                'custom_text' => "Pengunjung {$index}",
            ]);
        }

        $export = new GuestBookExport(
            Carbon::parse('2026-11-04'),
            Carbon::parse('2026-11-06'),
        );

        $rows = $export->collection();

        $this->assertCount(1, $rows);
        $this->assertSame('Pengunjung 0', $rows->first()[2]);
    }

    public function test_guest_book_export_rejects_an_end_date_before_the_start_date(): void
    {
        $this->actingAs($this->admin())
            ->get(route('guest-book-export', [
                'start_date' => '2026-11-10',
                'end_date' => '2026-11-01',
            ]))
            ->assertSessionHasErrors('end_date');
    }

    public function test_intern_cannot_download_guest_book_export(): void
    {
        $intern = User::factory()->create(['role' => 'intern']);

        $this->actingAs($intern)
            ->get(route('guest-book-export'))
            ->assertRedirect(route('guest-book-statistics-index'));
    }
}
