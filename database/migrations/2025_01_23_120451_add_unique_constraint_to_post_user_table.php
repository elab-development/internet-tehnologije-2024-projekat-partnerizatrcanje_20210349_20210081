<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('post_user', function (Blueprint $table) {
            // Dodajemo unique constraint
            $table->unique(['post_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::table('post_user', function (Blueprint $table) {
            // Uklanjamo unique constraint
            $table->dropUnique(['post_id', 'user_id']);
        });
    }
};