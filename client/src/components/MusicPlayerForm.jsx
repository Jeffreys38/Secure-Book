import { useState } from "react";
import ManualMusicUploadForm from "../forms/ManualMusicUploadForm";
import YoutubeMusicUploadForm from "../forms/YoutubeMusicUploadForm";

/**
 * Notifications (warnings)
 * @param {object} onPopup true: MusicPlayerForm will be show, otherwise
 * @param {object} onAlert { code, message }
 * @param {function} onState true (show alert) or false (hidden alert)
 */
export default function MusicPlayerForm({ onAlert, onState }) {
    // Hình thức upload nhạc
    const [isChooseLinkYoutube, setIsChooseLinkYoutube] = useState(true)
    const [isChooseManual, setIsChooseManual] = useState(false)

    return (
        <div className="modalForm">
         {
            (isChooseManual)
            ? <ManualMusicUploadForm onAlert={onAlert} onState={onState} /> 
            : <YoutubeMusicUploadForm onAlert={onAlert} onState={onState}/>
         }
        </div>
    )
}