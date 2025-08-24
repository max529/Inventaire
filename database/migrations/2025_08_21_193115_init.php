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
        Schema::create("users", function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom');
            $table->string('nom_utilisateur');
            $table->string('mot_passe');
        });

        Schema::create("materiels", function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('image')->nullable();
            $table->boolean('tout_monde');
        });

        Schema::create("variations", function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_materiel')->constrained('materiels');
            $table->string('nom');
        });

        Schema::create("equipes", function (Blueprint $table) {
            $table->id();
            $table->string('nom');
        });

        Schema::create("inventaires", function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_equipe')->constrained('equipes');
            $table->foreignId('id_materiel')->constrained('materiels');
            $table->foreignId('id_variation')->nullable()->constrained('variations');
            $table->float('quantite');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropDatabaseIfExists("inventaires");
        Schema::dropDatabaseIfExists("equipes");
        Schema::dropDatabaseIfExists("articles");
        Schema::dropDatabaseIfExists("users");
    }
};
