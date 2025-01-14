import React from "react";

const CustomAudio = ({ audioUrl = "./audio.mp3", type = "audio/mpeg" }) => {
  return (
    <div>
      <audio
        controls
        controlsList="nodownload noplaybackrate"
        style={{
          width: "100%",
          borderRadius: "10px",
          marginBottom: "10px",
          marginTop: "10px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <source src={audioUrl} type={type} />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default CustomAudio;
