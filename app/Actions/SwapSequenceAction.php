<?php

namespace App\Actions;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class SwapSequenceAction
{
    /**
     * Move a sequence-numbered record one position up or down among its siblings.
     *
     * Sibling sequence numbers are normalized to 1..n so gaps, duplicate values,
     * and null values cannot break the displayed order.
     */
    public function execute(Model $record, string $direction, ?string $scopeColumn = null): bool
    {
        if (! in_array($direction, ['up', 'down'], true)) {
            return false;
        }

        return DB::transaction(function () use ($record, $direction, $scopeColumn) {
            $query = $record->newQuery();

            if ($scopeColumn !== null) {
                $query->where($scopeColumn, $record->getAttribute($scopeColumn));
            }

            $records = $query
                ->orderBy('sequence_number')
                ->orderBy('created_at')
                ->orderBy('id')
                ->lockForUpdate()
                ->get()
                ->values();

            $currentIndex = $records->search(fn (Model $item) => $item->is($record));

            if ($currentIndex === false) {
                return false;
            }

            $targetIndex = $direction === 'up' ? $currentIndex - 1 : $currentIndex + 1;

            if ($targetIndex < 0 || $targetIndex >= $records->count()) {
                return false;
            }

            $orderedRecords = $records->all();
            $movedRecords = array_splice($orderedRecords, $currentIndex, 1);
            array_splice($orderedRecords, $targetIndex, 0, $movedRecords);

            foreach ($orderedRecords as $position => $item) {
                if ((int) $item->sequence_number !== $position + 1) {
                    $item->update(['sequence_number' => $position + 1]);
                }
            }

            return true;
        });
    }

    /**
     * Invokable alias for execute.
     */
    public function __invoke(Model $record, string $direction, ?string $scopeColumn = null): bool
    {
        return $this->execute($record, $direction, $scopeColumn);
    }
}
