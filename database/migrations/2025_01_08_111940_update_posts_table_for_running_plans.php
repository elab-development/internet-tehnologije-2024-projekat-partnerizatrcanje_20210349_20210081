<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
{
    Schema::table('posts', function (Blueprint $table) {
        $table->string('title'); // Naslov plana
        $table->integer('duration')->nullable(); // Trajanje plana u minutama
        $table->integer('frequency')->nullable(); // Broj treninga nedeljno
        $table->float('distance')->nullable(); // Udaljenost u km
        $table->integer('max_participants')->default(0); // Maksimalan broj učesnika
        $table->integer('current_participants')->default(0); // Trenutni broj učesnika
    });
}


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
{
    Schema::table('posts', function (Blueprint $table) {
        $table->dropColumn('title'); // Briše kolonu 'title'
        $table->dropColumn('duration'); // Briše kolonu 'duration'
        $table->dropColumn('frequency'); // Briše kolonu 'frequency'
        $table->dropColumn('distance'); // Briše kolonu 'distance'
        $table->dropColumn('max_participants'); // Briše kolonu 'max_participants'
        $table->dropColumn('current_participants'); // Briše kolonu 'current_participants'
    });
}

};
