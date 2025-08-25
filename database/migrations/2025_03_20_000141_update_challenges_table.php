<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::table('challenges', function (Blueprint $table) {
            $table->dropForeign(['company_id']); // Prvo uklanjamo strani ključ
            $table->dropColumn(['conditions', 'company_id']); // Zatim brišemo kolone
        });
    }

    public function down() {
        Schema::table('challenges', function (Blueprint $table) {
            $table->text('conditions')->nullable();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
        });
    }
};

