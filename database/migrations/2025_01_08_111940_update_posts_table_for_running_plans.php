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
            if (!Schema::hasColumn('posts', 'title')) { // Proveri da li kolona 'title' postoji
                $table->string('title'); // Naslov plana
            }
            if (!Schema::hasColumn('posts', 'duration')) { // Proveri da li kolona 'duration' postoji
                $table->integer('duration')->nullable(); // Trajanje plana u minutama
            }
            if (!Schema::hasColumn('posts', 'frequency')) { // Proveri da li kolona 'frequency' postoji
                $table->integer('frequency')->nullable(); // Broj treninga nedeljno
            }
            if (!Schema::hasColumn('posts', 'distance')) { // Proveri da li kolona 'distance' postoji
                $table->float('distance')->nullable(); // Udaljenost u km
            }
            if (!Schema::hasColumn('posts', 'max_participants')) { // Proveri da li kolona 'max_participants' postoji
                $table->integer('max_participants')->default(0); // Maksimalan broj učesnika
            }
            if (!Schema::hasColumn('posts', 'current_participants')) { // Proveri da li kolona 'current_participants' postoji
                $table->integer('current_participants')->default(0); // Trenutni broj učesnika
            }
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
            if (Schema::hasColumn('posts', 'title')) { // Briše kolonu 'title'
                $table->dropColumn('title');
            }
            if (Schema::hasColumn('posts', 'duration')) { // Briše kolonu 'duration'
                $table->dropColumn('duration');
            }
            if (Schema::hasColumn('posts', 'frequency')) { // Briše kolonu 'frequency'
                $table->dropColumn('frequency');
            }
            if (Schema::hasColumn('posts', 'distance')) { // Briše kolonu 'distance'
                $table->dropColumn('distance');
            }
            if (Schema::hasColumn('posts', 'max_participants')) { // Briše kolonu 'max_participants'
                $table->dropColumn('max_participants');
            }
            if (Schema::hasColumn('posts', 'current_participants')) { // Briše kolonu 'current_participants'
                $table->dropColumn('current_participants');
            }
        });
    }
};
