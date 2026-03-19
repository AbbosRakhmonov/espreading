import { useEffect, useRef, useState } from "react";
import { Box, IconButton, LinearProgress, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

const fmt = (s) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const CustomAudio = ({ audioUrl = "./audio.mp3", type = "audio/mpeg" }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    playing ? a.pause() : a.play();
  };

  const handleSeek = (e) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    a.currentTime = ratio * duration;
  };

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => { setPlaying(false); setProgress(0); setCurrent(0); };
    const onLoaded = () => setDuration(a.duration || 0);
    const onTime = () => {
      setCurrent(a.currentTime);
      setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0);
    };

    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnded);
    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("timeupdate", onTime);

    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("timeupdate", onTime);
    };
  }, []);

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        px: 1.5,
        py: 0.75,
        borderRadius: 3,
        background: "linear-gradient(135deg, #e3f0fb 0%, #f0f7ff 100%)",
        border: "1px solid",
        borderColor: "primary.light",
        boxShadow: "0 2px 8px rgba(25,118,210,0.10)",
        width: "100%",
        my: 1.5,
        userSelect: "none",
      }}
    >
      <audio ref={audioRef} preload="metadata">
        <source src={audioUrl} type={type} />
      </audio>

      {/* Play / Pause */}
      <IconButton
        size="small"
        onClick={toggle}
        sx={{
          bgcolor: "primary.main",
          color: "#fff",
          width: 30,
          height: 30,
          flexShrink: 0,
          "&:hover": { bgcolor: "primary.dark" },
        }}
      >
        {playing ? <PauseIcon sx={{ fontSize: 16 }} /> : <PlayArrowIcon sx={{ fontSize: 16 }} />}
      </IconButton>

      {/* Progress + time */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          onClick={handleSeek}
          sx={{
            height: 4,
            borderRadius: 2,
            cursor: "pointer",
            mb: 0.4,
            bgcolor: "rgba(25,118,210,0.15)",
            "& .MuiLinearProgress-bar": { borderRadius: 2 },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="caption" sx={{ fontSize: "0.65rem", color: "text.secondary", lineHeight: 1 }}>
            {fmt(current)}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: "0.65rem", color: "text.secondary", lineHeight: 1 }}>
            {duration ? fmt(duration) : "--:--"}
          </Typography>
        </Box>
      </Box>

      <VolumeUpIcon sx={{ fontSize: 14, color: "primary.light", flexShrink: 0 }} />
    </Box>
  );
};

export default CustomAudio;
