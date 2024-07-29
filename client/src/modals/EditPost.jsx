import { useEffect, useRef, useState } from 'react';
import { PostType, PostService } from '../services/post.service.ts';
import { useNotificationContext } from '../contexts/NotificationContext.js';
import { useModalContext } from '../contexts/ModalContext.js';

import YoutubeEmbed from '../components/YoutubeEmbed.jsx';
import VideoUploadButton from '../components/VideoUploadButton';
import ImageUploadButton from '../components/ImageUploadButton';
// https://www.w3schools.com/charsets/ref_emoji_smileys.asp
// https://reactpatterns.js.org/docs/switch-case-operator/

export default function EditPost({ post }) {
    const maxLength = 2200
    const domain = process.env.REACT_APP_SERVER_SERVICE;
    const avatar = domain + "/users/" + post.owner._id + "/avatar.png"
    
    const { setAlert, setIsActive } = useNotificationContext();
    const { setIsPopup } = useModalContext();
    
    const [newContent, setNewContent] = useState(post.content);
    const [newMedia, setNewMedia] = useState(post.image || post.embedYoutube || post.video);
    
    const isActive = useRef(false);
    const mediaBlob = useRef();
    const showRef = useRef();
    const textTopicRef = useRef();

    useEffect(() => {
        setNewContent(post.content)
    }, [post])

    function showDetail() {
        if (showRef.current.style.display === "block") {
            showRef.current.style.display = "none";
            textTopicRef.current.style.fontWeight = "600"
        } else {
            showRef.current.style.display = "block";
            textTopicRef.current.style.fontWeight = ""
        }
    }

    const MediaResource = () => {
        switch (true) {
            case post.hasOwnProperty("embedYoutube"):
                return (
                    <YoutubeEmbed embedId={post.embedYoutube} />      
                )
            
            case post.hasOwnProperty("image"):
                return (
                    <div className="media" style={{
                        backgroundImage: `url(${domain}/posts/${post.image})`
                    }}>
                    </div>
                )
            case post.hasOwnProperty("video"):
                return (
                    <video controls>
                        <source src={`${domain}/posts/${post.video}`} type="video/mp4" />
                            Your browser does not support the video tag.
                    </video> 
                )
        }
    }

    const Accessiblity = ({showRef}) => {
        return (
            <div ref={showRef} style={{display: 'none'}}>
                <p className='modal-text__sub mt-10'>Alt text describes your photos for people with visual impairments. Alt text will be automatically created for your photos or you can choose to write your own.</p>
                <div className='row align-item-center mt-5'>
                    <img width={50} height={50} src={`${domain}/posts/${newMedia}`}></img>
                    <input className='ml-10' type="text" placeholder='Write alt text...' />
                </div>
            </div>
        )
    }

    async function editPost() {
        post.content = newContent;
        const response = await PostService.fetchData(PostType.Edit, post);

        setAlert(response)  // Đặt nội dung cho alert
        setIsActive(true)   // Hiển thị alert
        setIsPopup(false);  // Ẩn modal đi (edit post modal)

        // Có thể kích họat được tab khác
        isActive.current = false;
    }
    
    return (
        <div className="modal">
            <div className="modal-header">
                <span class="material-symbols-outlined">arrow_back</span>
                <h5 class="modal-title">Edit This Post</h5>
                <b onClick={editPost} className="modal-text__main">Finish</b>
            </div>
            <div className="modal-body">
                <MediaResource />
                <div className="modal-content">
                    <div className="row align-items-center">
                        <img className="avatar" src={avatar}></img>
                        <p className='author'>{post.owner.firstName} {post.owner.lastName}</p>
                    </div>
                    <textarea maxLength={maxLength} value={newContent} onChange={(e) => { setNewContent(e.target.value) }} className='modal-textarea' placeholder='Write a captions'></textarea>
                    <div className='row justify-space-between'>
                        <span class="material-symbols-outlined">sentiment_satisfied</span>
                        <p className='modal-sub'>{newContent.length} / {maxLength}</p>
                    </div>
                    <div className='no-select cursor-pointer'>
                        <div onClick={ showDetail } className='row justify-content-space-between'>
                        <p ref={textTopicRef}>Change media</p>
                        <div id='icon-media' className='row'>
                            <ImageUploadButton isActive={isActive} setMedia={setNewMedia} />
                            <VideoUploadButton isActive={isActive} setMedia={setNewMedia} />
                        </div>
                        </div>
                        <Accessiblity showRef={showRef} />
                    </div>
                </div>
            </div>
        </div>
    )
}