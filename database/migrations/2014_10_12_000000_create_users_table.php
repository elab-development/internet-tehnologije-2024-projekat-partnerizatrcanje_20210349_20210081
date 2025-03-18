<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable(); // Gosti nemaju ime
            $table->string('surname')->nullable(); // Gosti nemaju prezime
            $table->string('email')->unique()->nullable(); // Gosti nemaju email
            $table->string('password')->nullable(); // Gosti nemaju password
            $table->enum('role', ['guest', 'user', 'admin'])->default('guest');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
};

