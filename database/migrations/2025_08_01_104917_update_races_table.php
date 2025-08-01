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
        Schema::table('races', function (Blueprint $table) {
            // Ukloni stara polja start_date i end_date ako postoje
            if (Schema::hasColumn('races', 'start_date')) {
                $table->dropColumn('start_date');
            }
            if (Schema::hasColumn('races', 'end_date')) {
                $table->dropColumn('end_date');
            }
            
            // Dodaj nova polja za trke kao nullable prvo
            $table->date('race_date')->nullable()->after('description')->comment('Dan kada se trka održava');
            $table->time('start_time')->nullable()->after('race_date')->comment('Vreme početka trke');
            $table->time('end_time')->nullable()->after('start_time')->comment('Vreme kraja trke');
            $table->integer('max_participants')->default(50)->after('distance')->comment('Maksimalan broj učesnika');
        });

        // Ažuriraj postojeće redove sa default vrednostima
        DB::table('races')->update([
            'race_date' => now()->addDays(7)->format('Y-m-d'),
            'start_time' => '09:00:00',
            'end_time' => '11:00:00'
        ]);

        // Sada promeni kolone da budu NOT NULL
        Schema::table('races', function (Blueprint $table) {
            $table->date('race_date')->nullable(false)->change();
            $table->time('start_time')->nullable(false)->change();
            $table->time('end_time')->nullable(false)->change();
            
            // Izmeni existing distance kolonu da bude decimal ako je string
            if (Schema::hasColumn('races', 'distance')) {
                $table->decimal('distance', 8, 2)->change();
            }
            
            // Dodaj index na race_date za bolje performanse
            $table->index('race_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('races', function (Blueprint $table) {
            // Ukloni index
            $table->dropIndex(['race_date']);
            
            // Ukloni nova polja
            $table->dropColumn([
                'race_date',
                'start_time',
                'end_time',
                'max_participants'
            ]);
            
            // Vrati stara polja
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            
            // Vrati distance na string ako je potrebno
            $table->string('distance')->change();
        });
    }
};