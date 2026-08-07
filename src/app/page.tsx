export default function SuspendedPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        background:
          "radial-gradient(ellipse at 50% 20%, #1a1a1f 0%, #0f0f10 55%, #0a0a0b 100%)",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: "100%",
          textAlign: "center",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: "2.5rem 2rem",
          background: "rgba(255,255,255,0.03)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            margin: "0 auto 1.5rem",
            borderRadius: "50%",
            border: "1px solid rgba(255,200,120,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f0c674",
            fontSize: 22,
            fontWeight: 600,
          }}
          aria-hidden
        >
          !
        </div>
        <p
          style={{
            margin: "0 0 0.75rem",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
            fontWeight: 600,
          }}
        >
          Service unavailable
        </p>
        <h1
          style={{
            margin: "0 0 1rem",
            fontSize: "1.35rem",
            lineHeight: 1.45,
            fontWeight: 600,
            color: "#f5f5f5",
          }}
        >
          The website has been temporarily suspended because the account has an
          outstanding balance.
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: "0.9rem",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Access will be restored once the outstanding balance is settled.
          Please contact the site administrator for payment details.
        </p>
      </div>
    </main>
  );
}
