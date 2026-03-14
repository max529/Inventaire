<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;

class FormatImgController
{
    public function request(): void
    {
        $disk = Storage::disk('public');
        $directory = 'materiels';

        $files = $disk->files($directory);
        foreach ($files as $filePath) {

            try {
                $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
                $image = ImageManager::gd()->read($disk->get($filePath));
                $image->scaleDown(width: null, height: 400);
                $encoded = $image->encodeByExtension($extension)->toString();
                $disk->put($filePath, $encoded);
            } catch (\Exception $e) {
                // Log l'erreur si un fichier est corrompu ou illisible
                logger("Erreur lors du traitement de {$filePath} : " . $e->getMessage());
            }
        }
    }
}
