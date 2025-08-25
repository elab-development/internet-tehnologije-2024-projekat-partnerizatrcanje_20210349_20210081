<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('challenges', function (Blueprint $table) {
            $table->dropColumn(['conditions', 'company_id']); // Briše nepotrebne kolone
            $table->string('distance')->nullable(); // Dodaje distance ako ne postoji
            $table->string('prize')->nullable()->change(); // Menja prize ako treba
        });
    }

    public function down()
    {
        Schema::table('challenges', function (Blueprint $table) {
            $table->text('conditions')->nullable();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
        });
    }
};


