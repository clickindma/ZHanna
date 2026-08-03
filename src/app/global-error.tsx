"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap');

              :root {
                --navy-deep: #0b1522;
                --gold: #16b5d8;
                --gold-dark: #0e8fb0;
                --gold-light: #6fd7ee;
                --ivory: #f8fcfd;
              }

              * { margin: 0; padding: 0; box-sizing: border-box; }

              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background-color: var(--navy-deep);
                color: var(--ivory);
                min-height: 100vh;
                overflow: hidden;
              }

              .error-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                padding: 2rem 1.5rem;
                text-align: center;
                position: relative;
              }

              /* Noise texture */
              .error-container::before {
                content: '';
                position: absolute;
                inset: 0;
                opacity: 0.04;
                pointer-events: none;
                background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E");
              }

              /* Gradient orb */
              .orb {
                position: absolute;
                top: -10rem;
                left: 50%;
                transform: translateX(-50%);
                width: 42rem;
                height: 24rem;
                border-radius: 50%;
                background: radial-gradient(ellipse, rgba(22,181,216,0.12) 0%, transparent 70%);
                filter: blur(80px);
                pointer-events: none;
                animation: pulse-orb 4s ease-in-out infinite;
              }

              .orb-bottom {
                top: auto;
                bottom: -8rem;
                width: 24rem;
                height: 16rem;
                background: radial-gradient(ellipse, rgba(14,143,176,0.08) 0%, transparent 70%);
                animation-delay: 2s;
              }

              @keyframes pulse-orb {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.6; }
              }

              /* Diamond icon animation */
              .diamond-icon {
                width: 48px;
                height: 48px;
                margin-bottom: 2rem;
                animation: float 3s ease-in-out infinite;
              }

              @keyframes float {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-8px) rotate(2deg); }
              }

              /* Badge */
              .badge {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                border: 1px solid rgba(22,181,216,0.3);
                background: rgba(22,181,216,0.1);
                padding: 0.375rem 1rem;
                border-radius: 9999px;
                font-size: 10px;
                font-weight: 600;
                letter-spacing: 0.3em;
                text-transform: uppercase;
                color: var(--gold);
                backdrop-filter: blur(8px);
                animation: fadeIn 0.6s ease-out 0.2s both;
              }

              /* Heading */
              .error-heading {
                font-family: 'Playfair Display', serif;
                font-size: clamp(1.75rem, 5vw, 3rem);
                font-weight: 500;
                color: var(--ivory);
                margin-top: 1.5rem;
                line-height: 1.2;
                animation: fadeIn 0.6s ease-out 0.4s both;
              }

              .error-heading em {
                font-style: italic;
                background-image: linear-gradient(115deg, #8be0f2 0%, #16b5d8 42%, #6fd7ee 62%, #0e8fb0 100%);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
              }

              /* Hairline */
              .hairline {
                width: 6rem;
                height: 1px;
                margin: 1.25rem auto;
                background-image: linear-gradient(90deg, transparent, var(--gold), transparent);
                animation: fadeIn 0.6s ease-out 0.5s both;
              }

              /* Description */
              .error-description {
                max-width: 28rem;
                margin-top: 1rem;
                font-size: 0.875rem;
                line-height: 1.7;
                color: rgba(248,252,253,0.6);
                animation: fadeIn 0.6s ease-out 0.6s both;
              }

              /* Buttons */
              .button-group {
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                margin-top: 2.5rem;
                justify-content: center;
                animation: fadeIn 0.6s ease-out 0.8s both;
              }

              .btn-primary {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                background: var(--gold);
                color: var(--navy-deep);
                padding: 0.875rem 2rem;
                border-radius: 9999px;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.2em;
                text-transform: uppercase;
                text-decoration: none;
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 0 20px rgba(22,181,216,0.2);
              }

              .btn-primary:hover {
                background: var(--gold-dark);
                color: white;
                box-shadow: 0 0 30px rgba(22,181,216,0.35);
                transform: translateY(-1px);
              }

              .btn-secondary {
                display: inline-flex;
                align-items: center;
                border: 1px solid rgba(22,181,216,0.4);
                color: var(--gold);
                padding: 0.875rem 2rem;
                border-radius: 9999px;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.2em;
                text-transform: uppercase;
                text-decoration: none;
                background: transparent;
                cursor: pointer;
                transition: all 0.3s ease;
              }

              .btn-secondary:hover {
                border-color: var(--gold);
                background: rgba(22,181,216,0.1);
                box-shadow: 0 0 20px rgba(22,181,216,0.1);
                transform: translateY(-1px);
              }

              /* Decorative diamonds */
              .decor-diamond {
                position: absolute;
                pointer-events: none;
                opacity: 0.12;
                animation: spin-slow 20s linear infinite;
              }

              .decor-diamond-1 {
                top: 18%;
                left: 12%;
                width: 20px;
                height: 20px;
              }

              .decor-diamond-2 {
                bottom: 22%;
                right: 10%;
                width: 28px;
                height: 28px;
                animation-direction: reverse;
                animation-duration: 25s;
              }

              @keyframes spin-slow {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }

              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }

              /* Error code display */
              .error-code {
                font-family: 'Playfair Display', serif;
                font-size: clamp(5rem, 12vw, 9rem);
                font-weight: 600;
                font-style: italic;
                line-height: 1;
                margin-bottom: 1rem;
                background-image: linear-gradient(to bottom, var(--gold), var(--gold-dark), rgba(22,181,216,0.2));
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
                animation: fadeIn 0.6s ease-out both;
                user-select: none;
              }

              /* Footer */
              .error-footer {
                position: absolute;
                bottom: 2rem;
                font-size: 11px;
                letter-spacing: 0.05em;
                color: rgba(248,252,253,0.35);
              }

              @media (max-width: 640px) {
                .decor-diamond { display: none; }
                .button-group { flex-direction: column; align-items: center; }
              }
            `,
          }}
        />
      </head>
      <body>
        <div className="error-container">
          {/* Gradient orbs */}
          <div className="orb" />
          <div className="orb orb-bottom" />

          {/* Decorative diamonds */}
          <svg className="decor-diamond decor-diamond-1" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L22 12L12 22L2 12L12 2Z" stroke="#16b5d8" strokeWidth="1" />
          </svg>
          <svg className="decor-diamond decor-diamond-2" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L22 12L12 22L2 12L12 2Z" stroke="#16b5d8" strokeWidth="0.75" />
          </svg>

          {/* Diamond icon */}
          <svg className="diamond-icon" viewBox="0 0 48 48" fill="none">
            <path
              d="M24 4L44 24L24 44L4 24L24 4Z"
              stroke="url(#diamond-grad)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M24 12L36 24L24 36L12 24L24 12Z"
              stroke="url(#diamond-grad)"
              strokeWidth="1"
              strokeLinejoin="round"
              opacity="0.5"
            />
            <defs>
              <linearGradient id="diamond-grad" x1="4" y1="4" x2="44" y2="44">
                <stop offset="0%" stopColor="#8be0f2" />
                <stop offset="50%" stopColor="#16b5d8" />
                <stop offset="100%" stopColor="#0e8fb0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Badge */}
          <span className="badge">A moment, please</span>

          {/* Heading */}
          <h1 className="error-heading">
            Something went <em>wrong</em>
          </h1>

          {/* Decorative hairline */}
          <div className="hairline" />

          {/* Description */}
          <p className="error-description">
            An unexpected error interrupted your visit. Your pieces and wishlist
            are safe — try again and we&apos;ll get you back to browsing our
            collection.
          </p>

          {/* Buttons */}
          <div className="button-group">
            <button type="button" onClick={reset} className="btn-primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              Try Again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className="btn-secondary">
              Return Home
            </a>
          </div>

          {/* Footer */}
          <p className="error-footer">Zhanna · Artificial Diamond &amp; Fashion Jewellery</p>
        </div>
      </body>
    </html>
  );
}
