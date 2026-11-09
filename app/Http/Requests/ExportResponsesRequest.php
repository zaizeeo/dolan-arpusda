<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ExportResponsesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $endDateRules = ['nullable', 'date'];

        if ($this->filled('start_date')) {
            $endDateRules[] = 'after_or_equal:start_date';
        }

        return [
            'start_date' => ['nullable', 'date'],
            'end_date' => $endDateRules,
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'start_date.date' => 'Tanggal mulai tidak valid.',
            'end_date.date' => 'Tanggal akhir tidak valid.',
            'end_date.after_or_equal' => 'Tanggal akhir tidak boleh lebih awal dari tanggal mulai.',
        ];
    }

    public function startDate(): ?Carbon
    {
        return $this->filled('start_date')
            ? Carbon::parse((string) $this->input('start_date'))->startOfDay()
            : null;
    }

    public function endDate(): ?Carbon
    {
        return $this->filled('end_date')
            ? Carbon::parse((string) $this->input('end_date'))->endOfDay()
            : null;
    }
}
