<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('guest_book_answers', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignUuid('guest_book_id');
            $table->foreignUuid('guest_book_question_id');
            $table->text('custom_text')->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->unique(['guest_book_id', 'guest_book_question_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guest_book_answers');
    }
};
