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
        if (Schema::hasColumn('posts', 'title')) { //Briše kolonu 'title'
            $table->dropColumn('title');
        }
        if (Schema::hasColumn('posts', 'duration')) { //Briše kolonu 'duration'
            $table->dropColumn('duration');
        }
        if (Schema::hasColumn('posts', 'frequency')) {
            $table->dropColumn('frequency');
        } // Briše kolonu 'frequency'
        if (Schema::hasColumn('posts', 'distance')) {
            $table->dropColumn('distance');
        } // Briše kolonu 'distance'
        if (Schema::hasColumn('posts', 'max_participants')) {
            $table->dropColumn('duration');
        } // Briše kolonu 'max_participants'
        if (Schema::hasColumn('posts', 'current_participants')) {
            $table->dropColumn('current_participants');
        } // Briše kolonu 'current_participants'
    });
}

};
