<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Samo dodaj nova polja u postojeću tabelu
        Schema::table('user_challenge', function (Blueprint $table) {
            // Dodaj nova polja ako ne postoje
            if (!Schema::hasColumn('user_challenge', 'distance_completed')) {
                $table->decimal('distance_completed', 8, 2)->default(0.00)->comment('Koliko je korisnik prešao u km');
            }
            
            if (!Schema::hasColumn('user_challenge', 'completed_at')) {
                $table->datetime('completed_at')->nullable()->comment('Kada je korisnik završio izazov');
            }
        });

        // Proveri i dodaj indexes samo ako ne postoje
        $indexes = DB::select("SHOW INDEX FROM user_challenge");
        $indexNames = collect($indexes)->pluck('Key_name')->toArray();

        Schema::table('user_challenge', function (Blueprint $table) use ($indexNames) {
            if (!in_array('user_challenge_user_id_index', $indexNames)) {
                $table->index('user_id');
            }
            if (!in_array('user_challenge_challenge_id_index', $indexNames)) {
                $table->index('challenge_id');
            }
            if (!in_array('user_challenge_completed_at_index', $indexNames)) {
                $table->index('completed_at');
            }
            if (!in_array('user_challenge_user_id_challenge_id_unique', $indexNames)) {
                try {
                    $table->unique(['user_id', 'challenge_id']);
                } catch (\Exception $e) {
                    // Unique constraint možda već postoji pod drugim imenom
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_challenge', function (Blueprint $table) {
            // Ukloni nova polja ako postoje
            if (Schema::hasColumn('user_challenge', 'distance_completed')) {
                $table->dropColumn('distance_completed');
            }
            if (Schema::hasColumn('user_challenge', 'completed_at')) {
                $table->dropColumn('completed_at');
            }
        });
    }
};