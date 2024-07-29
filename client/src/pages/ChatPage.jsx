import React, { useEffect, useRef, useState } from "react";
import Headers from '../components/Header';
import ListChat from "../components/ListChat";
import TextareaAutosize from 'react-textarea-autosize';
import Message from "../components/Message";
import NavigationBar from "../components/NavigationBar"
import ComingSoonPage from './ComingSoonPage'
import StickerButton from "../components/StickerButton.jsx";
import { useUserContext } from '../contexts/UserContext.js';
import MessageService from "../services/message.service";
import socket from "../socket/socket-client";

export default function Chat() {
    const domain = process.env.REACT_APP_SERVER_SERVICE
    const [message, setMessage] = useState("");
    const [converstation, setConversation] = useState([])
    const [selectedFriend, setSelectedFriend] = useState(null);
    const { user } = useUserContext();
    const lastMessageRef = useRef(null);
    const [isAccess, setIsAccess] = useState(true)

    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });

    }, [converstation]);

    useEffect(() => {
        socket.on("new-message", (newMessage) => {
            const updatedMessages = [...converstation, newMessage];
            console.log(newMessage)
            setConversation(updatedMessages);
        })

        return () => {
            socket.off("new-message");
        }
    })

    useEffect(() => {
        if (selectedFriend) {
            // Get conversation between user and selected friend
            const getConversation = async () => {
                const payload = await MessageService.getConversation(user._id, selectedFriend._id);
                setConversation(payload.data);
            }

            getConversation();

        }
    }, [selectedFriend]);

    async function addMessage() {
        if (message != "") {
            const payload = {
                senderId: user._id,
                content: message,
                timestamp: Date.now(),
                receiverId: selectedFriend._id
            }
            setMessage("");

            const response = MessageService.createMessage(payload);
        }
    }

    if (!isAccess) {
        return <ComingSoonPage title="You don't have any friends" />
    }

    return (
        <div id="chat-app">
            <Headers customStyle='header-chat' title="Nhắn tin" />

            <div id="wrap-content" className="flex width-100">
                <NavigationBar />
                <div id="wrap-message" className="row">
                    <ListChat setSelectedFriend={setSelectedFriend} />

                    {/* Chat Box */}
                    <div className="parent flex-1">
                        <div id="boxChat" className="row justify-space-between">

                            {/* Avatar and Name */}
                            <div className="row align-items-center">
                                <img
                                    className="avatar"
                                    src={(selectedFriend) ? `${domain}/users/${selectedFriend._id}/${selectedFriend.avatar}` : ""}
                                    alt="avatar"
                                />

                                <div className="ml-15">
                                    <h3>{(selectedFriend) ? selectedFriend.firstName + " " + selectedFriend.lastName : ""}</h3>
                                    <p>Online</p>
                                </div>
                            </div>

                            {/* List Icons */}
                            <div className="row">
                                <a className="icon-effect" href="#">
                                    <span className="material-symbols-outlined">
                                        call
                                    </span>
                                </a>
                                <a className="icon-effect" href="#">
                                    <span className="material-symbols-outlined">
                                        smart_display
                                    </span>
                                </a>
                            </div>
                        </div>

                        {/* Chat Messages View */}
                        <div id="viewchat">
                            {
                                converstation.map((message, index) => (
                                    <Message key={index} message={message} />
                                ))
                            }
                            <div ref={lastMessageRef}></div>
                        </div>

                        {/* Message Input Box */}
                        <div id="boxMessage" className="row">
                            <ul className="row">
                                <li><StickerButton /></li>
                                <li><StickerButton /></li>
                                <li><StickerButton /></li>
                            </ul>
                            <div className="row">
                                <TextareaAutosize
                                    placeholder="Enter a message"
                                    onChange={e => setMessage(e.target.value)}
                                    value={message}
                                />
                                <img onClick={addMessage} id="btn" width="36" height="36" src="https://img.icons8.com/sf-regular/48/paper-plane.png" alt="paper-plane" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
