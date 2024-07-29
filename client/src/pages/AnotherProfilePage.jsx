import { React, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

// COMPONENTS
import Header from "../components/Header";
import NavigationBar from "../components/NavigationBar";
import PostProfile from "../components/PostProfile";
import MusicPlayerBar from "../components/MusicPlayerBar";
import InfiniteScroll from "react-infinite-scroll-component";
import AlertForm from "../components/AlertForm";
import PostMusicCard from "../components/PostMusicCard";

import { getPostByUserId } from "../services/post.service.ts";
import { useUserContext } from '../contexts/UserContext.js';
import MusicService from "../services/music.service";
import UserService from "../services/user.service";
import FriendService from "../services/friend.service";
import ActionTypes from "../enums/UserActions";

export default function AnotherProfilePage() {
    // State variables
    const [activeTab, setActiveTab] = useState('Posts');
    const [posts, setPosts] = useState([]);
    const [alertContent, setAlertContent] = useState({ code: 200, message: 'Upload successfully' });
    const [stateAlert, setStateAlert] = useState(false)
    const [tabComponent, setTabComponent] = useState([])
    const { user } = useUserContext();

    // Redirect to Profile by id
    let { userId } = useParams();
    const [infoUser, setInfoUser] = useState({});

    // Ref variables
    const limit = 6
    const offsetRef = useRef(0);
    const hasMoreRef = useRef(true)
    const domain = process.env.REACT_APP_SERVER_SERVICE + "/users/" + userId;
    const isFetched = useRef(false);

    const [isFriend, setIsFriend] = useState(false)
    const [isFollow, setIsFollow] = useState(false)
    const [musicPlayer, setMusicPlayer] = useState(null);

    useEffect(() => {
        // Get data profile by id
        UserService.getUser(userId).then((res) => {
            // fetchMoreData()
            setInfoUser(res.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [userId]);

    useEffect(() => {
        // Get data profile by id
        if (infoUser) {
            const listFollow = user.follows || []
            const listFriend = user.friends || []

            if (listFollow.includes(infoUser._id)) {
                setIsFollow(true)
            }

            if (listFriend.includes(infoUser._id)) {
                setIsFriend(true)
            }
        }
    }, [infoUser]);

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
        let newPosts = []

        const payload = async () => {
            switch (activeTab) {
                case 'Posts':
                    const payload1 = await getPostByUserId(userId, limit, offsetRef.current);
                    return payload1.data
                case 'Music':
                    const payload2 = await MusicService.getMusicByOwnerId(userId, limit, offsetRef.current);
                    return payload2.data
            }
        }

        newPosts = await payload()

        if (newPosts.length === 0) {
            hasMoreRef.current = false
        }

        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        offsetRef.current += newPosts.length
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

    async function followUser() {
        // Get list follow of this user
        const listFollow = user.follows || []

        // Add current user to list follow
        if (!isFollow)
            listFollow.push(infoUser._id)
        else
            listFollow.splice(listFollow.indexOf(infoUser._id), 1)

        // Update list follow of this user
        const payload = await UserService.updateUser(user._id, { follows: listFollow })

        if (payload.code === 200) {
            setIsFollow(!isFollow)
        }
    }

    async function addFriend() {
        // Get list follow of this user
        const listFriend = user.friends || []

        // Add current user to list follow
        if (!isFriend)
            listFriend.push(infoUser._id)
        else
            listFriend.splice(listFriend.indexOf(infoUser._id), 1)

        // Update list follow of this user
        const payload = await FriendService.updateFriend(user._id, { friends: listFriend })

        if (payload.code === 200) {
            setIsFriend(!isFriend)
        }
    }

    return (
        <div id="profile-app">
            <Header isSearchBar={true} title="Profile" />
            
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
                                    <div id="cover-photo" style={
                                        {
                                            backgroundImage: `url('${domain}/${infoUser.coverPhoto}')`
                                        }
                                    }>
                                    </div>

                                    {/* USER AVATAR */}
                                    <div id="profile-picture" style={{
                                        backgroundImage: `url("${domain}/${infoUser.avatar}")`
                                    }
                                    }></div>
                                    <div id="user-info">
                                        <h1>{infoUser.firstName + " " + infoUser.lastName}</h1>
                                        <div id="user-info-job">Developer</div>
                                        <div className="row justify-space-center">
                                            <p id="user-info-intro">{infoUser.bio}</p>
                                        </div>
                                        <div id="user-info-statistical">
                                            <div id="user-info-statistical-posting">
                                                <h1>{infoUser.totalPost}</h1>
                                                <span>Posting</span>
                                            </div>
                                            <div id="user-info-statistical-follower">
                                                <h1>{ (infoUser.follows ) ? (infoUser.follows.length) : 0 }</h1>
                                                <span>Following</span>
                                            </div>
                                            <div id="user-info-statistical-following">
                                                <h1>{(infoUser.friends) ? infoUser.friends.length : 0}</h1>
                                                <span>Friends</span>
                                            </div>
                                        </div>
                                        <div id="user-info-btn">
                                            <span id="user-info-btn-editProfile" onClick={followUser}>{(isFollow) ? ActionTypes.UNFOLLOW_FRIEND : ActionTypes.FOLLOW_FRIEND}</span>
                                            <span id="user-info-btn-shareProfile" onClick={addFriend}>{(isFriend) ? ActionTypes.REMOVE_FRIEND : ActionTypes.ADD_FRIEND}</span>
                                        </div>

                                        {/* NAVIGATION */}
                                        <div id="navigation" className="flex">
                                            <p className={activeTab === 'Posts' ? 'text-actived' : ''} onClick={() => handleNavigation('Posts')}>Posts</p>
                                            <p className={activeTab === 'Music' ? 'text-actived' : ''} onClick={() => handleNavigation('Music')}>Music</p>
                                        </div>

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