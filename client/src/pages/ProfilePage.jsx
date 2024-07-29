// MODULES
import { React, useEffect, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import AvatarEditor from "react-avatar-editor";
import { useUserContext } from '../contexts/UserContext.js';
import { useModalContext } from "../contexts/ModalContext.js";
import { getPostByUserId } from "../services/post.service.ts";
import MusicService from "../services/music.service";
import UserService from "../services/user.service";
import toDataUrl from "../utils/toDataUrl";
import canvasToFile from "../utils/canvasToFile";
import Resizer from 'react-image-file-resizer';

// COMPONENTS
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import PostProfile from "../components/PostProfile";
import MusicPlayerBar from "../components/MusicPlayerBar";
import InfiniteScroll from "react-infinite-scroll-component";
import MusicPlayerForm from "../components/MusicPlayerForm";
import AlertForm from "../components/AlertForm";
import PostMusicCard from "../components/PostMusicCard";
import ProfileForm from "../components/ProfileForm";

export default function Profile() {
    // State variables
    const [activeTab, setActiveTab] = useState('Posts');
    const [posts, setPosts] = useState([]);
    const [alertContent, setAlertContent] = useState({ code: 200, message: 'Upload successfully' });
    const [stateAlert, setStateAlert] = useState(false)
    const [tabComponent, setTabComponent] = useState([])
    const { setIsPopup, setModalForm } = useModalContext();

    // Ref variables
    const { user } = useUserContext();
    const limit = 6
    const offsetRef = useRef(0);
    const hasMoreRef = useRef(true)
    const domain = process.env.REACT_APP_SERVER_SERVICE + "/users";
    const isFetched = useRef(false);

    // Config cover photo
    const coverSizeRef = useRef();
    const [coverPhoto, setCoverPhoto] = useState(`${domain}/${user._id}/${user.coverPhoto}`)
    const editorRef = useRef(null);

    // Config Dropzone
    const [isHiddenDropZone, setIsHiddenDropZone] = useState(true)
    
    const [musicPlayer, setMusicPlayer] = useState(null);

    useEffect(() => {
        coverSizeRef.current = document.querySelector('#cover-photo').offsetWidth
    
        toDataUrl(coverPhoto, function(myBase64) {
            setCoverPhoto(myBase64)
        });
    }, [])

    useEffect(() => {
        setPosts([])
        offsetRef.current = 0
        hasMoreRef.current = true

        if (isFetched.current === false) {
            fetchMoreData()
        } else {
            isFetched.current = false;
        }
  
    }, [activeTab]);


    useEffect(() => {
        setTabComponent(loadResources())

    }, [posts]);


    const handleNavigation = (selectedTab) => {
        setActiveTab(selectedTab);
    };

    async function fetchMoreData() {
        isFetched.current = true
        let newPosts = []

        const payload = async () => {
            switch (activeTab) {
                case 'Posts':
                    const payload1 = await getPostByUserId(user._id, limit, offsetRef.current);
                    return payload1.data
                case 'Music':
                    const payload2 = await MusicService.getMusicByOwnerId(user._id, limit, offsetRef.current);
                    return payload2.data
            }
        }

        newPosts = await payload()

        if (newPosts.length < limit) {
            hasMoreRef.current = false
        }

        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        offsetRef.current += newPosts.length
    }

    function handleUpload() {
        setIsPopup(true)

        switch (activeTab) {
            case 'Posts':
                setModalForm("")
                break
            case 'Music':
                setModalForm(
                    <MusicPlayerForm
                        onAlert={(alert) => { setAlertContent(alert) }}
                        onState={(stateAlert) => { setStateAlert(stateAlert) }}
                    />
                )
                break
        }
    }

    const loadResources = () => {
        switch (activeTab) {
            case 'Posts':
                return posts.map((post, index) => (
                    <PostProfile
                        key={index}
                        _id={post._id}
                        image={post.image}
                        video={post.video}
                        embedYoutube={post.embedYoutube}
                        title={post.content}
                        totalEmoji={post.loves}
                        date={post.creationTime}
                    />
                ));

            case 'Music':
                return posts.map((post, index) => (
                    <PostMusicCard
                        setMusicPlayer={setMusicPlayer}
                        key={index}
                        card={post}
                    />
                ));
        }
    };

    function editProfile() {
        setIsPopup(true)

        setModalForm(
            <ProfileForm />
        )
    }

    const handleDrop = async (dropped) => {
        const droppedFile = dropped[0];

        // Convert file to blob
        let resize = await resizeFile(droppedFile, 1920, 1080)
        setCoverPhoto(resize); 
    };

    const resizeFile = (file) => {
        return new Promise(resolve => {
            Resizer.imageFileResizer(file, 1920, 1080, 'JPEG', 100, 0,
                uri => {
                    resolve(uri);
                }, 'file');
        })
    };

    function editCoverPhoto() {
        setIsHiddenDropZone(false)
    }

    async function updateCoverPhoto() {
        setIsHiddenDropZone(true)
        const canvasScaled = editorRef.current.getImageScaledToCanvas()
        const file = await canvasToFile(canvasScaled, "png", "image/jpeg", 1)

        const payload = await UserService.updateCover(user._id, file)

        // Render cover photo
        if (payload.code == 200) {
            toDataUrl(`${domain}/${user._id}/${payload.data.coverPhoto}`, function(base64) {
                setCoverPhoto(base64)
            });
        }
    }

    return (
        <div id="profile-app">
            <Header isSearchBar={false} title="Trang cá nhân" />
            
            <div id="wrap-content" className="flex h-100">
                <NavigationBar />
                <div className="flex-1">   
                    <div id="wrap-profile" className="flex h-100">
                        <div id="profile">
                            <InfiniteScroll
                                dataLength={posts.length}

                                next={fetchMoreData}

                                hasMore={hasMoreRef.current}

                                scrollableTarget="profile"
                            >
                                <div id="user-profile">
                                    {
                                        (isHiddenDropZone) ?   
                                        <div id="cover-photo" style={
                                            {
                                                backgroundImage: `url('${coverPhoto}')`
                                            }
                                        }>
                                            <button className="btn icon" onClick={editCoverPhoto}>Thay đổi ảnh bìa</button>
                                        </div> 
                                        :
                                        <Dropzone
                                            onDrop={handleDrop}
                                            noClick
                                            noKeyboard
                                            style={{ width: "1920px", height: "1080px"}}
                                        >
                                        {({ getRootProps, getInputProps }) => (
                                            <div id="cover-photo" {...getRootProps()} title="Bạn có thể kéo thả ảnh vào đây ♥️✋">
                                                <AvatarEditor
                                                    ref={editorRef}
                                                    border={0}
                                                    width={coverSizeRef.current}
                                                    height={280}
                                                    image={coverPhoto}
                                                />
                                                <input {...getInputProps()} />

                                                <button className="btn icon" onClick={updateCoverPhoto}>Xác nhận thay đổi</button>
                                            </div>
                                        )}
                                        </Dropzone>
                                    }

                                    {/* USER AVATAR */}
                                    <div id="profile-picture" style={{
                                        backgroundImage: `url("${domain}/${user._id}/${user.avatar}")`
                                    }
                                    }></div>
                                    <div id="user-info">
                                        <h1>{user.firstName + " " + user.lastName}</h1>
                                        <div id="user-info-job">Developer</div>
                                        <div className="row justify-space-center">
                                            <p id="user-info-intro">{user.bio}</p>
                                        </div>
                                        <div id="user-info-statistical">
                                            <div id="user-info-statistical-posting">
                                                <h1>{user.totalPost}</h1>
                                                <span>Bài viết</span>
                                            </div>
                                            <div id="user-info-statistical-follower">
                                                <h1>{ (user.follows ) ? (user.follows.length) : 0 }</h1>
                                                <span>Lượt theo dõi</span>
                                            </div>
                                            <div id="user-info-statistical-following">
                                                <h1>{user.friends.length}</h1>
                                                <span>Bạn bè</span>
                                            </div>
                                        </div>
                                        <div id="user-info-btn">
                                            <span id="user-info-btn-editProfile" onClick={editProfile}>Chỉnh sửa hồ sơ</span>
                                            <span id="user-info-btn-shareProfile">Chia sẻ</span>
                                        </div>

                                        {/* NAVIGATION */}
                                        <div id="navigation" className="flex">
                                            <p className={activeTab === 'Posts' ? 'text-actived' : ''} onClick={() => handleNavigation('Posts')}>Bài viết</p>
                                            <p className={activeTab === 'Music' ? 'text-actived' : ''} onClick={() => handleNavigation('Music')}>Âm nhạc</p>
                                        </div>

                                        <span className="material-symbols-outlined pointer" onClick={handleUpload}>
                                            upload
                                        </span>

                                        <div id="content">
                                            {tabComponent}
                                        </div>
                                    </div>
                                </div>
                            </InfiniteScroll>

                            <MusicPlayerBar musicPlayer={musicPlayer} />       
                        </div>
                    </div>
                </div>

            </div>

            {/* ALERT FORM */}
            <AlertForm
                stateAlert={stateAlert}
                setStateAlert={(stateAlert) => { setStateAlert(stateAlert) }}
                code={alertContent.code}
                message={alertContent.message}
            />
        </div>
    );
}