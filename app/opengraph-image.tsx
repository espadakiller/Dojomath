import { ImageResponse } from "next/og";

export const alt = "DojoMath — cours particuliers de mathématiques en ligne";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "76px",
          color: "#171313",
          background: "#f1e4d1",
          border: "18px solid #6f1022",
        }}
      >
        <div style={{ display: "flex", color: "#6f1022", fontSize: 42 }}>
          DojoMath
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: 980,
            marginTop: 36,
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.06,
          }}
        >
          Cours particuliers de maths en ligne
        </div>
        <div style={{ display: "flex", marginTop: 36, fontSize: 30, color: "#5f514b" }}>
          Collège · Lycée · Supérieur · Enseignant certifié
        </div>
      </div>
    ),
    size,
  );
}
