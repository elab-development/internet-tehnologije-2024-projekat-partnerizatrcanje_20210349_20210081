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
    Schema::table('users', function (Blueprint $table) {
        $table->string('profile_image')->nullable();
        $table->text('description')->nullable();
        $table->integer('height')->nullable(); // u cm
        $table->decimal('weight', 5, 2)->nullable(); // u kg
    });
}

public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn(['profile_image', 'description', 'height', 'weight']);
    });
}
};
