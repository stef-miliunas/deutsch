// Generates PWA icons (German flag stripes) as PNGs using only node:zlib —
// run once via `node scripts/gen-icons.mjs`.
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})

function crc32(buf) {
  let c = 0xffffffff
  for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function png(size, pixelAt) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 2 // color type: truecolor
  const rows = []
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3)
    for (let x = 0; x < size; x++) {
      const [r, g, b] = pixelAt(x, y)
      row[1 + x * 3] = r
      row[2 + x * 3] = g
      row[3 + x * 3] = b
    }
    rows.push(row)
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(Buffer.concat(rows))),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const BLACK = [30, 30, 30]
const RED = [221, 0, 0]
const GOLD = [255, 206, 0]
const BG = [15, 23, 42] // slate-900, matches theme

function flagIcon(size) {
  const pad = Math.round(size * 0.12)
  const inner = size - pad * 2
  const radius = Math.round(inner * 0.18)
  return png(size, (x, y) => {
    const ix = x - pad
    const iy = y - pad
    if (ix < 0 || iy < 0 || ix >= inner || iy >= inner) return BG
    // Rounded corners on the flag tile
    const cx = ix < radius ? radius - ix : ix >= inner - radius ? ix - (inner - radius - 1) : 0
    const cy = iy < radius ? radius - iy : iy >= inner - radius ? iy - (inner - radius - 1) : 0
    if (cx * cx + cy * cy > radius * radius) return BG
    if (iy < inner / 3) return BLACK
    if (iy < (2 * inner) / 3) return RED
    return GOLD
  })
}

mkdirSync(new URL('../public/icons/', import.meta.url), { recursive: true })
for (const size of [192, 512]) {
  writeFileSync(new URL(`../public/icons/icon-${size}.png`, import.meta.url), flagIcon(size))
  console.log(`wrote public/icons/icon-${size}.png`)
}
