import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const alt = "التمكين الريادي للجمعيات الأهلية";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  const fontData = await fetch(
    new URL(
      "https://fonts.gstatic.com/s/ibmplexsansarabic/v12/Qw3MZRtWPQCuHme67tEYUIx3Kh0PHR9N6YNe3PC5eMlAMg0.ttf",
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
        background:
          "linear-gradient(135deg, #3E3082 0%, #2D2466 50%, #1E1850 100%)",
        position: "relative",
        overflow: "hidden",
        fontFamily: '"IBM Plex Sans Arabic"',
      }}
    >
      {/* Background decorative elements */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          left: "-5%",
          width: "50%",
          height: "50%",
          background:
            "radial-gradient(circle, rgba(143,210,227,0.12) 0%, transparent 70%)",
          filter: "blur(80px)",
          borderRadius: "50%",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          right: "-5%",
          width: "50%",
          height: "50%",
          background:
            "radial-gradient(circle, rgba(93,159,221,0.12) 0%, transparent 70%)",
          filter: "blur(80px)",
          borderRadius: "50%",
          display: "flex",
        }}
      />

      {/* Top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "6px",
          background:
            "linear-gradient(90deg, #8fd2e3 0%, #5d9fdd 50%, #8fd2e3 100%)",
          display: "flex",
        }}
      />

      {/* Logo mark */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "32px",
        }}
      >
        <svg
          width="120"
          height="80"
          viewBox="230 25 140 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points="289.92 107.13 235.64 130.75 235.64 102.61 273.13 87.32 250.92 87.32 250.92 60.65 289.92 60.65 289.92 107.13"
            fill="#8fd2e3"
          />
          <rect
            x="289.92"
            y="31.4"
            width="29.24"
            height="29.24"
            fill="#5d9fdd"
          />
        </svg>
      </div>

      {/* Headline */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <div
          style={{
            fontSize: "56px",
            fontWeight: 700,
            color: "#FFFFFF",
            textAlign: "center",
            lineHeight: 1.3,
            direction: "rtl",
            display: "flex",
          }}
        >
          التمكين الريادي للجمعيات الأهلية
        </div>

        {/* Divider */}
        <div
          style={{
            width: "80px",
            height: "4px",
            background: "linear-gradient(90deg, #8fd2e3, #5d9fdd)",
            borderRadius: "2px",
            margin: "8px 0",
            display: "flex",
          }}
        />

        {/* Subheadline */}
        <div
          style={{
            fontSize: "24px",
            fontWeight: 400,
            color: "rgba(255,255,255,0.85)",
            textAlign: "center",
            lineHeight: 1.6,
            direction: "rtl",
            maxWidth: "800px",
            display: "flex",
          }}
        >
          أول مشروع وطني يُمكّن الجمعيات من تحويل رسالتها الاجتماعية إلى شركات
          ناشئة مستدامة
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          marginTop: "40px",
          padding: "14px 48px",
          background: "linear-gradient(135deg, #8fd2e3 0%, #5d9fdd 100%)",
          borderRadius: "50px",
          fontSize: "22px",
          fontWeight: 700,
          color: "#1E1850",
          display: "flex",
          alignItems: "center",
          direction: "rtl",
        }}
      >
        سجّل الآن
      </div>

      {/* Bottom branding */}
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.5)",
            display: "flex",
            direction: "rtl",
          }}
        >
          altamkeen.sa
        </div>
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
