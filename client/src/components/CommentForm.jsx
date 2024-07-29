import { useRef, useState } from "react";
import { useUserContext } from '../contexts/UserContext.js';
import TextareaAutosize from 'react-textarea-autosize';
import CommentService from "../services/comment.service";
import ImageUploadButton from "./ImageUploadButton";
import StickerButton from "./StickerButton";

export default function CommentForm({ postID }) {
    const domain = process.env.REACT_APP_SERVER_SERVICE;
    const { user } = useUserContext();

    const isActive = useRef();

    const [media, setMedia] = useState();
    const [sticker, setSticker] = useState(null)
    const [message, setMessage] = useState("")

    const handleMessageChange = event => {
        setMessage(event.target.value);
    };

    async function postComment() {
        if (isValidComment()) {
            const comment = {
                owner: user._id,
                postId: postID,
                content: message,
                creationTime: new Date(),
                ...(sticker ? { sticker: sticker } : null)
            }
            console.log(sticker)
            const payload = await CommentService.createComment(comment)
            setMessage("")
            setSticker(null)
        }
    }

    function isValidComment() {
        if (message.length == 0)
            return false;
        return true;
    }

    function closeSticker() {
        setSticker(null)
    }

    return (
        <div className="form-comment">
            <img
                className="avatar"
                src={`${domain}/users/${user._id}/${user.avatar}`}
                alt="avatar"
            />
            <div className="row flex-1">
                <div className="flex-1 ml-13">
                    <TextareaAutosize
                        value={message}
                        className="post-comment"
                        placeholder="Bạn đang nghĩ gì ?"
                        onChange={handleMessageChange} />
                    {
                        (sticker) ? <div className="sticker">
                            <img src={sticker}></img>
                            <div className="close" onClick={closeSticker}>
                                <span className="material-symbols-outlined">
                                    close
                                </span>
                            </div>
                        </div> : null
                    }
                </div>
                <div className="icon-comment row">
                    <ul className="list-icon row align-item-center">
                        <li>
                            <StickerButton setSticker={setSticker} />
                        </li>
                        <li>
                            <ImageUploadButton isActive={isActive} setMedia={setMedia} />
                        </li>
                    </ul>
                    <p id="js-btn-post" className="btn btn-blue" onClick={postComment}>
                        Đăng bình luận
                    </p>
                </div>
            </div>
        </div>
    )
}