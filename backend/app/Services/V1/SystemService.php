<?php

namespace App\Services\V1;

use App\Repositories\V1\SystemRepository;

class SystemService
{
    protected SystemRepository $systemRepository;

    public function __construct(SystemRepository $systemRepository)
    {
        $this->systemRepository=$systemRepository;
    }

    public function getAllSystems()
}