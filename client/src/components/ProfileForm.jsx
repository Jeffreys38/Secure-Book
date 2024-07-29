import { useState, useRef, useEffect } from "react";
import { useUserContext } from '../contexts/UserContext.js';
import AvatarEditor from 'react-avatar-editor'
import Dropzone from 'react-dropzone'
import UserService from "../services/user.service";
import toDataUrl from "../utils/toDataUrl";
import canvasToFile from "../utils/canvasToFile";

/**
 * ProfileForm (component)
 * @param {object}
 * @param {object}
 * @param {function}
 */
export default function ProfileForm() {
    const { user } = useUserContext();
    const sizeAvatar = 150;
    const domain = `${process.env.REACT_APP_SERVER_SERVICE}/users/`;
    const editorRef = useRef(null);

    const [firstName, setFirstName] = useState(user.firstName);
    const [firstNameNotification, setFirstNameNotification] = useState("");

    const [lastName, setLastName] = useState(user.lastName);
    const [lastNameNotification, setLastNameNotification] = useState("");

    const [avatar, setAvatar] = useState(domain + user._id + "/" + user.avatar);
    const [avatarNotification, setAvatarNotification] = useState("");

    const [bio, setBio] = useState(user.bio);
    const [bioNotification, setBioNotification] = useState("");

    useEffect(() => {
        toDataUrl(avatar, function(myBase64) {
            setAvatar(myBase64)
        });
    }, [])

    function handleChange(e) {
        switch (e.target.name) {
            case "firstName":
                setFirstName(e.target.value);
                break;
            case "lastName":
                setLastName(e.target.value);
                break;
            case "bio":
                setBio(e.target.value);
                break;
            default:
                break;
        }
    }

    const handleDrop = (dropped) => {
        const droppedFile = dropped[0];
        setAvatar(droppedFile); 
    };

    async function updateProfile(e) {
        let data;
        
        switch (e.target.name) {
            case "firstName":
                data = { firstName };
                break;
            case "lastName":
                data = { lastName };
                break;
            case "bio":
                data = { bio };
                break;
        }

        let payload = ""
        if (e.target.name == "avatar") {
            // If you want the image resized to the canvas size (also a HTMLCanvasElement)
            const canvasScaled = editorRef.current.getImageScaledToCanvas()
            const file = await canvasToFile(canvasScaled, "png", "image/jpeg", 1)
            
            payload = await UserService.updateAvatar(user._id, file)
        } else {
            payload = await UserService.updateUser(user._id, data)
        }
        
        if (payload.code == 200) {
            e.target.classList.add("btn-success");
            e.target.innerHTML = "Thành công";

            switch (e.target.name) {
                case "avatar":
                    setAvatarNotification("Vui lòng tải lại trang để xem thay đổi");
                    break;
            }

            setTimeout(() => {
                resetButton(e, "btn-success", "Thay đổi")
            }, 2000)
        } else if (payload.code == 500) {
            e.target.classList.add("btn-danger");
            e.target.innerHTML = "Thất bại";

            setTimeout(() => {
                resetButton(e, "btn-danger", "Thay đổi")
            }, 2000)
        }
    }

    function resetButton(e, classRemoved, defaultText) {
        e.target.classList.remove(classRemoved);
        e.target.innerHTML = defaultText;
    }

    return (
        <div className="modalForm">
            <h2>Cập nhật trang cá nhân</h2>

            <div>
                <div className="flex">
                    <span className="step">1</span>
                    <p>Thay đổi họ</p>
                </div>
                <div className="row justify-content-space-between">
                    <div>
                        <input maxLength={24} type="text" name="firstName" placeholder="" value={firstName} onChange={(e) => handleChange(e)} />
                        <p className={`mt-5`}>{firstNameNotification}</p>
                    </div>
                    <button className="btn" onClick={(e) => { updateProfile(e) }} name="firstName">Thay đổi</button>
                </div>
            </div>

            <div>
                <div className="flex">
                    <span className="step">2</span>
                    <p>Thay đổi tên</p>
                </div>
                <div className="row justify-content-space-between">
                    <div>
                        <input maxLength={24} type="text" name="lastName" placeholder="" value={lastName} onChange={(e) => handleChange(e)} />
                        <p className={`mt-5`}>{lastNameNotification}</p>
                    </div>
                    <button className="btn" onClick={(e) => { updateProfile(e) }} name="lastName">Thay đổi</button>
                </div>
            </div>

            <div>
                <div className="flex">
                    <span className="step">3</span>
                    <p>Bio (tiểu sử)</p>
                </div>
                <div className="row justify-content-space-between">
                    <div style={
                        {
                            width: "70%"
                        }
                    }>
                        <textarea rows={3} maxLength={120} type="text" name="bio" placeholder="" value={bio} onChange={(e) => handleChange(e)} />
                        <p className={`mt-5`}>{bioNotification}</p>
                    </div>
                    <button className="btn" onClick={(e) => { updateProfile(e) }} name="bio">Thay đổi</button>
                </div>
            </div>

            <div>
                <div className="flex">
                    <span className="step">4</span>
                    <p>Đổi ảnh đại diện (Bạn có thể kéo thả ảnh vào đây)</p>
                </div>
                <div id="preview-avatar" className="mt-5">

                    {/* <img width="100%" height="100%" src="http://localhost:8030/users/default.jpeg"></img> */}
                    <Dropzone
                        onDrop={handleDrop}
                        noClick
                        noKeyboard
                        style={{ width: sizeAvatar + "px", height: sizeAvatar + "px" }}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps()}>
                                <AvatarEditor 
                                ref={editorRef}
                                width={sizeAvatar} height={sizeAvatar} image={avatar} borderRadius={100} />
                                <input {...getInputProps()} />
                            </div>
                        )}
                    </Dropzone>
                </div>
                <p className={`mt-5`}>{avatarNotification}</p>
                <button className="btn mt-5" onClick={(e) => { updateProfile(e) }} name="avatar">Thay đổi ảnh đại diện</button>
            </div>
        </div>
    )
}