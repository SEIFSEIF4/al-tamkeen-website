import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "التمكين الريادي للجمعيات الأهلية";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  const fontData = await fetch(
    new URL(
      "https://fonts.gstatic.com/s/ibmplexsansarabic/v11/aFtU7PB1b6_cM4-sO7766fQj0WPL4eC-Ms0d.ttf",
      import.meta.url,
    ),
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #3E3082, #2D2466)",
        color: "white",
        fontFamily: '"IBM Plex Sans Arabic"',
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Elements */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "50%",
          height: "50%",
          background:
            "radial-gradient(circle, rgba(93,159,221,0.2) 0%, transparent 70%)",
          filter: "blur(40px)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: "50%",
          height: "50%",
          background:
            "radial-gradient(circle, rgba(143,210,227,0.2) 0%, transparent 70%)",
          filter: "blur(40px)",
          borderRadius: "50%",
        }}
      />

      {/* Logo and Text */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Simple geometric representation of logo if image loading is tricky in edge */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 48L16 32H32L48 48H0Z" fill="#8FD2E3" />
          <path d="M16 32L32 16V32H16Z" fill="white" />
          <path d="M32 16L48 0V16H32Z" fill="#8FD2E3" />
        </svg>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <h1
            style={{
              fontSize: 60,
              fontWeight: "bold",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            التمكين الريادي
          </h1>
          <h2 style={{ fontSize: 30, margin: 0, color: "#8FD2E3" }}>
            للجمعيات الأهلية
          </h2>
        </div>
      </div>

      <div style={{ marginTop: 40, padding: "0 60px", textAlign: "center" }}>
        <p
          style={{ fontSize: 28, opacity: 0.9, lineHeight: 1.5, maxWidth: 900 }}
        >
          برنامج التمكين الريادي للجمعيات الأهلية هو أول برنامج وطني يُمكّن
          الجمعيات من تحويل رسالتها الاجتماعية إلى شركات ناشئة مستدامة
        </p>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "IBM Plex Sans Arabic",
          data: fontData,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
