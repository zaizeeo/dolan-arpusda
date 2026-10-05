<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
                "role" => "superadmin",
                "name" => "Superadmin",
                "email" => "superadmin@superadmin.com",
            ],
            [
                "role" => "admin",
                "name" => "Admin",
                "email" => "admin@admin.com",
            ],
            [
                "role" => "staff",
                "name" => "Staff",
                "email" => "staff@staff.com",
            ],
            [
                "role" => "magang",
                "name" => "Magang",
                "email" => "magang@magang.com",
            ],
        )->create();
    }
}
