import { useEffect, useState } from "react";
import CommentService from "../services/comment.service";
import CommentCard from "./CommentCard";
import socket from "../socket/socket-client";

export default function CommentList({ postId, posts }) {
    
    const [comments, setComments] = useState([])

    // Load comment theo postId
    useEffect(() => {
        async function loadComments() {
            const payload = await CommentService.getComments(postId)
            setComments(payload.data)
        }

        loadComments()
    }, [posts])

    // Lắng nghe sự kiện comment
    useEffect(() => {
        socket.on('comment', (comment) => {
            if (postId == comment.postId) {
                // Xep comment moi len dau
                setComments([comment, ...comments])
            }
        })
    })

    return (
        <div className="group-comment">
            {
                comments.map((item, index) => (
                    <CommentCard key={index} comment={item} />
                ))
            }
        </div>
    )
}