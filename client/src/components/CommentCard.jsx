export default function CommentCard({comment}) {
    const domain = process.env.REACT_APP_SERVER_SERVICE;

    return (
        <div className="comment">
            <img
                className="avatar"
                src={`${domain}/users/${comment.owner._id}/${comment.owner.avatar}`}
                alt="avatar"
            />
            <div >
                <div className="box">
                    <b className="sender">{comment.owner.firstName + " " + comment.owner.lastName}</b>
                    <p className="text">{comment.content}</p>
                </div>

                {
                    (comment.sticker) ? <img className="sticker" src={comment.sticker}></img> : null
                }
            </div>
        </div>
    )
}