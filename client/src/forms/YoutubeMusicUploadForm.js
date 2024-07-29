import MusicService from "../services/music.service.js";
import { useEffect, useState } from "react";
import { useUserContext } from "../contexts/UserContext.js";
import { useAudioContext } from "../contexts/AudioContext.js";
import { useModalContext } from "../contexts/ModalContext.js";

export default function YoutubeMusicUploadForm({ onAlert, onState }) {
    const audioContext = useAudioContext();
    const [linkYoutube, setLinkYoutube] = useState('');
    const [youtubeId, setYoutubeId] = useState('');
    const [isLinkValid, setIsLinkValid] = useState(true);
    const { user } = useUserContext();
    const { setIsPopup } = useModalContext();

    useEffect(() => {
        if (linkYoutube === '') {
            setIsLinkValid(true);
            return;
        }

        // If match with any url then convert https://www.youtube.com/watch?v
        const urls = [
            "https://www.youtube.com/shorts/",
            "https://www.youtube.com/embed/"
        ]
        let match;
        let matchedUrl;

        for (const url of urls) {
            if (linkYoutube.startsWith(url)) {
                match = true;
                matchedUrl = url;
            }
        }
        if (match)
            setLinkYoutube('https://www.youtube.com/watch?v=' + linkYoutube.slice(matchedUrl.length, linkYoutube.length));
        else
            match = linkYoutube.startsWith('https://www.youtube.com/watch?v=')

        const isFoundChar = linkYoutube.indexOf('&') !== -1;
        if (match && !isFoundChar) {
            const id = linkYoutube.slice(32, linkYoutube.length);
            setYoutubeId(id);
            setIsLinkValid(true);
        } else {
            setIsLinkValid(false);
        }
    }, [linkYoutube])

    async function handleUploadClick() {
        if (!isLinkValid) {
            return;
        }
 
        const infoSong = {
            'owner': user._id,
            'creationtime': new Date(),
            'linkYoutube': linkYoutube
        }
        
        try {
            const payload = await MusicService.createMusic(infoSong, undefined, undefined, true);

            if (payload.code == 200) {
                audioContext.addAlbum(payload.data);
                onAlert({ code: payload.code, message: payload.message });
            }
            else {
                onAlert({ code: 500, message: payload.message });
            }

            setIsPopup(false);
            onState(true);
        } catch (error) {
           
        }
    }

    return (
        <>
            <h2>Add music with youtube</h2>
            <div>
                <div className="flex">
                    <span className="step">1</span>
                    <p>Enter link youtube</p>
                </div>
                <input type="text" placeholder="Ex: https://www.youtube.com/watch?v=9u1wkvVY7jc" value={linkYoutube} onChange={(e) => setLinkYoutube(e.target.value)} />
                <label className={`mt-5 ${isLinkValid ? 'd-none' : 'd-block'}`}>⚠️ Please enter url valid</label>
            </div>

            <div>
                <div className="flex">
                    <span className="step">2</span>
                    <p>Preview</p>
                </div>
                <iframe className="mt-10" width="100%" height="200px" src={`https://www.youtube.com/embed/${youtubeId}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            </div>

            <div className="flex justify-space-center">
                <button className="btn btn-black" onClick={handleUploadClick}>Upload Music</button>
            </div>
        </>
    )
}