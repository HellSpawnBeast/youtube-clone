import { useState } from "react";

// Collapsible video description. Replaces react-show-more, whose React <=16
// internals crash on React 18 (removeChild on a null node).
const COLLAPSED_LINES = 3;
const COLLAPSED_CHARS = 180;

export default function VideoDescription({ text = "" }) {
  const [expanded, setExpanded] = useState(false);
  const canExpand = text.length > COLLAPSED_CHARS;

  return (
    <>
      <p className={`video_description ${expanded ? "expanded" : ""}`}>{text}</p>
      {canExpand && (
        <span
          className="show_more_details"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Show less" : "Show more"}
        </span>
      )}
    </>
  );
}
