import { useState } from "react";
import Resizer from 'react-image-file-resizer';
import MusicService from "../services/music.service.js";
import { useUserContext } from "../contexts/UserContext.js";
import { useModalContext } from "../contexts/ModalContext.js";

export default function ManualMusicUploadForm({ onAlert, onState }) {
    const [nameSong, setNameSong] = useState("")
    const [author, setAuthor] = useState("")

    const [music, setMusic] = useState("")
    const [fileName, setFileName] = useState('No file chosen');

    const [songImage, setSongImage] = useState(null);
    const [songImageFile, setSongImageFile] = useState('');

    const [isSongNameValid, setIsSongNameValid] = useState(true)
    const [isAuthorValid, setIsAuthorValid] = useState(true)


    const { user } = useUserContext();
    const { setIsPopup } = useModalContext();

    const handleFileChange = (e) => {
        const fileInput = e.target;
        if (fileInput.files.length > 0) {
            setFileName(fileInput.files[0].name);
            setMusic(fileInput.files[0])
        } else {
            setFileName('Không có file được tải lên');
        }
    };

    const resizeFile = (file) => {
        return new Promise(resolve => {
            Resizer.default.imageFileResizer(file, 295, 300, 'JPEG', 100, 0,
                uri => {
                    resolve(uri);
                }, 'file');
        })
    };

    const handleImageChange = async (e) => {
        const fileInput = e.target;
        if (fileInput.files.length > 0) {
            const resizeImage = await resizeFile(fileInput.files[0]);

            setSongImageFile(resizeImage);

            // Use FileReader to read the image and set it as a preview
            const reader = new FileReader();
            reader.onload = (event) => {
                setSongImage(event.target.result);
            };
            reader.readAsDataURL(resizeImage);

        } else {
            setSongImage('Không có ảnh nào được chọn');
        }
    }

    const handleUploadClick = async () => {
        if (nameSong.trim() == "") {
            return
        }
        if (author.trim() == "") {
            return
        }
        if (music == "") {
            return
        }

        const infoSong = {
            'name': nameSong,
            'author': author,
            'owner': user._id,
            'creationtime': new Date()
        }

        // Add music to database     
        const payload = await MusicService.createMusic(infoSong, music, songImageFile)

        setIsPopup(false);
        onAlert({ code: payload.code, message: payload.message });
        onState(true);

        resetForm();
    };

    const resetForm = () => {
        setNameSong("")
        setAuthor("")
        setFileName('No file chosen')
    }

    return (
        <>
            <h2>Add music</h2>
            <div>
                <div className="flex">
                    <span className="step">1</span>
                    <p>Enter name song</p>
                </div>
                <input maxLength={24} type="text" placeholder="Ex: Điều cha chưa nói" value={nameSong} onChange={(e) => setNameSong(e.target.value)} />
                <label className={`mt-5 ${isSongNameValid ? 'd-none' : 'd-block'}`}>⚠️ Please enter name song valid</label>
            </div>

            <div>
                <div className="flex">
                    <span className="step">2</span>
                    <p>Enter author</p>
                </div>
                <input maxLength={24} type="text" placeholder="Ex: Ali Hoàng Dương" value={author} onChange={(e) => setAuthor(e.target.value)} />
                <label className={`mt-5 ${isAuthorValid ? 'd-none' : 'd-block'}`}>⚠️ Please enter author name valid</label>
            </div>

            <div>
                <div className="flex">
                    <span className="step">3</span>
                    <p>Upload your song</p>
                </div>
                <div className="uploadButton">
                    <input
                        type="file"
                        id="actual-btn-song"
                        hidden
                        onChange={handleFileChange}
                        accept=".mp3, .wav, .flac"
                    />
                    <label htmlFor="actual-btn-song">Choose File</label>
                    <span id="file-chosen">{fileName}</span>
                </div>
            </div>

            <div>
                <div className="flex">
                    <span className="step">4</span>
                    <p>Upload image</p>
                </div>
                <div className="uploadButton">
                    <input
                        type="file"
                        id="actual-btn-image"
                        hidden
                        onChange={handleImageChange}
                        accept="image/png, image/gif, image/jpeg"
                    />
                    <label htmlFor="actual-btn-image">Choose File</label>
                </div>
            </div>

            {/* PREVIEW SONG */}
            <div>
                <div className="flex">
                    <span className="step">5</span>
                    <p>Preview song</p>
                </div>

                <div className="row flex-column align-items-center">
                    <div id="preview-song" className="mt-5">
                        <img src={songImage} alt="" />

                        <div>
                            <h3>{nameSong}</h3>
                            <p className="mt-5">{author}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-space-center">
                <button className="btn btn-black" onClick={handleUploadClick}>Upload Music</button>
            </div>
        </>
    )
}