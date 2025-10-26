<?php

use App\Enum\Role as EnumRole;
use App\Models\Role;
use App\Models\User;
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
        Schema::create("roles", function (Blueprint $table) {
            $table->id();
            $table->string('nom');
        });



        Schema::create("users", function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom');
            $table->string('nom_utilisateur');
            $table->string('mot_passe');
            $table->foreignId('id_role')->nullable()->constrained('roles')->nullOnDelete();
        });

        Schema::create("materiels", function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('image')->nullable();
            $table->boolean('tout_monde');
        });

        Schema::create("materiel_variations", function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_materiel')->constrained('materiels')->cascadeOnDelete();
        });

        Schema::create("variation_groupe_templates", function (Blueprint $table) {
            $table->id();
            $table->string('nom');
        });

        Schema::create("variation_templates", function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->foreignId('id_groupe')->constrained('variation_groupe_templates')->cascadeOnDelete();
        });

        Schema::create("variation_groupes", function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_materiel')->constrained('materiels')->cascadeOnDelete();
            $table->foreignId('id_template')->nullable()->constrained('variation_groupe_templates')->nullOnDelete();
            $table->string('nom');
        });

        Schema::create("variations", function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->foreignId('id_variation_template')->nullable()->constrained('variation_templates')->nullOnDelete();
            $table->foreignId('id_groupe')->constrained('variation_groupes')->cascadeOnDelete();
        });

        Schema::create("materiel_variation_groupes", function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_materiel_variation')->constrained('materiel_variations')->cascadeOnDelete();
            $table->foreignId('id_variation')->constrained('variations')->cascadeOnDelete();
        });

        Schema::create("equipes", function (Blueprint $table) {
            $table->id();
            $table->boolean('favori')->default(0);
            $table->string('nom');
        });

        Schema::create("inventaires", function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_equipe')->constrained('equipes')->cascadeOnDelete();
            $table->foreignId('id_materiel_variation')->constrained('materiel_variations')->cascadeOnDelete();
            $table->float('quantite');
            $table->dateTime('last_update');
            $table->string('last_update_by');
        });

        Schema::create("inventaire_historiques", function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_equipe')->constrained('equipes')->cascadeOnDelete();
            $table->foreignId('id_materiel_variation')->constrained('materiel_variations')->cascadeOnDelete();
            $table->float('quantite');
            $table->dateTime('last_update');
            $table->string('last_update_by');
        });

        Schema::create("materiel_equipes", function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_equipe')->constrained('equipes')->cascadeOnDelete();
            $table->foreignId('id_materiel')->constrained('materiels')->cascadeOnDelete();
        });

        $admin = new Role();
        $admin->nom = "Admin";
        $admin->save();

        $user = new User();
        $user->nom = "Bonnaz";
        $user->prenom = "Jonathan";
        $user->nom_utilisateur = "jonathan";
        $user->mot_passe = "Pass$1234";
        $user->id_role = EnumRole::Admin->value;
        $user->save();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropDatabaseIfExists("materiel_equipes");
        Schema::dropDatabaseIfExists("inventaires");
        Schema::dropDatabaseIfExists("equipes");
        Schema::dropDatabaseIfExists("articles");
        Schema::dropDatabaseIfExists("users");
    }
};
