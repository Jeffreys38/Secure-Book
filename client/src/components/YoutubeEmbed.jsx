import React from "react";

const YoutubeEmbed = ({ embedId }) => {
    const width = "100%";
    const height = "360px"

    return (
        <div className="video-response">
            <iframe
                width={width}
                height={height}
                src={`https://www.youtube.com/embed/${embedId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube"
            />
        </div>
    );
}

export default YoutubeEmbed;
