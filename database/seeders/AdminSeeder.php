<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->count(3)->sequence(
            [
                'role' => 'superadmin',
                'name' => 'Superadmin',
                'email' => 'superadmin@superadmin.com',
            ],
            [
                'role' => 'admin',
                'name' => 'Admin',
                'email' => 'admin@admin.com',
            ],
        )->create();
    }
}
