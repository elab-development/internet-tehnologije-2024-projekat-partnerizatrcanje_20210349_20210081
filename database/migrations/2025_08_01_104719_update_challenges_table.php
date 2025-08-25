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
        Schema::table('challenges', function (Blueprint $table) {
            // Ukloni staro polje duration ako postoji
            if (Schema::hasColumn('challenges', 'duration')) {
                $table->dropColumn('duration');
            }
            
            // Dodaj nova polja kao NULLABLE prvo
            $table->decimal('target_distance', 8, 2)->nullable()->after('description')->comment('Ciljna distanca u km');
            $table->integer('duration_days')->nullable()->after('target_distance')->comment('Trajanje izazova u danima');
            $table->datetime('start_date')->nullable()->after('duration_days')->comment('Datum početka izazova');
            $table->datetime('end_date')->nullable()->after('start_date')->comment('Datum kraja izazova');
            $table->unsignedBigInteger('created_by')->nullable()->after('prize')->comment('Admin koji je kreirao izazov');
            
            // Foreign key constraint
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
        });

        // Ažuriraj postojeće redove sa default vrednostima
        DB::table('challenges')->update([
            'target_distance' => 10.00,
            'duration_days' => 30,
            'start_date' => now(),
            'end_date' => now()->addDays(30),
            'created_by' => DB::table('users')->where('role', 'admin')->first()?->id ?? 1
        ]);

        // Sada promeni kolone da budu NOT NULL (osim created_by)
        Schema::table('challenges', function (Blueprint $table) {
            $table->decimal('target_distance', 8, 2)->nullable(false)->change();
            $table->integer('duration_days')->nullable(false)->change();
            $table->datetime('start_date')->nullable(false)->change();
            $table->datetime('end_date')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('challenges', function (Blueprint $table) {
            // Ukloni foreign key
            $table->dropForeign(['created_by']);
            
            // Ukloni nova polja
            $table->dropColumn([
                'target_distance',
                'duration_days',
                'start_date',
                'end_date',
                'created_by'
            ]);
            
            // Vrati staro polje duration
            $table->integer('duration')->nullable();
        });
    }
};