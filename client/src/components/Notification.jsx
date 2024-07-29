import { useEffect, useState } from "react"
import MessageService from "../services/message.service"
import socket from "../socket/socket-client"

export default function Notification() {
    const [isShowNotification, setIsShowNotification] = useState(false)
    const domain = process.env.REACT_APP_SERVER_SERVICE;
    const [inbox, setInbox] = useState([]);
    const [isRead, setIsRead] = useState(false);
    const limit = 4;

    useEffect(() => {
        fetchMessages()

        // Inbox real-time
        socket.on("notification", (lastMessages) => {
            setIsRead(false);
            setInbox(lastMessages);
        })
    }, [])


    const LastMessages = inbox.map((message, index) => (

        <li id={index} className='notification_actions'>
            <img className='avatar' src={`${domain}/users/${message.sender._id}/${message.sender.avatar}`}></img>
            <div>
                <b>{message.sender.firstName} {message.sender.lastName}</b>
                <p>{message.content}</p>
            </div>
        </li>
    ))

    async function fetchMessages() {
        const response = await MessageService.getMessagesByOwner(limit);

        if (response.code === 200) {
            setInbox(response.data)
        }
    }

    function showNotification() {
        setIsRead(true)
        setIsShowNotification(!isShowNotification)
    }

    function seeAll() {
        window.location.href = "/chat";
    }

    return (
        <div id='notification'>
            <div style={
                {
                    position: "relative"
                }
            }>
                <img onClick={showNotification} className='header-icon' src="https://img.icons8.com/plasticine/100/appointment-reminders.png" alt="appointment-reminders" />
                { !isRead ? <span style={
                    {
                        position: 'absolute',
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: "red",
                        right: "2px",
                        top: "2px"
                    }
                }></span> : null }
            </div>
            {
                (isShowNotification) ?
                    <ul>
                        <header>
                            <h3>Tin nhắn đến</h3>
                            <a className='notification_actions' style={
                                {
                                    cursor: 'pointer'
                                }
                            }>Đánh dấu đã đọc</a>
                        </header>

                        <div id='notification_content'>{ LastMessages }</div>

                        <a onClick={seeAll} id='seeAll'>Xem tất cả tin nhắn</a>
                    </ul>
                    :
                    null
            }
        </div>
    )
}