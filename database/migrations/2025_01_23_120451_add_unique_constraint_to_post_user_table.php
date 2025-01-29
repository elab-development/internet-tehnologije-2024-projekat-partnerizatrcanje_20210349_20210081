<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Kreiranje tabele
        Schema::create('post_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            // Dodajte bilo koje druge kolone ako su potrebne
        });
    }

    public function down(): void
    {
        // Brisanje cele tabele
        Schema::dropIfExists('post_user');
    }
};
