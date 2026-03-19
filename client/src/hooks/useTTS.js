import { useState, useEffect, useCallback, useRef } from "react";

// Priority order for voice selection — prefer neural/natural voices over robotic ones
const VOICE_PRIORITY = [
  /google us english/i,
  /google uk english female/i,
  /google uk english male/i,
  /microsoft.*natural/i,
  /microsoft.*online/i,
  /microsoft.*aria/i,
  /microsoft.*guy/i,
  /microsoft.*zira/i,
  /microsoft.*david/i,
  /samantha/i,
  /karen/i,
  /daniel/i,
  /google/i,
  /microsoft/i,
];

const pickBestVoice = (voices) => {
  const enVoices = voices.filter((v) => v.lang.startsWith("en"));
  const pool = enVoices.length ? enVoices : voices;

  for (const pattern of VOICE_PRIORITY) {
    const match = pool.find((v) => pattern.test(v.name));
    if (match) return match;
  }

  return pool[0] ?? null;
};

const useTTS = () => {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const [voice, setVoice] = useState(null);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    setSupported(true);

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) setVoice(pickBestVoice(voices));
    };

    // Voices may not be ready yet on first render
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  // Chrome silently pauses synthesis after ~15s — keep it alive
  useEffect(() => {
    if (!speaking) return;
    const interval = setInterval(() => {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
    }, 10_000);
    return () => clearInterval(interval);
  }, [speaking]);

  const speak = useCallback(
    (text) => {
      if (!supported || !text.trim()) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text.trim());
      if (voice) utterance.voice = voice;
      utterance.lang = "en-US";
      utterance.rate = 0.92;   // slightly slower than default = more natural
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [supported, voice]
  );

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking, supported };
};

export default useTTS;
