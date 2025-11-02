<?php

use App\Enum\Role as EnumRole;
use App\Models\Equipe;
use App\Models\Materiel;
use App\Models\MaterielImage;
use App\Models\Role;
use App\Models\User;
use App\Services\MaterielService;
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
            $table->boolean('stock')->default(0);
            $table->string('nom');
        });

        Schema::create("inventaires", function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_equipe')->constrained('equipes')->cascadeOnDelete();
            $table->foreignId('id_materiel_variation')->constrained('materiel_variations')->cascadeOnDelete();
            $table->float('quantite');
            $table->dateTime('date');
            $table->string('par');
        });

        Schema::create("mouvements", function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_equipe_entree')->constrained('equipes')->cascadeOnDelete();
            $table->foreignId('id_equipe_sortie')->constrained('equipes')->cascadeOnDelete();
            $table->foreignId('id_materiel_variation')->constrained('materiel_variations')->cascadeOnDelete();
            $table->float('quantite');
            $table->dateTime('date');
            $table->string('par');
        });

        Schema::create("achats", function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_equipe')->constrained('equipes')->cascadeOnDelete();
            $table->foreignId('id_materiel_variation')->constrained('materiel_variations')->cascadeOnDelete();
            $table->float('quantite');
            $table->dateTime('date');
            $table->string('par');
        });

         Schema::create("pertes", function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_equipe')->constrained('equipes')->cascadeOnDelete();
            $table->foreignId('id_materiel_variation')->constrained('materiel_variations')->cascadeOnDelete();
            $table->float('quantite');
            $table->dateTime('date');
            $table->string('par');
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


        $equipes = [
            'Container',
            'U20',
            'U15',
            '1 Masculine',
            '2 Masculine',
            'Juniors A',
            'Juniors B1',
            'Juniors B2',
            'Juniors C1',
            'Juniors C2',
            'Juniors C3',
            'Juniors D1',
            'Juniors D2',
            'Juniors D4',
            'Juniors D5',
            'Juniors E1',
            'Juniors E2',
            'Juniors E3',
            'Juniors E4',
            '1 Féminine',
            'Juniors F17',
            'Juniors F14',
            'Juniors F11',
            'Juniors F',
            'Juniors G'
        ];

        foreach ($equipes as $equipe) {
            $eq = new Equipe();
            $eq->nom = $equipe;
            $eq->stock = $equipe == "Container";
            $eq->save();
        }

        $materiels = [
            ['Echelle de coordination', '/storage/materiels/b847cecd-035f-47cc-8588-c621921cde1a.jpg'],
            ['Porte Gourde Macron', '/storage/materiels/dbf61bec-a54f-4b33-9c59-9e85dc76f3ed.jpg'],
            ['Gourde Macron', '/storage/materiels/e472fb25-d717-4153-966e-32ac630c48d1.jpg'],
            ['PRACTICE+ Orange', '/storage/materiels/2fb8ac3b-4a48-4234-8004-482b5269744a.jpg'],
            ['Petite Pharmacie', '/storage/materiels/1ca5eb6e-5bea-4b44-93aa-a087e5bb6467.jpg'],
            ['Sac à Ballon', '/storage/materiels/3c893342-7b9c-46e2-89ae-07b0cc3905d8.jpg'],
            ['Ballon Taille 4', '/storage/materiels/df8137b3-8d66-48ff-bfaa-cc3a7e9ed653.jpg'],
            ['Ballon Taille 5', '/storage/materiels/003d1073-3a51-4b24-b160-1f01f5b84102.jpg'],
            ['Sac d\'équipement Grand', '/storage/materiels/926eb921-45d4-43c0-af86-0b999007ab98.jpg'],
            ['Sac d\'équipement Petit', '/storage/materiels/b21efcee-eb79-4174-93a0-d1bfb5fa4f0c.jpg'],
            ['PRACTICE+ Blue', '/storage/materiels/0243ccb6-61ca-453b-a63c-6e9e37eefae6.jpg'],
            ['PRACTICE+ White', '/storage/materiels/050866c9-f011-42d8-8de8-9d3026e0fbf1.jpg'],
            ['PRACTICE+ Neon Yellow', '/storage/materiels/6da2c092-0ff3-4c89-9379-f5636ab37540.jpg'],
            ['PRACTICE+ Neon Green', '/storage/materiels/edbcce7e-8e94-4820-9556-311300127a3e.jpg']
        ];

        foreach ($materiels as $materiel) {
            $img = new MaterielImage();
            $img->uri = $materiel[1];
            Materiel::create([
                'nom' => $materiel[0],
                'image' => $img,
                'tout_monde' => 1
            ]);
        }


        $materiels = Materiel::all();
        $service = new MaterielService();
        foreach($materiels as $materiel){
            $service->checkVariations($materiel);
        }

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
