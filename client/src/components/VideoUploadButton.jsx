import { useRef } from 'react'

/**
 * @param {function} showBoxReview: function hiển thị box review (nếu có) 
 * @param {function} setMedia: File object
 * @param {Ref} isActive: Trạng thái kích hoạt button khác, nếu nó là true thì không cho phép click vào button này
 * @returns 
 */
export default function VideoUploadButton({isActive, setMedia }) {
    const videoInputRef = useRef()

    async function handleMediaChange(event) {
        const file = event.target.files[0]

        if (file) {
            // Cho toàn bộ sự kiện khi click vào nút tải ảnh, tải video biêt đang có 1 file đang được hiển thị
            isActive.current = true
            
            // Render
            setMedia(file)
        }
    }

    return (
        <div>
            <img
                className="icon-heading"
                src="https://img.icons8.com/pulsar-color/48/video.png"
                onClick={(e) => !isActive.current && videoInputRef.current.click()}
                alt="video"
            />

            <input
                type="file"
                accept=".mp4, .mkv, .avi, .mov, .flv, .wmv, .webm"
                style={{ display: 'none' }}
                onChange={handleMediaChange}
                ref={videoInputRef}
                multiple
                name='video'
            />
        </div>
    );
}