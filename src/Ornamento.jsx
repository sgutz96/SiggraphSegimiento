import React from 'react'

// Cruces "+" y barra con rombos de las piezas gráficas (esquina superior derecha).
export default function Ornamento() {
  const cruz = (x, y) => (
    <path key={`${x}-${y}`} d={`M${x - 5} ${y}H${x + 5}M${x} ${y - 5}V${y + 5}`} stroke="#2BB1A4" strokeWidth="3" />
  )
  return (
    <svg className="ornamento" viewBox="0 0 116 60" aria-hidden="true" focusable="false">
      {[10, 36, 62, 88].map(x => cruz(x, 8))}
      {[10, 36].map(x => cruz(x, 30))}
      <rect x="52" y="44" width="64" height="8" fill="#2BB1A4" />
      {[56, 68, 80, 92, 104].map(x => (
        <rect key={x} x={x} y="55" width="4" height="4" fill="#2BB1A4" transform={`rotate(45 ${x + 2} 57)`} />
      ))}
    </svg>
  )
}
