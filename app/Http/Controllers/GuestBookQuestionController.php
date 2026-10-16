<?php

namespace App\Http\Controllers;

use App\Models\GuestBookQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class GuestBookQuestionController extends Controller
{
    public function index()
    {
        $questions = GuestBookQuestion::with(['options' => fn($query) => $query->orderBy('sequence_number', 'asc')])->orderBy('sequence_number', 'asc')->get();
        return Inertia::render('dashboard/management/guest-book/question', ['questions' => $questions]);
    }
}
