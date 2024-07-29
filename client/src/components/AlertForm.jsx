import { useEffect, useRef } from "react"

/**
 * Notifications (warnings)
 * @param {bool} stateAlert Status alert, true: show alert, otherwise: hidden alert
 * @param {void} setStateAlert Set status alert
 * @param {int} code Code
 * @param {string} message Message alert
 */
export default function AlertForm({stateAlert, setStateAlert, code, message}) {
    const timeHiddenRef = useRef(3400) // miliseconds
    const alertFormRef = useRef()

    useEffect(() => {
        if (stateAlert) {
            setTimeout(() => {
                alertFormRef.current.classList.replace("d-block", "d-none")
                setStateAlert(false)

            }, timeHiddenRef.current)
        }
    }, [stateAlert])

    const alertClass = (code === 200) ? "success" : "failed";

    return (
        <div ref={alertFormRef} id="alertForm" className={`${(stateAlert) ? "d-block" : "d-none"} ${alertClass}`}>
            <p>{message}</p>
        </div>
    )
}