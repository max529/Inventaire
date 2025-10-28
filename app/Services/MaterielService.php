<?php

namespace App\Services;

use App\Models\MaterielVariation;
use App\Models\MaterielVariationGroupe;
use App\Models\Variation;
use App\Models\VariationGroupe;
use Illuminate\Database\Eloquent\Collection;

class MaterielService
{
    public function checkVariations($item): void
    {
        /** @var Collection<int, MaterielVariation> $realItems */
        $realItems = $item->variations()->get();

        /**
         * @param MaterielVariation[] $groups
         * @param Variation[] $variations
         * @return void
         */
        $loop = function (array $groups, array $variations = []) use (&$loop, &$realItems, $item) {
            if (count($groups) == 0) {
                $found = false;
                foreach ($realItems as $key => $realItem) {
                    $itemMatching = true;
                    foreach ($variations as $variation) {
                        $variationFound = false;
                        foreach ($realItem->groups as $group) {
                            if ($group->id_variation == $variation->id) {
                                $variationFound = true;
                                break;
                            }
                        }
                        if (!$variationFound) {
                            $itemMatching = false;
                            break;
                        }
                    }
                    if ($itemMatching) {
                        $found = true;
                        $realItems->forget($key);
                    }

                }

                if (!$found) {
                    $materielVariation = new MaterielVariation();
                    $materielVariation->id_materiel = $item->id;
                    $materielVariation->save();
                    foreach ($variations as $variation) {
                        $materielVariationGroup = new MaterielVariationGroupe();
                        $materielVariationGroup->id_variation = $variation->id;
                        $materielVariationGroup->id_materiel_variation = $materielVariation->id;
                        $materielVariationGroup->save();
                    }
                }

                return;
            }

            /** @var VariationGroupe $group */
            $group = $groups[0];
            array_shift($groups);
            foreach ($group->variations as $variation) {
                $cloneVariations = $variations;
                $cloneVariations[] = $variation;
                $loop($groups, $cloneVariations);
            }
        };

        $loop($item->variations_groupes->all());

        // on supprime ceux en trop
        foreach ($realItems as $realItem) {
            $realItem->delete();
        }
    }
}
