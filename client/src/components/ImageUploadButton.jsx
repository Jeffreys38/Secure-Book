import { useRef } from 'react'
import Resizer from 'react-image-file-resizer';

/**
 * @param {function} showBoxReview: function hiển thị box review (nếu có) 
 * @param {function} setMedia: File object
 * @param {Ref} mediaSourceRef: DOM element của div hiển thị background image (render image)
 * @param {Ref} isActive: Trạng thái kích hoạt button khác, nếu nó là true thì không cho phép click vào button này
 * @returns 
 */
export default function ImageUploadButton({ isActive, setMedia }) {
    const imageInputRef = useRef()

    async function handleMediaChange(event) {
        const file = event.target.files[0]

        if (file) {
            // Cho toàn bộ sự kiện khi click vào nút tải ảnh, tải video biêt đang có 1 file đang được hiển thị
            isActive.current = true

            // Render
            const resize = await resizeFile(file)
            setMedia(resize)
        }
    }

    const resizeFile = (file) => {
        return new Promise(resolve => {
            Resizer.imageFileResizer(file, 1920, 1080, 'JPEG', 100, 0,
                uri => {
                    resolve(uri);
                }, 'file');
        })
    };

    return (
        <div>
            <img
                className="icon-heading"
                src="https://img.icons8.com/pulsar-color/48/pictures-folder.png"
                alt="pictures-folder"
                onClick={(e) => !isActive.current && imageInputRef.current.click()}
            />

            <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleMediaChange}
                ref={imageInputRef}
                multiple
                name='image'
            />
        </div>
    );
}