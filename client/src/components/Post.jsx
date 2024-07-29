import ListComment from './ListComment'
import CommentForm from './CommentForm';
import YoutubeEmbed from './YoutubeEmbed';
import EditPost from "../modals/EditPost.jsx"
import { useEffect, useState } from 'react'
import { useModalContext } from "../contexts/ModalContext.js"
import { useUserContext } from '../contexts/UserContext.js';
import { addReaction, removeReaction, checkReaction } from '../services/reaction.service';
import { deletePost } from '../services/post.service.ts';

export default function Post({ post, posts, customStyle }) {
    const domain = process.env.REACT_APP_SERVER_SERVICE;
    const { user } = useUserContext();
    const { setIsPopup, setModalForm } = useModalContext();

    const [isLove, setIsLove] = useState(false)
    const [isActiveTooltip, setIsActiveTooltip] = useState(false)

    // Nếu ấn bất kỳ đâu mà không phải là tooltip và isActiveTooltip là true thì sẽ tắt tooltip 
    useEffect(() => {
        function handleEventScreen(event) {
            if (event.target.closest('.more')) {
                return;
            }
            if (isActiveTooltip) {
                setIsActiveTooltip(false)
            }
        }
        document.addEventListener('click', handleEventScreen)
        return () => {
            document.removeEventListener('click', handleEventScreen)
        }
    }, [isActiveTooltip])

    // Kiểm tra xem user đã thích post này chưa
    useEffect(() => {
        async function checkReactionPost() {
            const payload = await checkReaction(post._id, user._id)

            if (payload.data)
                setIsLove(true)
            else
                setIsLove(false)
        }

        checkReactionPost()
    }, [post])

    function activeTooltips() {
        if (isActiveTooltip === false)
            setIsActiveTooltip(true);
        else
            setIsActiveTooltip(false);
    }

    async function handleDeletePost() {
        const payload = await deletePost(post._id)
    }

    async function handleEditPost() {
        setIsPopup(true);
        setModalForm(<EditPost post={post} />);
    }

    async function handleEmoji() {
        if (isLove === false) {
            const payload = await addReaction(post._id, user._id)

            if (payload.code === 200)
                setIsLove(true)
        } else {
            const payload = await removeReaction(post._id, user._id)

            if (payload.code === 200)
                setIsLove(false)
        }
    }

    function calcTimeAgo(creationTime) {
        const date = new Date(creationTime);
        const now = new Date();
        const timeAgo = now - date;

        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;
        const week = day * 7;
        const month = day * 30;
        const year = month * 12;

        if (timeAgo < minute) {
            return "Vừa xong";
        } else if (timeAgo < hour) {
            return Math.floor(timeAgo / minute) + " phút";
        } else if (timeAgo < day) {
            return Math.floor(timeAgo / hour) + " giờ";
        } else if (timeAgo < week) {
            return Math.floor(timeAgo / day) + " ngày";
        } else if (timeAgo < month) {
            return Math.floor(timeAgo / week) + " tuần";
        } else if (timeAgo < year) {
            return Math.floor(timeAgo / month) + " tháng";
        } else {
            return Math.floor(timeAgo / year) + " năm";
        }
    }

    const UserPermission = () => {
        return (
            <>
                <li className={(post.owner._id !== user._id) ? 'disable' : ''} onClick={handleEditPost}>
                <span className="material-symbols-outlined">edit</span>Chỉnh sửa
                </li>
                <li className={(post.owner._id !== user._id) ? 'disable' : ''} onClick={handleDeletePost}>
                    <span className="material-symbols-outlined">delete</span>Xóa bài viết này
                </li>    
            </>
        )
    }

    return (
        <div className="post" style={customStyle}>
            <div className="row justify-between">
                {/* LEFT */}
                <div className="row align-items">
                    <img
                        onClick={() => { window.location.href = "/profile/" + post.owner._id }}
                        className="avatar"
                        src={`${domain}/users/${post.owner._id}/${post.owner.avatar}`}
                        alt=""
                    />

                    <div className="ml-10">
                        <p className="user">{post.owner.firstName} {post.owner.lastName}</p>
                        <p className="time">{calcTimeAgo(post.creationTime)}</p>
                    </div>
                </div>
                {/* RIGHT */}
                <ul className="list-icon row">
                    <li>
                        <i className="fa-solid fa-bookmark" />
                    </li>
                    <li className='more' onClick={activeTooltips}>
                        <i className="fa-solid fa-ellipsis-vertical" />

                        {/* MORE OPTIONS */}
                        <ul className={(isActiveTooltip) ? 'tooltips tooltips-active' : 'tooltips'}>
                            <UserPermission />
                        </ul>
                    </li>
                </ul>
            </div>
            <pre className='text'>{post.content}</pre>
            <div className={`list-image ${(post.image || post.video || post.embedYoutube) ? 'box-active' : 'box-disable'}`}>
                {
                    (post.embedYoutube) ?
                        <YoutubeEmbed embedId={post.embedYoutube} />
                        :
                        (post.image) ?
                            <div style={{ backgroundImage: `url(${domain}/posts/${post.image})` }} className='boxReview-image'></div>
                            :
                            (post.video) ?
                                <video controls>
                                    <source src={`${domain}/posts/${post.video}`} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video> : ""
                }
            </div>
            {/* Emoji */}
            <div className="emoji">
                <div className='no-select' onClick={handleEmoji}>
                    <i className={`fa-regular fa-heart ${(isLove) ? 'shape-effect__love' : ''} `} />
                    <span>{post.loves}</span>
                </div>
                <div className='no-select'>
                    <i className="fa-regular fa-comment" />
                    <span>Bình luận</span>
                </div>
                <div className='no-select'>
                    <i className="fa-solid fa-share" />
                    <span>Chia sẻ</span>
                </div>
            </div>
            {/* Form Comment */}
            <CommentForm postID={post._id} />

            {/* Group Comment */}
            <ListComment postId={post._id} posts={posts} />
        </div>
    )
}