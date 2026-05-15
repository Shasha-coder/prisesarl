import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0a2240 0%, #14315c 50%, #2BB7DC 130%)",
        }}
      >
        <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="#f6f1e6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 6 4 L 6 20 M 6 4 L 14 4 Q 19 4 19 9 Q 19 14 14 14 L 6 14" />
          <circle cx="6" cy="20" r="1.4" fill="#2BB7DC" stroke="#2BB7DC" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
