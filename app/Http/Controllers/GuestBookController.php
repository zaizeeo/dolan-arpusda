<?php

namespace App\Http\Controllers;

use App\Models\GuestBook;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GuestBookController extends Controller
{
    public function index()
    {
        $guestBooks = GuestBook::with(['questions', 'options'])->get();
        return Inertia::render("dashboard/management/guest-book/index", compact("guestBooks"));
    }
}
