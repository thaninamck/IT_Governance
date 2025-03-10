<?php

namespace App\Repositories\V1;
use App\Models\Control;
class ControlRepository
{
    public function getAllControls()
    {
        return Control::with(['type', 'majorProcess', 'subProcess', 'sources', 'steps'])
                      ->where('is_archived', false)
                      ->get();
    }
    

    public function getControlById(int $id)
    {
        return Control::with(['type', 'majorProcess','subProcess','sources','steps','remediations','executions'])->where('id',$id,'is_archived',false)->first();
    }

    public function createControl(array $data)
    {
        return Control::create($data);
    }

    public function updateControl(Control $control, array $data)
    {
        $control->update($data);
        return $control;
    }
    public function archive($id)
    {
        $control = Control::find($id);
    
        if (!$control) {
            return false;
        }
    
        return $control->update(['is_archived' => true]);  
    }
    
    public function restore($id)
    {
        $control = Control::find($id);
    
        if (!$control) {
            return false;
        }
    
        return $control->update(['is_archived' => false]);  
    }
    
public function hasRelatedData(Control $control){
    return $control->remediations()->exists() || $control->executions()->exists();
}
    
public function deleteControl(Control $control){
    return $control->delete();
}
}
