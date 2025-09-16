<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('running_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Veza sa korisnikom
            $table->decimal('total_distance', 8, 2)->default(0); // Ukupno pretrčani km
            $table->integer('total_time')->default(0); // Ukupno vreme trčanja (sekunde)
            $table->decimal('average_pace', 5, 2)->nullable(); // Prosečan tempo (min/km)
            $table->integer('runs_count')->default(0); // Broj trčanja
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('running_stats');
    }
};
