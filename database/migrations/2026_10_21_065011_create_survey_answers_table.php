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
        Schema::create('survey_answers', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('survey_response_id');
            $table->string('survey_question_id');
            $table->string('survey_question_option_id')->nullable();
            $table->text('custom_text')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('survey_response_id')->references('id')->on('survey_responses')->cascadeOnDelete();
            $table->foreign('survey_question_id')->references('id')->on('survey_questions');
            $table->foreign('survey_question_option_id')->references('id')->on('survey_question_options');
            $table->unique(['survey_response_id', 'survey_question_id']);
            $table->index('survey_question_id');
            $table->index('survey_question_option_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('survey_answers');
    }
};
