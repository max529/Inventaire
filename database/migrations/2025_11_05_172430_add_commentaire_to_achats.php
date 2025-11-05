<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('achats', function (Blueprint $table) {
            $table->text("commentaire");
        });
        Schema::table('pertes', function (Blueprint $table) {
            $table->text("commentaire");
        });
        Schema::table('mouvements', function (Blueprint $table) {
            $table->text("commentaire");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('achats', function (Blueprint $table) {
            //
        });
    }
};
