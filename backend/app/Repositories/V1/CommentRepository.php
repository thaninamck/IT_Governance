<?php

namespace App\Repositories\V1;
use App\Models\Remark;
class CommentRepository
{
    public function createComment( $data)
{
    return Remark::create($data);// sachant que data va avoir user_id,execution_id,y,text
}

public function updateComment($id, array $data)
{
    $comment = Remark::findOrFail($id);
    $comment->update($data);
    return $comment;
}

public function deleteComment($id)
{
    $comment = Remark::findOrFail($id);
    return $comment->delete();
}

}
