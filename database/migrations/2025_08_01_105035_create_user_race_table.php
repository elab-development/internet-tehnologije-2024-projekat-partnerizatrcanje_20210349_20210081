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
        Schema::table('user_race', function (Blueprint $table) {
            // Dodaj nova polja ako ne postoje
            if (!Schema::hasColumn('user_race', 'finish_time')) {
                $table->time('finish_time')->nullable()->comment('Vreme završetka korisnika (HH:MM:SS)');
            }
            
            if (!Schema::hasColumn('user_race', 'completed_at')) {
                $table->datetime('completed_at')->nullable()->comment('Kada je korisnik završio trku');
            }
            
            if (!Schema::hasColumn('user_race', 'result_submitted')) {
                $table->boolean('result_submitted')->default(false)->comment('Da li je korisnik submit-ovao rezultat');
            }
        });

        // Proveri i dodaj indexes samo ako ne postoje
        $indexes = DB::select("SHOW INDEX FROM user_race");
        $indexNames = collect($indexes)->pluck('Key_name')->toArray();

        Schema::table('user_race', function (Blueprint $table) use ($indexNames) {
            if (!in_array('user_race_user_id_index', $indexNames)) {
                $table->index('user_id');
            }
            if (!in_array('user_race_race_id_index', $indexNames)) {
                $table->index('race_id');
            }
            if (!in_array('user_race_completed_at_index', $indexNames)) {
                $table->index('completed_at');
            }
            if (!in_array('user_race_result_submitted_index', $indexNames)) {
                $table->index('result_submitted');
            }
            if (!in_array('user_race_finish_time_index', $indexNames)) {
                $table->index('finish_time');
            }
            if (!in_array('user_race_user_id_race_id_unique', $indexNames)) {
                try {
                    $table->unique(['user_id', 'race_id']);
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
        Schema::table('user_race', function (Blueprint $table) {
            // Ukloni nova polja ako postoje
            if (Schema::hasColumn('user_race', 'finish_time')) {
                $table->dropColumn('finish_time');
            }
            if (Schema::hasColumn('user_race', 'completed_at')) {
                $table->dropColumn('completed_at');
            }
            if (Schema::hasColumn('user_race', 'result_submitted')) {
                $table->dropColumn('result_submitted');
            }
        });
    }
};