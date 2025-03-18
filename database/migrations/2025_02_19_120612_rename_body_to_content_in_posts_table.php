<?php

// database/migrations/xxxx_xx_xx_xxxxxx_rename_body_to_content_in_posts_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameBodyToContentInPostsTable extends Migration
{
    public function up()
    {
        Schema::table('posts', function (Blueprint $table) {
            // Dodajemo novu kolonu 'content'
            $table->text('content')->after('title');
            // Ako želite, možete migrirati podatke iz 'body' u 'content' kolonu, ali to nije obavezno.
        });

        // Zatim uklonite staru kolonu 'body' (ako želite)
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('body');
        });
    }

    public function down()
    {
        Schema::table('posts', function (Blueprint $table) {
            // U slučaju rollback-a, ponovo dodajte 'body' kolonu i obrišite 'content'.
            $table->text('body')->after('title');
        });
    }
}

