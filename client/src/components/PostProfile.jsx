import { useEffect, useState } from 'react'
import { checkReaction } from '../services/reaction.service'
import { useUserContext } from '../contexts/UserContext.js';
import YoutubeEmbed from './YoutubeEmbed'

export default function PostProfile({
    _id,
    image,
    video,
    embedYoutube,
    title,
    date,
    totalEmoji,
    totalComment,
}) {

    const domain = process.env.REACT_APP_SERVER_SERVICE
    const limitText = 200
    const [content, setContent] = useState(title)
    const [isLove, setIsLove] = useState(false)
    const { user } = useUserContext();

    useEffect(() => {
        filterTitle()

        // Kiem tra trang thai tuong tac voi bai viet
        async function checkReactionPost() {
            const payload = await checkReaction(_id, user._id)

            if (payload.data)
                setIsLove(true)
            else
                setIsLove(false)
        }

        checkReactionPost()
    }, [])

    function filterTitle() {
        if (title.length >= limitText) {
            let newContent = title.slice(0, limitText) + "..."

            setContent(newContent)
        }
    }

    return (
        <div className="postcard">
           {
            (embedYoutube) ?
                <YoutubeEmbed embedId={embedYoutube} />
            :
            (image) 
            ?
                <div className="image">
                    <img src={`${domain}/posts/${image}`} alt="post" />
                </div>   
            :
            (video) ? 
                <video controls>
                    <source src={`${domain}/posts/${video}`}/>
                    Your browser does not support the video tag.
                </video> 
            :
                <div className="image">
                    <img src={`${domain}/posts/no-image.jpg`} alt="post" />
                </div>
           }

            <div className="content">
                <h3 className='title'>{content}</h3>
                <p className='date'>{date}</p>
            </div>

            <div className='flex justify-space-between mt-15'>
                <div className="flex">
                    <div className='flex align-items-center'>
                        <span className={`material-symbols-outlined ${isLove ? "shape-effect__love" : ""}`}>favorite</span>
                        <span className='flex align-items-center ml-5'>{totalEmoji}</span>
                    </div>
                    <div className='flex align-items-center ml-15'>
                        <i className="fa-regular fa-comment"></i>
                        <span className='ml-5'>{totalComment}</span>
                    </div>
                </div>

                <div className="flex">
                    <span className="material-symbols-outlined">download</span>
                </div>
            </div>
        </div>
    )
}