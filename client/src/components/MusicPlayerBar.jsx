import { useEffect, useRef, useState } from "react"
import { useAudioContext } from '../contexts/AudioContext'
import MusicService from "../services/music.service";
import { useUserContext } from "../contexts/UserContext";

export default function MusicPlayerBar({ musicPlayer }) {
    const audioContext = useAudioContext();
    const { user } = useUserContext();
    const [song, setSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);
    const [isLoop, setIsLoop] = useState(false);

    useEffect(() => {
        // Chỉ lấy dữ liệu, đăng ký sự kiện 1 lần duy nhất cho dù chuyển page (unmount)
        if (audioContext.albums.length === 0) {
            
            MusicService.getMusicByOwnerId(user._id).then((payload) => {
                if (payload.code === 200) {
                    audioContext.setAlbums(payload.data);
                    setSong(audioContext.getSong());
                }
            })

            function audioEnded() {
                if (isLoop) {
                    audioContext.currentIndex = 0;
                    audioContext.play();
                    return;
                }

                if (audioContext.isEndedAlbum()) {
                    audioContext.pause();
                    setIsPlaying(false);
                }
                else {
                    nextAudio();
                }
            }
            audioContext.audio.addEventListener("ended", audioEnded)
        } else {
            setSong(audioContext.getSong());
        }
        
        if (audioContext.isPlaying)
            setIsPlaying(true)

        // return () => {
        //     audioContext.audio.removeEventListener("ended", audioEnded)
        // }
    }, [])

    useEffect(() => {
        if (musicPlayer) {
            setSong(audioContext.getSong());

            // Nếu post music được nhấn và nếu trong trường hợp có audio khác đang được phát
            if (audioContext.isPlaying) {
                audioContext.play();
            }
        }
    }, [musicPlayer])

    function playAudio() {
        if (isPlaying) {
            audioContext.pause();
            setIsPlaying(false);
        }
        else {
            audioContext.play();
            setIsPlaying(true);
        }
    }

    function nextAudio() {
        audioContext.nextSong();
        setSong(audioContext.getSong())
    }

    function prevAudio() {
        audioContext.prevSong();
        setSong(audioContext.getSong())
    }

    function shuffle() {
        if (isShuffle) {
            audioContext.unShuffle();
            setIsShuffle(false);

        } else {
            audioContext.shuffle();
            setIsShuffle(true);
        }
        setSong(audioContext.getSong())

        if (isPlaying)
            audioContext.play();
    }

    return (
        <div id="musicPlayerBar">
            <div>
                <b className="mr-center mb-15">{audioContext.currentIndex + 1}/{audioContext.albums.length}</b>
                <img id="albumCover" src={(song) ? song.albumCover : ""}></img>
                <div id="scrolling-text-container">
                    <p id="name"><b>{(song) ? song.name : ""}</b></p>
                    <p>{(song) ? song.author : ""}</p>
                </div>
            </div>
            {
                (isShuffle)
                    ?
                    <div style={{
                        border: "2px solid black",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        padding: "19px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <img onClick={shuffle} className="icon" width="30" height="30" src="https://img.icons8.com/pastel-glyph/64/shuffle--v1.png" alt="shuffle--v1" />
                    </div>
                    :
                    <img onClick={shuffle} className="icon" width="30" height="30" src="https://img.icons8.com/pastel-glyph/64/shuffle--v1.png" alt="shuffle--v1" />
            }
            <div id="main-button">
                <img onClick={nextAudio} className="icon" width="30" height="30" src="https://img.icons8.com/ios-filled/50/up-squared.png" alt="up-squared" />
                {
                    (isPlaying) ?
                        <img onClick={playAudio} className="icon" width="30" height="30" src="https://img.icons8.com/ios-filled/50/pause--v1.png" alt="pause--v1" />
                        :
                        <img onClick={playAudio} className="icon" width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/play--v1.png" alt="play--v1" />
                }
                <img onClick={prevAudio} className="icon" width="30" height="30" src="https://img.icons8.com/ios-filled/50/down-squared.png" alt="down-squared" />
            </div>
            {
                (isLoop)
                    ?
                    <div style={{
                        border: "2px solid black",
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        padding: "19px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <img onClick={() => { setIsLoop(!isLoop) }} className="icon" width="30" height="30" src="https://img.icons8.com/ios-filled/50/repeat.png" alt="repeat" />
                    </div>
                    : <img onClick={() => { setIsLoop(!isLoop) }} className="icon" width="30" height="30" src="https://img.icons8.com/ios-filled/50/repeat.png" alt="repeat" />
            }

        </div>
    )
}