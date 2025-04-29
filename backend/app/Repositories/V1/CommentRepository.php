<?php

namespace App\Repositories\V1;
use App\Models\Remark;
class CommentRepository
{
    public function createComment( $data)
{
    return Remark::create($data);// sachant que data va avoir user_id,execution_id,y,text
}



}
