import { useEffect, useRef, useState } from "react";

const ComingSoonPage = ({ title }) => {
  const [isPlay, setIsPlay] = useState(false);
  const videoRef = useRef();
  const thumbnailRef = useRef();
  const overlayRef = useRef();
  const screenRef = useRef();
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const server =
      process.env.REACT_APP_SEVER_IP + ":" +
      process.env.REACT_APP_SERVER_PORT;

    videoRef.current.src = `${server}/videos/comingSoon.mp4`;
    thumbnailRef.current.style.backgroundImage = `url(${server}/uploads/1698588173769.jpeg)`;

    const expectedDate = new Date('2023-12-01T00:00:00');
    const interval = setInterval(() => {
      const currentTime = new Date();
      const timeDifference = expectedDate - currentTime;

      if (timeDifference <= 0) {
        clearInterval(interval);
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
      const seconds = Math.floor((timeDifference / 1000) % 60);

      setTimeRemaining({ days, hours, minutes, seconds });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  function handleEventScreen(event) {
    let timeDuration

    if (event.target.closest('.contact100-form')) {
      return;
    }

    if (isPlay) {
      // Pause video
      clearTimeout(timeDuration)
      overlayRef.current.style.display = 'flex'
      overlayRef.current.style.justifyContent = 'center'
      videoRef.current.pause()
      setIsPlay(false)
    } else {
      setIsPlay(true)

      timeDuration = setTimeout(function () {
        overlayRef.current.style.display = 'none'
        return new Promise(() => {
          return true
        })
      }, 2200)

      videoRef.current.play()
    }
  }

  return (
    <>
      {/*===============================================================================================*/}
      <link rel="icon" type="image/png" href="./images/icons/favicon.ico" />
      {/*===============================================================================================*/}
      <link
        rel="stylesheet"
        type="text/css"
        href="./vendor/bootstrap/css/bootstrap.min.css"
      />
      {/*===============================================================================================*/}
      <link
        rel="stylesheet"
        type="text/css"
        href="./fonts/font-awesome-4.7.0/css/font-awesome.min.css"
      />
      {/*===============================================================================================*/}
      <link
        rel="stylesheet"
        type="text/css"
        href="./fonts/iconic/css/material-design-iconic-font.min.css"
      />
      {/*===============================================================================================*/}
      <link rel="stylesheet" type="text/css" href="./vendor/animate/animate.css" />
      {/*===============================================================================================*/}
      <link
        rel="stylesheet"
        type="text/css"
        href="./vendor/select2/select2.min.css"
      />
      {/*===============================================================================================*/}
      <link rel="stylesheet" type="text/css" href="./css/util.css" />
      <link rel="stylesheet" type="text/css" href="./css/main.css" />
      {/*===============================================================================================*/}
      {/*  */}
      <div ref={screenRef} onClick={(e) => handleEventScreen(e)} className="parent flex-col-c-sb size1 overlay1 p-l-75 p-r-75 p-t-20 p-b-40 p-lr-15-sm">
        <video ref={videoRef} className={(!isPlay) ? "hidden" : ""} id="video" />
        <div ref={thumbnailRef} className={(isPlay) ? "hidden" : ""} id="backgroundTheme"></div>
        {/*  */}
        <div style={
          {
            alignItems: "center",
            justifyContent: "space-between"
          }
        } className="w-full flex-w flex-b p-t-15 p-b-15 p-r-36">
          <div className="flex-w flex-b m-r-22 m-t-8 m-b-8 center">
            <span className="l1-txt1 wsize1 days">{timeRemaining.days}</span>
            <span className="m1-txt1 p-b-2">Days</span>
          </div>
          <div className="flex-w flex-b m-r-22 m-t-8 m-b-8 center">
            <span className="l1-txt1 wsize1 hours">{timeRemaining.hours}</span>
            <span className="m1-txt1 p-b-2">Hr</span>
          </div>
          <div className="flex-w flex-b m-r-22 m-t-8 m-b-8 center">
            <span className="l1-txt1 wsize1 minutes">{timeRemaining.minutes}</span>
            <span className="m1-txt1 p-b-2">Min</span>
          </div>
          <div className="flex-w flex-b m-r-22 m-t-8 m-b-8 center">
            <span className="l1-txt1 wsize1 seconds">{timeRemaining.seconds}</span>
            <span className="m1-txt1 p-b-2">Sec</span>
          </div>
          <div className="m-t-10 m-b-10">
            <a href="#" className="size2 s1-txt1 flex-c-m how-btn1 trans-04">
              Coming soon
            </a>
          </div>
        </div>
        {/*  */}
        <div ref={overlayRef} className="flex-col-c-m p-l-15 p-r-15 p-t-80 p-b-90">
          <h3 style={
            {
              fontSize: '91px'
            }
          } className="l1-txt2 txt-center p-b-55 respon1">{title}</h3>
          <div>
            <button style={
              {
                transition: "all 0.6"
              }
            } className="how-btn-play1 flex-c-m">
              <i className={(isPlay) ? "zmdi zmdi-pause" : "zmdi zmdi-play"} />
            </button>
          </div>
        </div>
        <div className="flex-sb-m flex-w w-full">
          {/*  */}
          <div className="flex-w flex-c-m m-t-10 m-b-10">
            <a
              href="#"
              className="size3 flex-c-m how-social trans-04 m-r-3 m-l-3 m-b-3 m-t-3"
            >
              <i className="fa fa-facebook" />
            </a>
            <a
              href="#"
              className="size3 flex-c-m how-social trans-04 m-r-3 m-l-3 m-b-3 m-t-3"
            >
              <i className="fa fa-twitter" />
            </a>
            <a
              href="#"
              className="size3 flex-c-m how-social trans-04 m-r-3 m-l-3 m-b-3 m-t-3"
            >
              <i className="fa fa-youtube-play" />
            </a>
          </div>
          <form className="contact100-form validate-form m-t-10 m-b-10">
            <div
              className="wrap-input100 validate-input m-lr-auto-lg"
              data-validate="Email is required: ex@abc.xyz"
            >
              <input
                className="s2-txt1 placeholder0 input100 trans-04"
                type="text"
                name="email"
                placeholder="Email Address"
              />
              <button className="flex-c-m ab-t-r size4 s1-txt1 hov1">
                <i className="zmdi zmdi-long-arrow-right fs-16 cl1 trans-04" />
              </button>
            </div>
          </form>
        </div>
      </div>

    </>
  );
};

export default ComingSoonPage;
