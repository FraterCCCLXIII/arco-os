import shared from "../styles/shared.module.css";

type IsometricTileProps = {
  variant: number;
};

const WARM = { top: "#f4dcc4", left: "#a85a1e", right: "#d06f25" };
const COOL = { top: "#efeee2", left: "rgba(50, 53, 46, 0.72)", right: "rgba(67, 78, 63, 0.55)" };

function cube(x: number, y: number, size: number, colors: typeof WARM) {
  const h = size * 0.55;
  return (
    <g key={`${x}-${y}`}>
      <polygon
        points={`${x},${y + h} ${x + size},${y + h - size * 0.35} ${x + size},${y + h + size * 0.25} ${x},${y + h + size * 0.6}`}
        fill={colors.right}
      />
      <polygon
        points={`${x - size},${y + h} ${x},${y + h + size * 0.6} ${x},${y + h} ${x - size},${y + h - size * 0.35}`}
        fill={colors.left}
      />
      <polygon
        points={`${x - size},${y + h - size * 0.35} ${x},${y + h} ${x + size},${y + h - size * 0.35} ${x},${y + h - size * 0.7}`}
        fill={colors.top}
      />
    </g>
  );
}

export function IsometricTile({ variant }: IsometricTileProps) {
  const warmIndex = variant % 3;
  const cubes = [
    { x: 85, y: 30, size: 13, colors: COOL },
    { x: 72, y: 44, size: 13, colors: COOL },
    { x: 98, y: 38, size: 13, colors: warmIndex === 0 ? WARM : COOL },
    { x: 59, y: 50, size: 13, colors: COOL },
    { x: 111, y: 46, size: 13, colors: warmIndex === 1 ? WARM : COOL },
    { x: 85, y: 58, size: 13, colors: COOL },
    { x: 72, y: 72, size: 13, colors: warmIndex === 2 ? WARM : COOL },
  ];

  return (
    <svg
      viewBox="0 0 170 110"
      className={shared.isometric}
      aria-hidden="true"
    >
      {cubes.map((cubeDef) => cube(cubeDef.x, cubeDef.y, cubeDef.size, cubeDef.colors))}
    </svg>
  );
}
