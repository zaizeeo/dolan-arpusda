<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['label', 'text', 'is_active'])]
class GuestBookQuestionOption extends Model
{
    use HasFactory, HasUuids;

    public function question()
    {
        return $this->belongsTo(GuestBookQuestion::class);
    }

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
