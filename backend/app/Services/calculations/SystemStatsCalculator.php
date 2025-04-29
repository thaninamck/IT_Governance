<?php

namespace App\Services\Calculations;

use App\Services\calculations\CalculationServiceInterface;
use App\Repositories\V1\SystemRepository;
use App\Services\calculations\calculationWeightsStrategies\StatusWeightStrategyInterface;
use Illuminate\Support\Collection;

class SystemStatsCalculator implements CalculationServiceInterface
{
    protected SystemRepository $systemRepository;
    protected StatusWeightStrategyInterface $strategy;

    public function __construct(SystemRepository $systemRepository, StatusWeightStrategyInterface $strategy)
    {
        $this->systemRepository = $systemRepository;
        $this->strategy = $strategy;
    }

    public function calculate($data)
    {
        $systemId = $data['system_id'];

        // 1. Récupérer les exécutions groupées
        $executions = $this->systemRepository->getExecutionsGroupedByLayerStatusAndOwner($systemId);

        // 2. Formatter les données pour le frontend
        $formatted = $this->formatDataForFrontend($executions);

        return $formatted;
    }

    protected function formatDataForFrontend(array $rawData): array
    {
        $colors = [
            'applied' => '#3b82f6',
            'not tested' => '#22c55e',
            'in implementation' => '#9333ea',
            'n/a' => '#ef4444',
            'partially applied' => '#f59e0b',
            'not applied' => '#f97316',
            'non positionné' => '#eab308',
        ];

        $collection = collect($rawData);

        $missionName = $collection->first()->mission_name ?? '';
        $client = $collection->first()->client ?? '';
        $systemOwners = $collection->pluck('system_owner')->unique()->values()->toArray();

        $groupedByLayer = $collection->groupBy('layer')->map(function ($layerData, $layerName) use ($colors) {
            $dataPie = $layerData
                ->groupBy('status')
                ->map(function ($group, $status) use ($colors) {
                    return [
                        'name' => ucfirst($status),
                        'value' => $group->sum('control_count'),
                        'color' => $colors[strtolower($status)] ?? '#000000',
                    ];
                })->values();

            $dataBar = $layerData
                ->groupBy('control_owner')
                ->map(function ($group, $owner) {
                    return [
                        'name' => $owner,
                        'value' => $group->sum('control_count'),
                    ];
                })->values();

            return [
                'nom' => $layerName,
                'dataPie' => $dataPie,
                'dataBar' => $dataBar,
            ];
        })->values();

        return [
            'mission' => $missionName,
            'client' => $client,
            'owners' => $systemOwners,
            'manager' => null, // À compléter si tu as l'info
            'applications' => [], // À compléter si tu as l'info
            'couches' => $groupedByLayer,
        ];
    }
}
