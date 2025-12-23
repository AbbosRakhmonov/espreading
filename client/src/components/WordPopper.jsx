import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { Button, CircularProgress } from "@mui/material";

// Global cache to avoid refetching across component instances
const meaningCache = new Map();

const buttonSx = {
  all: "unset",
  display: "inline",
  cursor: "pointer",
  textTransform: "none",
  minWidth: "auto",
  padding: "0",
  margin: "0",
  border: "none",
  background: "none",
  font: "inherit",
  color: "inherit",
  lineHeight: "inherit",
  letterSpacing: "inherit",
  textAlign: "inherit",
  textDecoration: "underline",
  textDecorationColor: "#3d81a8",
  textDecorationThickness: "2px",
  textUnderlineOffset: "2px",
  textDecorationStyle: "solid",
  textDecorationLine: "underline",
  textDecorationSkipInk: "none",
  textDecorationSkip: "none",
  textDecorationSkipX: "none",
  textDecorationSkipY: "none",
  textDecorationSkipZ: "none",
  "&:hover": {
    backgroundColor: "transparent",
    textDecoration: "underline",
  },
  "&:focus": {
    outline: "none",
  },
};

const popperBoxSx = {
  border: 1,
  borderColor: "divider",
  p: 1.5,
  bgcolor: "background.paper",
  boxShadow: 3,
  borderRadius: 1,
  maxWidth: 300,
  zIndex: 1300,
};

const fetchWordMeaning = async (word) => {
  // Check cache first
  if (meaningCache.has(word.toLowerCase())) {
    return meaningCache.get(word.toLowerCase());
  }

  try {
    const response = await fetch(
      `https://4hb3d9itb2.execute-api.us-east-1.amazonaws.com/prod/getdopdefinitions?q=${encodeURIComponent(
        word.toLowerCase()
      )}`
    );

    if (!response.ok) {
      throw new Error("Word not found");
      return "Word not found";
    }

    const data = await response.json();

    // Parse the new response structure
    const meaning = data?.terms?.[0]?.definition || "Definition not available";

    // Cache the result
    meaningCache.set(word.toLowerCase(), meaning);
    return meaning;
  } catch (error) {
    const errorMessage = "Unable to fetch definition";
    return errorMessage;
  }
};

const WordPopper = ({ word, variant = "text" }) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [meaning, setMeaning] = useState(null);
  const [loading, setLoading] = useState(false);
  const popperRef = useRef(null);
  const currentWordRef = useRef(word);
  const fetchedWordsRef = useRef(new Set());

  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  }, []);

  // Reset meaning when word changes
  useEffect(() => {
    if (currentWordRef.current !== word) {
      currentWordRef.current = word;
      setMeaning(null);
      setLoading(false);
      fetchedWordsRef.current.delete(currentWordRef.current.toLowerCase());
    }
  }, [word]);

  // Fetch meaning only when popper opens
  useEffect(() => {
    const wordKey = word.toLowerCase();

    // Check cache first
    const cachedMeaning = meaningCache.get(wordKey);
    if (cachedMeaning) {
      setMeaning(cachedMeaning);
      return;
    }

    // Avoid refetch if we've already fetched this word in this component instance
    if (fetchedWordsRef.current.has(wordKey)) return;

    // Mark as fetched to prevent refetch on re-render
    fetchedWordsRef.current.add(wordKey);

    // Fetch meaning
    setLoading(true);
    const controller = new AbortController();

    fetchWordMeaning(word)
      .then((fetchedMeaning) => {
        if (!controller.signal.aborted && currentWordRef.current === word) {
          setMeaning(fetchedMeaning);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted && currentWordRef.current === word) {
          setMeaning("Unable to fetch definition");
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [word]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (
        anchorEl &&
        !anchorEl.contains(event.target) &&
        popperRef.current &&
        !popperRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, anchorEl]);

  const id = useMemo(
    () => (open && anchorEl ? `word-popper-${word}` : undefined),
    [open, anchorEl, word]
  );

  return (
    <>
      <Button
        aria-describedby={id}
        type="button"
        onClick={handleClick}
        variant={variant}
        sx={buttonSx}
      >
        {word}
      </Button>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        transition
        placement="top"
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [90, 8],
            },
          },
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Box ref={popperRef} sx={popperBoxSx}>
              <Typography variant="body2" component="div">
                <Typography
                  variant="subtitle2"
                  component="span"
                  sx={{ fontWeight: "bold", display: "block", mb: 0.5 }}
                >
                  {word}
                </Typography>
                {loading ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <CircularProgress size={16} />
                    <Typography variant="body2" component="span">
                      Loading...
                    </Typography>
                  </Box>
                ) : meaning ? (
                  <Typography
                    variant="body2"
                    component="div"
                    dangerouslySetInnerHTML={{ __html: meaning }}
                    sx={{
                      "& em": {
                        fontStyle: "italic",
                      },
                      "& a": {
                        color: "primary.main",
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      },
                    }}
                  />
                ) : (
                  <Typography variant="body2" component="span">
                    Click to load definition
                  </Typography>
                )}
              </Typography>
            </Box>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default memo(WordPopper);
