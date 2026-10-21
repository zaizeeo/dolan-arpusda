<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->count(4)->sequence(
            [
                'role' => 'superadmin',
                'name' => 'Superadmin',
                'avatar' => config('app.ui_avatar') . "Superadmin",
                'email' => 'superadmin@superadmin.com',
            ],
            [
                'role' => 'admin',
                'name' => 'Admin',
                'avatar' => config('app.ui_avatar') . "Admin",
                'email' => 'admin@admin.com',
            ],
            [
                'role' => 'staff',
                'name' => 'Staff',
                'avatar' => config('app.ui_avatar') . "Staff",
                'email' => 'staff@staff.com',
            ],
            [
                'role' => 'intern',
                'name' => 'Intern',
                'avatar' => config('app.ui_avatar') . "Staff",
                'email' => 'intern@intern.com',
            ],
        )->create();
    }
}
