'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const STAGE_W = 1280;
const STAGE_H = 920;
const DURATION = 15;

const GRAD = 'linear-gradient(135deg, hsl(215 85% 25%) 0%, hsl(185 85% 35%) 55%, hsl(185 100% 50%) 100%)';
const INK = '#06111f';
const PAPER = '#f6fbff';
const ACCENT = 'hsl(185 100% 55%)';

const Easing = {
  linear: (t: number) => t,
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInCubic: (t: number) => t * t * t,
  easeInOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInQuad: (t: number) => t * t,
};

function interpolate(stops: number[], values: number[], easing: (t: number) => number = Easing.linear) {
  return (t: number) => {
    if (t <= stops[0]) return values[0];
    if (t >= stops[stops.length - 1]) return values[values.length - 1];
    for (let i = 0; i < stops.length - 1; i++) {
      if (t >= stops[i] && t <= stops[i + 1]) {
        const span = stops[i + 1] - stops[i];
        const local = span === 0 ? 0 : (t - stops[i]) / span;
        return values[i] + (values[i + 1] - values[i]) * easing(local);
      }
    }
    return values[values.length - 1];
  };
}

interface SpriteContext {
  localTime: number;
  duration: number;
  progress: number;
}

const Grid = ({ opacity = 0.06 }: { opacity?: number }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      backgroundImage:
        'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
      backgroundSize: '64px 64px',
      opacity,
      pointerEvents: 'none',
    }}
  />
);

const Orb = ({
  x,
  y,
  size = 300,
  color = 'hsl(185 100% 55%)',
  opacity = 0.35,
}: {
  x: number;
  y: number;
  size?: number;
  color?: string;
  opacity?: number;
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: size,
      height: size,
      borderRadius: 999,
      background: color,
      filter: 'blur(60px)',
      opacity,
      pointerEvents: 'none',
    }}
  />
);

function SceneHook({ ctx }: { ctx: SpriteContext }) {
  const { localTime } = ctx;
  const fade = Easing.easeOutCubic(Math.min(1, localTime / 0.5));
  const exit = localTime > 1.9 ? Easing.easeInCubic((localTime - 1.9) / 0.4) : 0;
  const titleScale = 0.94 + 0.06 * Easing.easeOutBack(Math.min(1, localTime / 0.6));
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: GRAD,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fade * (1 - exit),
      }}
    >
      <Grid opacity={0.08} />
      <Orb x={-100} y={-100} size={400} opacity={0.4} />
      <Orb x={1400} y={700} size={500} color="hsl(215 85% 45%)" opacity={0.45} />
      <div
        style={{
          position: 'relative',
          textAlign: 'center',
          color: '#fff',
          transform: `scale(${titleScale}) translateY(${(1 - fade) * 20}px)`,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            gap: 10,
            alignItems: 'center',
            padding: '8px 18px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.1em',
            marginBottom: 28,
            opacity: Math.min(1, localTime / 0.8),
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: 999, background: ACCENT, boxShadow: `0 0 12px ${ACCENT}` }} />
          ARTHA NETWORK
        </div>
        <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 20 }}>
          Buying a car from
          <br />a <span style={{ color: ACCENT, fontStyle: 'italic' }}>stranger?</span>
        </div>
        <div style={{ fontSize: 28, fontWeight: 500, opacity: 0.85, letterSpacing: '-0.01em' }}>
          Here&apos;s how Artha makes it safe — in 15 seconds.
        </div>
      </div>
    </div>
  );
}

function Person({
  x,
  y,
  name,
  label,
  appear,
  tone,
}: {
  x: number;
  y: number;
  name: string;
  label: string;
  appear: number;
  tone: 'primary' | 'secondary';
}) {
  const color = tone === 'primary' ? 'hsl(215 85% 25%)' : 'hsl(185 85% 35%)';
  const initial = name[name.indexOf('·') + 2];
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 340,
        padding: 28,
        borderRadius: 20,
        background: '#fff',
        border: '1px solid hsl(215 15% 88%)',
        boxShadow: '0 10px 30px -10px rgba(6,17,31,0.15)',
        transform: `translateY(${(1 - appear) * 20}px)`,
        opacity: appear,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 999,
          background: color,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          fontWeight: 700,
          marginBottom: 16,
        }}
      >
        {initial}
      </div>
      <div
        style={{
          fontSize: 12,
          letterSpacing: '0.1em',
          color: '#8a96ad',
          fontWeight: 600,
          marginBottom: 4,
        }}
      >
        {name.split(' · ')[0].toUpperCase()}
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 6, color: '#0f172a' }}>{name.split(' · ')[1]}</div>
      <div style={{ fontSize: 15, color: '#556272' }}>{label}</div>
    </div>
  );
}

function SceneAgree({ ctx }: { ctx: SpriteContext }) {
  const t = ctx.localTime;
  const exit = t > ctx.duration - 0.3 ? (t - (ctx.duration - 0.3)) / 0.3 : 0;
  const line = interpolate([0, 0.5, 1.4, 1.9], [0, 0, 1, 1], Easing.easeInOutCubic)(t);
  const sellerIn = Math.min(1, t / 0.4);
  const buyerIn = Math.min(1, Math.max(0, t - 1.0) / 0.4);
  const handshake = Math.min(1, Math.max(0, t - 1.7) / 0.25);

  return (
    <div style={{ position: 'absolute', inset: 0, background: PAPER, opacity: 1 - exit, color: '#0f172a' }}>
      <Orb x={1400} y={-80} size={400} color="hsl(215 85% 25%)" opacity={0.12} />

      <div
        style={{
          position: 'absolute',
          top: 56,
          left: 56,
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: '0.12em',
          color: 'hsl(215 85% 25%)',
        }}
      >
        <span style={{ opacity: 0.5 }}>01 ·&nbsp;</span>AGREE ON TERMS
      </div>

      <Person x={160} y={280} name="Seller · Priya" label="Lists a 2019 Outback" appear={sellerIn} tone="primary" />

      <div
        style={{
          position: 'absolute',
          left: 500,
          top: 390,
          width: 280,
          height: 4,
          background: 'hsl(215 15% 88%)',
          borderRadius: 2,
        }}
      >
        <div style={{ width: `${line * 100}%`, height: '100%', background: GRAD, borderRadius: 2 }} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 640,
          top: 350,
          transform: `translate(-50%, 0) scale(${handshake ? 1 : 0.6})`,
          opacity: handshake,
          padding: '14px 22px',
          borderRadius: 999,
          background: GRAD,
          color: '#fff',
          fontWeight: 700,
          fontSize: 22,
          boxShadow: '0 10px 40px -10px hsl(215 85% 25% / 0.4)',
          display: 'flex',
          gap: 10,
          alignItems: 'center',
        }}
      >
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, opacity: 0.85 }}>$14,800</span>
        <span>· signed</span>
      </div>

      <Person x={780} y={280} name="Buyer · Jordan" label="Agrees to pay $14,800" appear={buyerIn} tone="secondary" />
    </div>
  );
}

function SceneLock({ ctx }: { ctx: SpriteContext }) {
  const t = ctx.localTime;
  const exit = t > ctx.duration - 0.3 ? (t - (ctx.duration - 0.3)) / 0.3 : 0;
  const drop = interpolate([0, 0.9], [0, 1], Easing.easeInQuad)(t);
  const clang = Math.max(0, Math.min(1, (t - 0.85) / 0.15));
  const lockScale = 1 + 0.1 * (1 - clang) * Math.sin(clang * Math.PI);
  const pulseShow = t > 1.0;

  return (
    <div style={{ position: 'absolute', inset: 0, background: INK, color: '#fff', opacity: 1 - exit }}>
      <Orb x={-100} y={500} size={500} color="hsl(215 85% 45%)" opacity={0.35} />
      <Orb x={1200} y={-100} size={400} color="hsl(185 100% 50%)" opacity={0.35} />
      <Grid opacity={0.05} />

      <div
        style={{
          position: 'absolute',
          top: 56,
          left: 56,
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: '0.12em',
          color: ACCENT,
        }}
      >
        <span style={{ opacity: 0.55 }}>02 ·&nbsp;</span>FUNDS GO INTO ESCROW
      </div>

      <div
        style={{
          position: 'absolute',
          left: 640,
          top: 180 + drop * 320,
          transform: `translate(-50%, 0) scale(${1 - drop * 0.2})`,
          opacity: 1 - clang * 0.8,
          width: 80,
          height: 80,
          borderRadius: 999,
          background: GRAD,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: 40,
          color: '#fff',
          boxShadow: '0 20px 60px -10px hsl(185 100% 50% / 0.7)',
        }}
      >
        $
      </div>

      <div
        style={{
          position: 'absolute',
          left: 460,
          top: 500,
          width: 360,
          height: 220,
          borderRadius: 24,
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(8px)',
          border: '2px solid rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 10,
          transform: `scale(${lockScale})`,
          transformOrigin: 'center',
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            background: clang > 0.5 ? GRAD : 'rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.3s',
            marginBottom: 4,
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <div style={{ fontSize: 11, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
          SOLANA · USDC VAULT
        </div>
        <div style={{ fontSize: 32, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>$14,800</div>
      </div>

      {pulseShow && (
        <div
          style={{
            position: 'absolute',
            left: 640,
            top: 610,
            width: 200 + (t - 1.0) * 400,
            height: 200 + (t - 1.0) * 400,
            borderRadius: 999,
            border: `2px solid ${ACCENT}`,
            transform: 'translate(-50%, -50%)',
            opacity: Math.max(0, 1 - (t - 1.0) / 1.2),
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          left: 56,
          top: 300,
          maxWidth: 380,
          opacity: Math.min(1, Math.max(0, (t - 0.6) / 0.4)),
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.15, marginBottom: 12 }}>
          Buyer deposits <span style={{ color: ACCENT }}>USDC</span>.
        </div>
        <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
          Neither side can touch it. It&apos;s safe on-chain while the car changes hands.
        </div>
      </div>
    </div>
  );
}

function SceneInspect({ ctx }: { ctx: SpriteContext }) {
  const t = ctx.localTime;
  const exit = t > ctx.duration - 0.3 ? (t - (ctx.duration - 0.3)) / 0.3 : 0;
  const phaseIn = Math.min(1, t / 0.4);
  const dmvRow = interpolate([0.6, 1.2, 1.8, 2.2], [0, 1, 2, 3], Easing.linear)(t);

  const rows: Array<[string, string, boolean | null, boolean]> = [
    ['VIN', '4S4BSANC5K3362541', true, true],
    ['Registered owner matches seller ID', '', true, false],
    ['Title clean — no liens, no salvage', '', true, false],
    ['Transfer recorded on release', '', null, false],
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, background: PAPER, opacity: 1 - exit, color: '#0f172a' }}>
      <Orb x={-80} y={-80} size={300} color="hsl(215 85% 45%)" opacity={0.15} />

      <div
        style={{
          position: 'absolute',
          top: 56,
          left: 56,
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: '0.12em',
          color: 'hsl(215 85% 25%)',
        }}
      >
        <span style={{ opacity: 0.5 }}>03 ·&nbsp;</span>INSPECT + VERIFY TITLE
      </div>

      <div
        style={{
          position: 'absolute',
          left: 90,
          top: 210,
          width: 440,
          padding: 32,
          borderRadius: 20,
          background: '#fff',
          border: '1px solid hsl(215 15% 88%)',
          boxShadow: '0 10px 30px -10px rgba(6,17,31,0.15)',
          transform: `translateY(${(1 - phaseIn) * 20}px)`,
          opacity: phaseIn,
        }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 22 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: GRAD,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div style={{ fontSize: 13, letterSpacing: '0.1em', color: '#8a96ad', fontWeight: 600 }}>INSPECTION WINDOW</div>
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: 'hsl(215 85% 25%)',
            lineHeight: 1,
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: 8,
          }}
        >
          48<span style={{ fontSize: 28, opacity: 0.6 }}>hrs</span>
        </div>
        <div style={{ fontSize: 16, color: '#556272' }}>
          Buyer test-drives, checks condition,
          <br />
          decides to keep or flag it.
        </div>
        <div style={{ height: 6, borderRadius: 3, background: 'hsl(215 15% 92%)', marginTop: 24, overflow: 'hidden' }}>
          <div style={{ width: `${Math.min(100, t * 40)}%`, height: '100%', background: GRAD, borderRadius: 3 }} />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          right: 90,
          top: 210,
          width: 520,
          padding: 32,
          borderRadius: 20,
          background: '#fff',
          border: '1px solid hsl(215 15% 88%)',
          boxShadow: '0 10px 30px -10px rgba(6,17,31,0.15)',
          transform: `translateY(${(1 - phaseIn) * 20}px)`,
          opacity: phaseIn,
        }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 6 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'linear-gradient(135deg, hsl(185 85% 35%), hsl(185 100% 50%))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, letterSpacing: '0.1em', color: '#8a96ad', fontWeight: 600 }}>DMV TITLE LOOKUP</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'hsl(215 85% 25%)' }}>VIN cross-checked</div>
          </div>
        </div>

        <div style={{ height: 1, background: 'hsl(215 15% 92%)', margin: '20px 0' }} />

        {rows.map(([label, val, ok, mono], i) => {
          const visible = dmvRow > i;
          const check = Math.min(1, Math.max(0, dmvRow - i));
          return (
            <div
              key={label}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                padding: '10px 0',
                opacity: visible ? 1 : 0,
                transform: `translateX(${(1 - check) * -10}px)`,
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  flexShrink: 0,
                  background: ok === true ? 'hsl(140 85% 35%)' : ok === null ? 'hsl(215 15% 85%)' : 'hsl(0 84% 60%)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${check})`,
                }}
              >
                {ok === null ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'hsl(215 25% 15%)' }}>{label}</div>
                {val && (
                  <div
                    style={{
                      fontSize: 13,
                      fontFamily: mono ? "'JetBrains Mono', monospace" : 'inherit',
                      color: '#556272',
                      marginTop: 2,
                    }}
                  >
                    {val}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SceneDispute({ ctx }: { ctx: SpriteContext }) {
  const t = ctx.localTime;
  const exit = t > ctx.duration - 0.3 ? (t - (ctx.duration - 0.3)) / 0.3 : 0;
  const brainPulse = 1 + 0.08 * Math.sin(t * 6);
  const rulingIn = Math.min(1, Math.max(0, t - 0.7) / 0.5);
  const split = Math.min(1, Math.max(0, t - 1.2) / 0.6);
  const pathsIn = Math.min(1, Math.max(0, t - 1.8) / 0.5);

  const options: Array<[string, string, string]> = [
    ['Appeal to AI', 'Free · 24h re-review', ACCENT],
    ['Escalate to human', 'Licensed arbitrator · +$25', 'hsl(215 85% 55%)'],
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, background: INK, color: '#fff', opacity: 1 - exit }}>
      <Orb x={-100} y={-80} size={400} color="hsl(0 84% 60%)" opacity={0.2} />
      <Orb x={1300} y={600} size={400} color="hsl(185 100% 50%)" opacity={0.35} />
      <Grid opacity={0.05} />

      <div
        style={{
          position: 'absolute',
          top: 56,
          left: 56,
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: '0.12em',
          color: 'hsl(0 84% 70%)',
        }}
      >
        <span style={{ opacity: 0.55 }}>04 ·&nbsp;</span>DISAGREE? AI ARBITER STEPS IN
      </div>

      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 250,
          width: 180,
          height: 180,
          borderRadius: 999,
          background: GRAD,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 60px ${ACCENT}`,
          transform: `scale(${brainPulse})`,
        }}
      >
        <svg width="90" height="90" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
          <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
          <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
        </svg>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 450,
          width: 180,
          textAlign: 'center',
          fontSize: 14,
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.7)',
          fontWeight: 600,
        }}
      >
        AI ARBITER
      </div>

      <div
        style={{
          position: 'absolute',
          left: 380,
          top: 220,
          width: 700,
          padding: 28,
          borderRadius: 20,
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.15)',
          opacity: rulingIn,
          transform: `translateX(${(1 - rulingIn) * -20}px)`,
        }}
      >
        <div
          style={{
            fontSize: 13,
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.65)',
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          RULING · $3,100 HELD
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
          Refund <span style={{ color: 'hsl(0 84% 70%)' }}>$680</span> to buyer, release{' '}
          <span style={{ color: ACCENT }}>$2,420</span> to seller.
        </div>

        <div style={{ height: 50, borderRadius: 10, overflow: 'hidden', display: 'flex' }}>
          <div
            style={{
              flex: split * 680,
              background: 'hsl(0 84% 60%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {split > 0.2 && '$680'}
          </div>
          <div
            style={{
              flex: split * 2420,
              background: 'linear-gradient(135deg, hsl(185 100% 50%), hsl(185 85% 35%))',
              color: INK,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {split > 0.2 && '$2,420'}
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 380,
          top: 500,
          display: 'flex',
          gap: 16,
          opacity: pathsIn,
          transform: `translateY(${(1 - pathsIn) * 12}px)`,
        }}
      >
        {options.map(([title, sub, c], i) => (
          <div
            key={title}
            style={{
              padding: '18px 22px',
              borderRadius: 14,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.18)',
              minWidth: 280,
            }}
          >
            <div style={{ fontSize: 11, letterSpacing: '0.12em', color: c, fontWeight: 700, marginBottom: 6 }}>
              OPTION 0{i + 1}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{title}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SceneRelease({ ctx }: { ctx: SpriteContext }) {
  const t = ctx.localTime;
  const fadeIn = Math.min(1, t / 0.4);
  const checkScale = 0.3 + 0.7 * Easing.easeOutBack(Math.min(1, t / 0.55));
  const amountIn = Math.min(1, Math.max(0, t - 0.5) / 0.4);
  const copyIn = Math.min(1, Math.max(0, t - 0.9) / 0.4);
  const wordmarkIn = Math.min(1, Math.max(0, t - 1.5) / 0.5);

  return (
    <div style={{ position: 'absolute', inset: 0, background: GRAD, color: '#fff', opacity: fadeIn }}>
      <Grid opacity={0.1} />
      <Orb x={-100} y={-100} size={500} opacity={0.3} />
      <Orb x={1200} y={600} size={500} color="hsl(215 85% 45%)" opacity={0.4} />

      <div
        style={{
          position: 'absolute',
          top: 56,
          left: 56,
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: '0.12em',
        }}
      >
        <span style={{ opacity: 0.6 }}>05 ·&nbsp;</span>FUNDS RELEASE IN MINUTES
      </div>

      <div style={{ position: 'absolute', left: 640, top: 330, transform: 'translate(-50%, 0)' }}>
        {[0, 1, 2].map((i) => {
          const delay = i * 0.2;
          const progress = Math.max(0, (t - delay) / 0.8);
          const size = 220 + progress * 160;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: size,
                height: size,
                marginLeft: -size / 2,
                marginTop: -size / 2,
                borderRadius: 999,
                border: '2px solid rgba(255,255,255,0.5)',
                opacity: Math.max(0, 1 - progress),
              }}
            />
          );
        })}
        <div
          style={{
            width: 220,
            height: 220,
            borderRadius: 999,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${checkScale})`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          }}
        >
          <svg width="110" height="110" viewBox="0 0 24 24" fill="none" stroke="hsl(215 85% 25%)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 640,
          top: 580,
          transform: `translate(-50%, ${(1 - amountIn) * 12}px)`,
          opacity: amountIn,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 13, letterSpacing: '0.15em', opacity: 0.8, marginBottom: 8 }}>RELEASED TO SELLER</div>
        <div style={{ fontSize: 72, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>
          $14,800
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 640,
          top: 770,
          transform: `translate(-50%, ${(1 - copyIn) * 12}px)`,
          opacity: copyIn,
          textAlign: 'center',
          fontSize: 24,
          fontWeight: 500,
          maxWidth: 800,
        }}
      >
        Private-party car deals, <span style={{ fontStyle: 'italic', color: ACCENT }}>finally safe.</span>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 640,
          bottom: 80,
          transform: `translate(-50%, ${(1 - wordmarkIn) * 8}px)`,
          opacity: wordmarkIn,
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: '0.2em',
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: 999, background: ACCENT, boxShadow: `0 0 14px ${ACCENT}` }} />
        ARTHA NETWORK
      </div>
    </div>
  );
}

interface SceneDef {
  start: number;
  end: number;
  render: (ctx: SpriteContext) => JSX.Element;
}

const SCENES: SceneDef[] = [
  { start: 0, end: 2.3, render: (ctx) => <SceneHook ctx={ctx} /> },
  { start: 2.3, end: 4.6, render: (ctx) => <SceneAgree ctx={ctx} /> },
  { start: 4.6, end: 7.0, render: (ctx) => <SceneLock ctx={ctx} /> },
  { start: 7.0, end: 9.6, render: (ctx) => <SceneInspect ctx={ctx} /> },
  { start: 9.6, end: 12.2, render: (ctx) => <SceneDispute ctx={ctx} /> },
  { start: 12.2, end: 15.0, render: (ctx) => <SceneRelease ctx={ctx} /> },
];

export default function ArthaHowItWorks() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [scale, setScale] = useState(1);

  const updateScale = useCallback(() => {
    const wrap = wrapperRef.current;
    if (!wrap) return;
    const w = wrap.clientWidth;
    setScale(w / STAGE_W);
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [updateScale]);

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }
    lastTickRef.current = performance.now();
    const tick = (now: number) => {
      const dt = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;
      setTime((t) => {
        const next = t + dt;
        return next >= DURATION ? next - DURATION : next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => setPlaying(e.isIntersecting));
      },
      { threshold: 0.25 },
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const active = SCENES.find((s) => time >= s.start && time < s.end) ?? SCENES[SCENES.length - 1];
  const ctx: SpriteContext = {
    localTime: time - active.start,
    duration: active.end - active.start,
    progress: (time - active.start) / (active.end - active.start),
  };

  return (
    <div ref={containerRef} className="hiw-video">
      <div
        ref={wrapperRef}
        className="hiw-stage-wrap"
        style={{ aspectRatio: `${STAGE_W} / ${STAGE_H}` }}
      >
        <div
          className="hiw-stage"
          style={{
            width: STAGE_W,
            height: STAGE_H,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: INK }} />
          {active.render(ctx)}
        </div>
        <div className="hiw-controls">
          <button
            type="button"
            className="hiw-play"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pause animation' : 'Play animation'}
          >
            {playing ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4l14 8-14 8z" />
              </svg>
            )}
          </button>
          <div className="hiw-scrub">
            <div className="hiw-scrub-fill" style={{ width: `${(time / DURATION) * 100}%` }} />
          </div>
          <span className="hiw-time">
            {time.toFixed(1)}s / {DURATION}s
          </span>
        </div>
      </div>
    </div>
  );
}
