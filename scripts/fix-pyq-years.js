// scripts/fix-pyq-years.js
const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '..', 'prisma', 'seed.ts')
let content = fs.readFileSync(filePath, 'utf8')

const daIndices = new Set([19, 20, 21, 22])
const csYears = [2022, 2023, 2024, 2025, 2026]
const daYears = [2024, 2025, 2026]

let i = 0, csIdx = 0, daIdx = 0

const newContent = content.replace(/year: \d+,/g, () => {
  let newYear
  if (daIndices.has(i)) { newYear = daYears[daIdx % daYears.length]; daIdx++ }
  else { newYear = csYears[csIdx % csYears.length]; csIdx++ }
  i++
  return `year: ${newYear},`
})

fs.writeFileSync(filePath, newContent)
console.log(`✅ Remapped ${i} question years (CSE -> 2022-2026, DA -> 2024-2026)`)