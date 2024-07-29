// MODULES
import TextareaAutosize from 'react-textarea-autosize';
import React, { useEffect, useState, useRef } from 'react';
import { useUserContext } from '../contexts/UserContext.js';
import { createPost } from '../services/post.service.ts';
import pasteImage from '../utils/pasteImage.js';

// COMPONENTS
import YoutubeEmbed from './YoutubeEmbed';
import VideoUploadButton from './VideoUploadButton';
import ImageUploadButton from './ImageUploadButton';

export default function HandlePost() {
    const { user } = useUserContext();
    const domain = process.env.REACT_APP_SERVER_SERVICE;

    const [isValidContent, setIsValidContent] = useState(false)     // Check content of post is valid
    const [postContent, setPostContent] = useState("")              // content of post
    const [embedId, setEmbedId] = useState("")                      // id of video youtube
    const [media, setMedia] = useState()                            // Media dùng để đưa sang server (có thể là ảnh, video, link youtube)

    const mediaSourceRef = useRef();                    
    const isActive = useRef(false);                                  // Trạng thái kích hoạt của box review, nếu true nghĩa là đang có file(image, video) đang được hiển thị
    const textAreaRef = useRef(null);

    useEffect(() => {
        getClipBoard()
    }, [])

    useEffect(() => {
        if (media || postContent !== "" || embedId !== "") {
            setIsValidContent(true)
        } else {
            setIsValidContent(false)
        }

    }, [postContent, media])

    useEffect(() => {
        if (media) {
            mediaSourceRef.current.style.backgroundImage = `url(${URL.createObjectURL(media)})`
            showBoxReview()
        }

    }, [media])

    useEffect(() => {
        // https://www.youtube.com/watch?v=GwCUbhE0TY0
        // https://youtu.be/LlF_2QXVZZ4
        // https://www.youtube.com/embed/ThFDcqMq8jg
        const regexs = [
            "https://www.youtube.com/watch?v=",
            "https://youtu.be/",
            "https://www.youtube.com/shorts/",
            "https://www.youtube.com/embed/"
        ]

        for (const regex of regexs) {
            if (postContent.startsWith(regex)) {
                // Cho toàn bộ sự kiện khi click vào nút tải ảnh, tải video biêt đang có 1 file đang được hiển thị
                isActive.current = true
                const videoId = postContent.slice(regex.length)
    
                showBoxReview()
                setEmbedId(videoId)
                setPostContent("")

                return;
            }
        }

    }, [postContent])

    function hiddenBoxReview() {
        mediaSourceRef.current.classList.remove('boxReview-image')
        mediaSourceRef.current.classList.replace('d-block', 'd-none')
    }

    function showBoxReview() {
        mediaSourceRef.current.classList.add('boxReview-image')
        mediaSourceRef.current.classList.replace('d-none', 'd-block')
    }

    function handleRemoveMedia() {
        // Cho phép tải file mới
        isActive.current = false
        setMedia(null)
        mediaSourceRef.current.style.backgroundImage = ""
        hiddenBoxReview()
    }

    function handleRemoveYoutube() {
        // Cho phép tải file mới
        isActive.current = false
        setEmbedId("")
        hiddenBoxReview()
    }

    function handleMessageChange(e) {
        setPostContent(e.target.value)
    }

    function getClipBoard() {
        textAreaRef.current.addEventListener("keydown", async (event) => {
            if (event.ctrlKey && event.key === "v") {
                const blob = await pasteImage();
                if (blob) {
                    setMedia(blob);
                }
            }
        })
    }

    async function handleUpload() {
        if (isValidContent) {
            const post = {
                "owner": user._id,
                "content": postContent,
                "creationTime": new Date(),
                "loves": 0
            }

            if (embedId != "") {
                post.embedYoutube = embedId
            }

            // Reset form
            setPostContent("")
            handleRemoveMedia()

            if (media) {
                const payload = await createPost(post, media)
            } else {
                const payload = await createPost(post, null)
            }   
        }
    }

    return (
        <div className="handle-post bg-white pad-10">
            <div>
                <img
                    className="avatar"
                    src={`${domain}/users/${user._id}/${user.avatar}`}
                    alt="avatar"
                />

                <TextareaAutosize
                    ref={textAreaRef}
                    id="post-content"
                    className="ml-13"
                    placeholder="What's on your mind?"
                    name=""
                    value={postContent}
                    onChange={handleMessageChange}
                />

            </div>

            {/* PREVIEW PICTURE OR VIDEO */}
            <div id="js-review" className="mt-25 d-none" ref={mediaSourceRef}>
                {
                    (embedId) 
                    ?
                        <>
                            <YoutubeEmbed embedId={embedId} />
                            <i onClick={handleRemoveYoutube} className="fa-solid fa-x"></i>
                        </>
                    :
                    (media && media.type === "video/mp4")
                    ?
                        <>
                            <video controls>
                                <source src={URL.createObjectURL(media)} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>

                            <i onClick={handleRemoveMedia} className="fa-solid fa-x"></i>
                        </>
                    :
                        <i onClick={handleRemoveMedia} className="fa-solid fa-x"></i>
                }

            </div>

            <div className="row mt-15 space-between">
                <ul className="list-icon row">
                    <li>
                        <ImageUploadButton isActive={isActive} setMedia={setMedia} />
                    </li>
                    <li>
                        <VideoUploadButton isActive={isActive} setMedia={setMedia} />
                    </li>
                </ul>
                <div onClick={handleUpload} id="js-btn-post" className={`btn ${(isValidContent) ? 'btn-blue' : 'btn-hidden'
                    }`}>
                    Đăng bài
                </div>
            </div>
        </div>
    )
}