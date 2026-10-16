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
        Schema::create('guest_book_questions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('label')->index();
            $table->string('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sequence_number')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guest_book_questions');
    }
};
