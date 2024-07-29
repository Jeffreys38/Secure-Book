import { useEffect, useRef, useState } from 'react';
import { useUserContext } from '../contexts/UserContext.js';
import { PickerComponent, StoreComponent } from 'stipop-react-sdk'

/**
 * @param {function} showBoxReview: function hiển thị box review (nếu có) 
 * @param {function} setMedia: File object
 * @param {Ref} isActive: Trạng thái kích hoạt button khác, nếu nó là true thì không cho phép click vào button này
 * @returns 
 */
export default function StickerButton({ setSticker, showBoxReview }) {
    const apiKey = '387b2ec07761aa3ad91a5ee7854010a6'
    const { user } = useUserContext();
    const [isShowSticker, setIsShowSticker] = useState(null)
    const [isShowStore, setIsShowStore] = useState(null)
    const wrapStickerRef = useRef()

    async function openStore() {
        setIsShowStore(true)
        setIsShowSticker(false)
    }

    function openSticker() {
        setIsShowSticker(true)
        setIsShowStore(false)
    }

    // Nếu iSshowSticker là true và người dùng ấn ra ngoài #sticker-box thì sẽ tắt sticker
    useEffect(() => {
        function handleEventScreen(event) {
            if (!wrapStickerRef.current.contains(event.target)) {
                setIsShowSticker(false)
            }
           
        }
        document.addEventListener('click', handleEventScreen)
        return () => {
            document.removeEventListener('click', handleEventScreen)
        }
    }, [])

    return (
        <div id='wrap-sticker' className='z-top p-relative' ref={wrapStickerRef} style={{cursor: 'pointer'}}>
            <img
                id='sticker-button'
                className="icon-heading"
                src="https://img.icons8.com/external-icongeek26-linear-colour-icongeek26/64/external-Stickers-printing-icongeek26-linear-colour-icongeek26.png"
                alt="external-Stickers-printing-icongeek26-linear-colour-icongeek26"
                onClick={openSticker}
            />
            <div id='sticker-box'>
                {
                    (isShowSticker) ?
                        <PickerComponent

                            params={{
                                apikey: apiKey,
                                userId: user._id,
                            }}

                            storeClick={() => openStore()} // true

                            stickerClick={(sticker) => setSticker(sticker.url)}
                        />
                        :
                    (isShowStore) ?
                        <StoreComponent
                            params={{
                                apikey: apiKey,
                                userId: user._id,
                            }}
                            downloadParams={{
                                isPurchase: 'N',
                            }}

                            size={
                                {
                                    width: 430,
                                    height: 520
                                }
                            }
                            
                            onClose={openSticker}
                        />
                        : ""
                    }
            </div>
        </div>
    );
}