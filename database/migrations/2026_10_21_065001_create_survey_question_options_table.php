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
        Schema::create('survey_question_options', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('survey_question_id');
            $table->string('label')->index();
            $table->string('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_allow_custom_text')->default(false);
            $table->integer('sequence_number')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('survey_question_id')->references('id')->on('survey_questions')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('survey_question_options');
    }
};
