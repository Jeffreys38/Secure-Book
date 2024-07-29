import { useAudioContext } from '../contexts/AudioContext'
import { useParams } from "react-router-dom";
import { useUserContext } from '../contexts/UserContext';

export default function PostMusicCard({ card, setMusicPlayer }) {
    const { _id, name, author, file, albumCover, albumId } = card
    const domain = `${process.env.REACT_APP_SERVER_SERVICE}/musics/${albumId}`
    const audioContext = useAudioContext();
    const { userId } = useParams();
    const { user } = useUserContext();

    function playAudio() {
        if (userId === undefined) {
            audioContext.setSongById(_id);
            setMusicPlayer(_id);
        }
    }

    return (
        <div id={_id} className="postcard" onClick={playAudio}>
            {
                (albumCover !== "")
                    ?
                    <div className="image">
                        <img src={`${domain}/${albumCover}`} alt="post" />
                    </div>
                    :
                    <div className="image">
                        <img src={`${domain}/posts/no-image.jpg`} alt="post" />
                    </div>
            }

            <div className="content">
                <h3 className='name'>{name}</h3>
                <p className='author'>{author}</p>
            </div>

            <div className='flex justify-space-between mt-15'>
                <div className="flex">
                    <div className='flex align-items-center'>
                        <span className={`material-symbols-outlined shape-effect__love`}>favorite</span>
                        <span className='flex align-items-center ml-5'>0</span>
                    </div>
                    <div className='flex align-items-center ml-15'>
                        <i className="fa-regular fa-comment"></i>
                        <span className='ml-5'>0</span>
                    </div>
                </div>

                <div className="flex">
                    <span className="material-symbols-outlined">download</span>
                </div>
            </div>
        </div>
    )
}