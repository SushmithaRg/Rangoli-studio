// All designs here are original SVG artwork created for this project,
// styled after traditional Indian rangoli/kolam motifs. None of this is
// copied from any external image or website.

export const LEVELS = ['beginner', 'intermediate', 'advanced']

const svg = (inner) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`

const petals = (n, { rx = 16, ry = 30, cy = 60, colors = ['#f4a300'], opacity = 0.85 }) =>
  Array.from({ length: n })
    .map((_, i) => {
      const a = (360 / n) * i
      const c = colors[i % colors.length]
      return `<g transform="rotate(${a} 100 100)"><ellipse cx="100" cy="${cy}" rx="${rx}" ry="${ry}" fill="${c}" opacity="${opacity}"/></g>`
    })
    .join('')

const dotsRing = (n, r = 45, size = 4, color = '#5c7a4a') =>
  Array.from({ length: n })
    .map((_, i) => {
      const rad = ((360 / n) * i * Math.PI) / 180
      const x = 100 + r * Math.cos(rad)
      const y = 100 + r * Math.sin(rad)
      return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${size}" fill="${color}"/>`
    })
    .join('')

export const DESIGNS = {
  beginner: [
    { name: 'Simple Dot Kolam', svg: svg(`
      ${[-40, 0, 40].flatMap((dx) => [-40, 0, 40].map((dy) => `<circle cx="${100 + dx}" cy="${100 + dy}" r="4" fill="#5c7a4a"/>`)).join('')}
      <path d="M60,100 Q100,60 140,100 Q100,140 60,100 Z" fill="none" stroke="#b5233a" stroke-width="4"/>
    `) },
    { name: 'Four Petal Flower', svg: svg(`
      ${petals(4, { rx: 18, ry: 32, cy: 65, colors: ['#f4a300'] })}
      <circle cx="100" cy="100" r="16" fill="#5c7a4a"/>
    `) },
    { name: 'Simple Circle Border', svg: svg(`
      <circle cx="100" cy="100" r="70" fill="none" stroke="#b5233a" stroke-width="5"/>
      <circle cx="100" cy="100" r="45" fill="none" stroke="#f4a300" stroke-width="5"/>
      <circle cx="100" cy="100" r="18" fill="#5c7a4a"/>
    `) },
    { name: 'Mini Diya', svg: svg(`
      <path d="M60,120 Q100,150 140,120 Q140,105 100,105 Q60,105 60,120 Z" fill="#f4a300" stroke="#b5233a" stroke-width="3"/>
      <path d="M100,100 Q90,80 100,60 Q110,80 100,100 Z" fill="#b5233a"/>
    `) },
    { name: 'Triangle Trio', svg: svg(`
      ${[0, 120, 240].map((a) => `<g transform="rotate(${a} 100 100)"><polygon points="100,50 120,90 80,90" fill="#b5233a" opacity="0.85"/></g>`).join('')}
      <circle cx="100" cy="100" r="12" fill="#5c7a4a"/>
    `) },
    { name: 'Small Star Kolam', svg: svg(`
      <polygon points="100,40 112,80 155,80 120,105 132,145 100,120 68,145 80,105 45,80 88,80"
        fill="#f6c453" stroke="#b5233a" stroke-width="2"/>
    `) },
    { name: 'Simple Wave Border', svg: svg(`
      <circle cx="100" cy="100" r="80" fill="none" stroke="#e6d6bd" stroke-width="1"/>
      <path d="M30,100 Q50,80 70,100 T110,100 T150,100 T190,100" fill="none" stroke="#5c7a4a" stroke-width="5"/>
      <circle cx="100" cy="100" r="14" fill="#f4a300"/>
    `) },
    { name: 'Basic Hexagon', svg: svg(`
      <polygon points="100,40 145,65 145,115 100,140 55,115 55,65" fill="none" stroke="#b5233a" stroke-width="4"/>
      <circle cx="100" cy="100" r="16" fill="#f6c453"/>
    `) },
    { name: 'Three Dot Line Kolam', svg: svg(`
      ${[60, 100, 140].map((x) => `<circle cx="${x}" cy="100" r="5" fill="#5c7a4a"/>`).join('')}
      <path d="M50,100 Q100,50 150,100 Q100,150 50,100 Z" fill="none" stroke="#f4a300" stroke-width="4"/>
    `) },
    { name: 'Tiny Sun', svg: svg(`
      ${Array.from({ length: 8 }).map((_, i) => `<line x1="100" y1="100" x2="100" y2="30" stroke="#f4a300" stroke-width="4" transform="rotate(${i * 45} 100 100)"/>`).join('')}
      <circle cx="100" cy="100" r="22" fill="#b5233a"/>
    `) },
  ],

  intermediate: [
    { name: 'Lotus Bloom', svg: svg(`
      ${petals(8, { rx: 14, ry: 40, cy: 60, colors: ['#f4a300'] })}
      <circle cx="100" cy="100" r="18" fill="#5c7a4a"/><circle cx="100" cy="100" r="8" fill="#fdf6ec"/>
    `) },
    { name: 'Peacock Circle', svg: svg(`
      ${Array.from({ length: 12 }).map((_, i) => `<g transform="rotate(${i * 30} 100 100)"><ellipse cx="100" cy="35" rx="10" ry="22" fill="#5c7a4a" opacity="0.8"/><circle cx="100" cy="30" r="5" fill="#f4a300"/></g>`).join('')}
      <circle cx="100" cy="100" r="30" fill="#b5233a"/><circle cx="100" cy="100" r="14" fill="#f6c453"/>
    `) },
    { name: 'Paisley Border (Kairi)', svg: svg(`
      ${Array.from({ length: 6 }).map((_, i) => `<g transform="rotate(${i * 60} 100 100)"><path d="M100,40 Q130,55 120,85 Q110,100 90,90 Q80,70 100,40 Z" fill="#f6c453" stroke="#b5233a" stroke-width="2"/></g>`).join('')}
      <circle cx="100" cy="100" r="16" fill="#5c7a4a"/>
    `) },
    { name: 'Kalash Pot Motif', svg: svg(`
      <path d="M70,110 Q70,150 100,155 Q130,150 130,110 Q130,90 100,90 Q70,90 70,110 Z" fill="#f4a300" stroke="#b5233a" stroke-width="3"/>
      <rect x="90" y="70" width="20" height="20" fill="#b5233a"/>
      <path d="M75,90 Q100,75 125,90" fill="none" stroke="#5c7a4a" stroke-width="3"/>
      <circle cx="100" cy="60" r="10" fill="#5c7a4a"/>
    `) },
    { name: 'Eight Petal Wheel', svg: svg(`
      ${petals(8, { rx: 20, ry: 20, cy: 55, colors: ['#b5233a', '#f4a300'] })}
      <circle cx="100" cy="100" r="55" fill="none" stroke="#5c7a4a" stroke-width="2" stroke-dasharray="4 3"/>
      <circle cx="100" cy="100" r="14" fill="#3a2a20"/>
    `) },
    { name: 'Swan Pair Kolam', svg: svg(`
      <ellipse cx="70" cy="110" rx="26" ry="16" fill="#fdf6ec" stroke="#5c7a4a" stroke-width="2"/>
      <path d="M70,100 Q55,80 45,85" fill="none" stroke="#5c7a4a" stroke-width="3"/>
      <ellipse cx="130" cy="110" rx="26" ry="16" fill="#fdf6ec" stroke="#5c7a4a" stroke-width="2"/>
      <path d="M130,100 Q145,80 155,85" fill="none" stroke="#5c7a4a" stroke-width="3"/>
      <circle cx="100" cy="100" r="70" fill="none" stroke="#e6d6bd" stroke-width="1"/>
    `) },
    { name: 'Chakra Ring', svg: svg(`
      ${Array.from({ length: 16 }).map((_, i) => `<line x1="100" y1="100" x2="100" y2="35" stroke="#b5233a" stroke-width="3" transform="rotate(${i * 22.5} 100 100)"/>`).join('')}
      <circle cx="100" cy="100" r="65" fill="none" stroke="#5c7a4a" stroke-width="3"/>
      <circle cx="100" cy="100" r="18" fill="#f6c453"/>
    `) },
    { name: 'Diamond Flower', svg: svg(`
      ${Array.from({ length: 6 }).map((_, i) => `<g transform="rotate(${i * 60} 100 100)"><polygon points="100,40 112,70 100,100 88,70" fill="#f4a300" stroke="#b5233a" stroke-width="1.5"/></g>`).join('')}
      <circle cx="100" cy="100" r="14" fill="#5c7a4a"/>
    `) },
    { name: 'Temple Bell Border', svg: svg(`
      <circle cx="100" cy="100" r="80" fill="none" stroke="#e6d6bd" stroke-width="1"/>
      ${dotsRing(10, 80, 6, '#f4a300')}
      <path d="M85,130 Q100,150 115,130 Q115,110 100,105 Q85,110 85,130 Z" fill="#b5233a"/>
      <circle cx="100" cy="150" r="4" fill="#5c7a4a"/>
    `) },
    { name: 'Double Ring Mandala', svg: svg(`
      <circle cx="100" cy="100" r="75" fill="none" stroke="#b5233a" stroke-width="3"/>
      <circle cx="100" cy="100" r="55" fill="none" stroke="#f4a300" stroke-width="3"/>
      ${dotsRing(12, 65, 4, '#5c7a4a')}
      <circle cx="100" cy="100" r="20" fill="#f6c453"/>
    `) },
  ],

  advanced: [
    { name: 'Sun Mandala', svg: svg(`
      ${Array.from({ length: 16 }).map((_, i) => `<path d="M100,100 L100,15 L108,35 Z" fill="#f4a300" transform="rotate(${i * 22.5} 100 100)"/>`).join('')}
      <circle cx="100" cy="100" r="45" fill="none" stroke="#b5233a" stroke-width="3"/>
      <circle cx="100" cy="100" r="25" fill="#5c7a4a"/><circle cx="100" cy="100" r="10" fill="#fdf6ec"/>
    `) },
    { name: 'Full Peacock', svg: svg(`
      ${Array.from({ length: 20 }).map((_, i) => `<g transform="rotate(${i * 18} 100 100)"><ellipse cx="100" cy="25" rx="8" ry="20" fill="${i % 2 === 0 ? '#5c7a4a' : '#f4a300'}" opacity="0.85"/><circle cx="100" cy="20" r="4" fill="#b5233a"/></g>`).join('')}
      <circle cx="100" cy="100" r="40" fill="#3a2a20"/><circle cx="100" cy="100" r="25" fill="#f6c453"/><circle cx="100" cy="100" r="10" fill="#b5233a"/>
    `) },
    { name: 'Layered Lotus Mandala', svg: svg(`
      ${Array.from({ length: 12 }).map((_, i) => `<g transform="rotate(${i * 30} 100 100)"><path d="M100,100 Q112,70 100,45 Q88,70 100,100 Z" fill="#b5233a" opacity="0.7"/></g>`).join('')}
      ${Array.from({ length: 8 }).map((_, i) => `<g transform="rotate(${i * 45 + 15} 100 100)"><path d="M100,100 Q108,80 100,60 Q92,80 100,100 Z" fill="#f4a300" opacity="0.9"/></g>`).join('')}
      <circle cx="100" cy="100" r="55" fill="none" stroke="#5c7a4a" stroke-width="2" stroke-dasharray="5 4"/>
      <circle cx="100" cy="100" r="20" fill="#5c7a4a"/><circle cx="100" cy="100" r="9" fill="#fdf6ec"/>
    `) },
    { name: 'Geometric Diamond Grid', svg: svg(`
      ${Array.from({ length: 4 }).map((_, i) => { const s = 40 + i * 22; return `<rect x="${100 - s / 2}" y="${100 - s / 2}" width="${s}" height="${s}" fill="none" stroke="${['#b5233a', '#f4a300', '#5c7a4a', '#f6c453'][i]}" stroke-width="3" transform="rotate(45 100 100)"/>` }).join('')}
      ${Array.from({ length: 8 }).map((_, i) => `<line x1="100" y1="100" x2="100" y2="15" stroke="#b5233a" stroke-width="2" opacity="0.5" transform="rotate(${i * 45} 100 100)"/>`).join('')}
      <circle cx="100" cy="100" r="8" fill="#3a2a20"/>
    `) },
    { name: 'Sixteen Petal Mandala', svg: svg(`
      ${petals(16, { rx: 10, ry: 30, cy: 65, colors: ['#b5233a', '#f4a300'], opacity: 0.9 })}
      <circle cx="100" cy="100" r="35" fill="none" stroke="#5c7a4a" stroke-width="3"/>
      <circle cx="100" cy="100" r="14" fill="#f6c453"/>
    `) },
    { name: 'Peacock Feather Ring', svg: svg(`
      ${Array.from({ length: 14 }).map((_, i) => `<g transform="rotate(${i * (360 / 14)} 100 100)"><ellipse cx="100" cy="30" rx="12" ry="26" fill="#5c7a4a" opacity="0.75"/><ellipse cx="100" cy="24" rx="6" ry="10" fill="#1e6091"/><circle cx="100" cy="18" r="3" fill="#f4a300"/></g>`).join('')}
      <circle cx="100" cy="100" r="45" fill="none" stroke="#b5233a" stroke-width="2" stroke-dasharray="6 3"/>
      <circle cx="100" cy="100" r="20" fill="#3a2a20"/>
    `) },
    { name: 'Intricate Star Burst', svg: svg(`
      <polygon points="100,20 118,75 175,75 128,110 146,165 100,130 54,165 72,110 25,75 82,75"
        fill="#f6c453" stroke="#b5233a" stroke-width="3"/>
      <circle cx="100" cy="100" r="60" fill="none" stroke="#5c7a4a" stroke-width="2" stroke-dasharray="4 3"/>
      <circle cx="100" cy="100" r="16" fill="#b5233a"/>
    `) },
    { name: 'Nested Hexagon Mandala', svg: svg(`
      ${[70, 50, 30].map((r, i) => {
        const pts = Array.from({ length: 6 }).map((_, k) => {
          const a = (Math.PI / 180) * (k * 60 - 30)
          return `${(100 + r * Math.cos(a)).toFixed(1)},${(100 + r * Math.sin(a)).toFixed(1)}`
        }).join(' ')
        return `<polygon points="${pts}" fill="none" stroke="${['#b5233a', '#f4a300', '#5c7a4a'][i]}" stroke-width="3"/>`
      }).join('')}
      <circle cx="100" cy="100" r="10" fill="#3a2a20"/>
    `) },
    { name: 'Grand Lotus Wheel', svg: svg(`
      ${petals(10, { rx: 18, ry: 45, cy: 55, colors: ['#b5233a'], opacity: 0.65 })}
      ${petals(10, { rx: 12, ry: 28, cy: 65, colors: ['#f4a300'], opacity: 0.9 })}
      <circle cx="100" cy="100" r="22" fill="#5c7a4a"/>
      <circle cx="100" cy="100" r="9" fill="#fdf6ec"/>
    `) },
    { name: 'Festival Diya Ring', svg: svg(`
      ${dotsRing(8, 70, 5, '#f6c453')}
      ${Array.from({ length: 8 }).map((_, i) => {
        const a = (360 / 8) * i
        return `<g transform="rotate(${a} 100 100)"><path d="M85,55 Q100,72 115,55 Q115,45 100,42 Q85,45 85,55 Z" fill="#f4a300" stroke="#b5233a" stroke-width="1.5" transform="translate(0,-15)"/></g>`
      }).join('')}
      <circle cx="100" cy="100" r="40" fill="none" stroke="#5c7a4a" stroke-width="2"/>
      <circle cx="100" cy="100" r="14" fill="#b5233a"/>
    `) },
  ],
}
