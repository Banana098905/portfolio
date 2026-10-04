import { categories } from '@/lib/categories';
import { IconGlyph } from './CategoryIcon';

const palettes = [
  { bg: '#e8eefc', a: '#9db4f0', b: '#c9bff5', ink: '#223b73' },
  { bg: '#efeafc', a: '#c9bff5', b: '#9db4f0', ink: '#3b2f87' },
  { bg: '#e6f0fb', a: '#8fbbe8', b: '#b7c8f2', ink: '#1b3366' },
  { bg: '#eef1f8', a: '#a9b9dc', b: '#d5cdf6', ink: '#182a56' },
  { bg: '#e9f1fb', a: '#9cc3ea', b: '#b8b4f0', ink: '#223b73' },
  { bg: '#f0ecfb', a: '#b5aaf0', b: '#9ec1ee', ink: '#2c4c8f' },
  { bg: '#e8eefa', a: '#8ea6e6', b: '#cfc6f7', ink: '#12264f' },
  { bg: '#ece9fb', a: '#bdb2f2', b: '#a3b9ea', ink: '#3b2f87' },
];

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

type Props = {
  category: string;
  /** 同じ値からは常に同じ絵になる（記事の slug を渡す） */
  seed: string;
  className?: string;
};

/**
 * サムネイル画像が未設定の記事用の、記事ごとに少しずつ違う抽象アートワーク。
 * 外部画像を使わないので軽く、ダミー画像にもなりません。
 */
export function ThumbArt({ category, seed, className }: Props) {
  const idx = Math.max(
    0,
    categories.findIndex((c) => c.slug === category),
  );
  const p = palettes[idx % palettes.length];
  const h = hash(seed);
  const rnd = (shift: number) => ((h >>> shift) & 255) / 255;

  const circles = [0, 1, 2].map((n) => ({
    cx: 100 + rnd(n * 3) * 600,
    cy: 50 + rnd(n * 3 + 8) * 350,
    r: 50 + rnd(n * 3 + 16) * 90,
    fill: n % 2 === 0 ? p.a : p.b,
  }));
  const squareX = 80 + rnd(5) * 560;
  const squareY = 40 + rnd(13) * 300;
  const squareRot = Math.round(rnd(21) * 40 - 20);

  return (
    <svg
      viewBox="0 0 800 450"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="800" height="450" fill={p.bg} />
      <g stroke={p.ink} strokeOpacity="0.07">
        {Array.from({ length: 17 }, (_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="450" />
        ))}
        {Array.from({ length: 10 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />
        ))}
      </g>
      {circles.map((c, i) => (
        <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill={c.fill} fillOpacity="0.5" />
      ))}
      <rect
        x={squareX}
        y={squareY}
        width="90"
        height="90"
        rx="18"
        fill={p.ink}
        fillOpacity="0.08"
        transform={`rotate(${squareRot} ${squareX + 45} ${squareY + 45})`}
      />
      <circle cx="400" cy="225" r="86" fill="#ffffff" fillOpacity="0.72" />
      <g
        transform="translate(330 155) scale(5.8)"
        fill="none"
        stroke={p.ink}
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      >
        <IconGlyph slug={category} />
      </g>
    </svg>
  );
}
