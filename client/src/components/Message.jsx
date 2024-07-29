import { useUserContext } from '../contexts/UserContext.js';
/**
* Message component = 1 message
* @param {Number} owner
* @param {Object} chat
* @param {Number} currentUser
*/
export default function Message({ message }) {
    const { receiver, sender, content, timestamp } = message;
    const domain = process.env.REACT_APP_SERVER_SERVICE;
    const { user } = useUserContext();
    const isOwner = sender._id === user._id;
    const ownerClass = isOwner ? "comment-right" : "comment-left";
    
  
    return (
      <div className={`comment ${ownerClass}`}>
        {isOwner || (
          <img
            className="avatar"
            src={`${domain}/users/${sender._id}/${sender.avatar}`}
            alt="avatar"
          />
        )}
        <div className="box">
          {isOwner || <b className="sender">{sender.firstName} {sender.lastName}</b>}
          <p className="text">{content}</p>
        </div>
      </div>
    );
  }  