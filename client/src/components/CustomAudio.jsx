import { useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  Slider,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import Replay10Icon from "@mui/icons-material/Replay10";
import Forward10Icon from "@mui/icons-material/Forward10";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const fmt = (s) => {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const VolumeIcon = ({ volume, muted }) => {
  if (muted || volume === 0) return <VolumeOffIcon sx={{ fontSize: 18 }} />;
  if (volume < 0.5) return <VolumeDownIcon sx={{ fontSize: 18 }} />;
  return <VolumeUpIcon sx={{ fontSize: 18 }} />;
};

const CustomAudio = ({ audioUrl = "./audio.mp3", type = "audio/mpeg" }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [speedAnchor, setSpeedAnchor] = useState(null);
  const [seeking, setSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    playing ? a.pause() : a.play();
  };

  const skip = (secs) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.min(Math.max(a.currentTime + secs, 0), a.duration || 0);
  };

  const handleVolumeChange = (_, val) => {
    const a = audioRef.current;
    if (!a) return;
    const v = val / 100;
    a.volume = v;
    setVolume(v);
    if (v > 0) {
      a.muted = false;
      setMuted(false);
    }
  };

  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
  };

  const handleSeekChange = (_, val) => {
    setSeekValue(val);
  };

  const handleSeekCommit = (_, val) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    a.currentTime = (val / 100) * duration;
    setSeeking(false);
  };

  const handleSeekStart = () => setSeeking(true);

  const handleSpeedSelect = (s) => {
    const a = audioRef.current;
    if (a) a.playbackRate = s;
    setSpeed(s);
    setSpeedAnchor(null);
  };

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      setCurrent(0);
      setSeekValue(0);
    };
    const onLoaded = () => setDuration(a.duration || 0);
    const onTime = () => {
      if (!seeking) {
        setCurrent(a.currentTime);
        setSeekValue(a.duration ? (a.currentTime / a.duration) * 100 : 0);
      }
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
  }, [seeking]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        px: 2,
        py: 1,
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

      {/* Seek bar */}
      <Box sx={{ px: 0.5 }}>
        <Slider
          size="small"
          value={seekValue}
          onChange={handleSeekChange}
          onChangeCommitted={handleSeekCommit}
          onMouseDown={handleSeekStart}
          onTouchStart={handleSeekStart}
          sx={{
            color: "primary.main",
            height: 4,
            py: 0.5,
            "& .MuiSlider-thumb": {
              width: 12,
              height: 12,
              transition: "0.1s",
              "&:hover": { boxShadow: "0 0 0 6px rgba(25,118,210,0.2)" },
            },
            "& .MuiSlider-rail": { opacity: 0.3 },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: -0.5 }}>
          <Typography variant="caption" sx={{ fontSize: "0.65rem", color: "text.secondary" }}>
            {fmt(current)}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: "0.65rem", color: "text.secondary" }}>
            {duration ? fmt(duration) : "--:--"}
          </Typography>
        </Box>
      </Box>

      {/* Controls row */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
        {/* Skip back */}
        <Tooltip title="Rewind 10s">
          <IconButton size="small" onClick={() => skip(-10)} sx={{ color: "primary.main" }}>
            <Replay10Icon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        {/* Play / Pause */}
        <IconButton
          onClick={toggle}
          sx={{
            bgcolor: "primary.main",
            color: "#fff",
            width: 34,
            height: 34,
            flexShrink: 0,
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          {playing ? <PauseIcon sx={{ fontSize: 18 }} /> : <PlayArrowIcon sx={{ fontSize: 18 }} />}
        </IconButton>

        {/* Skip forward */}
        <Tooltip title="Forward 10s">
          <IconButton size="small" onClick={() => skip(10)} sx={{ color: "primary.main" }}>
            <Forward10Icon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>

        {/* Speed */}
        <Tooltip title="Playback speed">
          <Box
            onClick={(e) => setSpeedAnchor(e.currentTarget)}
            sx={{
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "primary.main",
              cursor: "pointer",
              px: 0.75,
              py: 0.25,
              borderRadius: 1,
              border: "1px solid",
              borderColor: "primary.light",
              lineHeight: 1.4,
              "&:hover": { bgcolor: "rgba(25,118,210,0.08)" },
            }}
          >
            {speed}x
          </Box>
        </Tooltip>
        <Menu
          anchorEl={speedAnchor}
          open={Boolean(speedAnchor)}
          onClose={() => setSpeedAnchor(null)}
          slotProps={{ paper: { sx: { minWidth: 80 } } }}
        >
          {SPEEDS.map((s) => (
            <MenuItem
              key={s}
              selected={s === speed}
              onClick={() => handleSpeedSelect(s)}
              sx={{ fontSize: "0.85rem", justifyContent: "center" }}
            >
              {s}x
            </MenuItem>
          ))}
        </Menu>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Mute toggle */}
        <Tooltip title={muted || volume === 0 ? "Unmute" : "Mute"}>
          <IconButton size="small" onClick={toggleMute} sx={{ color: "primary.main" }}>
            <VolumeIcon volume={volume} muted={muted} />
          </IconButton>
        </Tooltip>

        {/* Volume slider */}
        <Slider
          size="small"
          value={muted ? 0 : Math.round(volume * 100)}
          onChange={handleVolumeChange}
          sx={{
            width: 70,
            color: "primary.main",
            "& .MuiSlider-thumb": { width: 10, height: 10 },
            "& .MuiSlider-rail": { opacity: 0.3 },
          }}
        />
      </Box>
    </Box>
  );
};

export default CustomAudio;
