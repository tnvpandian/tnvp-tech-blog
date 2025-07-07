// scripts/generate-tag-data.js
import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const POSTS_DIR = join(__dirname, '../data/blog') // path to your MD/MDX posts
const OUTPUT_FILE = join(__dirname, '../app/tag-data.json')

const tagCount = {}

function walkDirectory(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      walkDirectory(fullPath)
    } else if (fullPath.endsWith('.md') || fullPath.endsWith('.mdx')) {
      const fileContent = readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContent)
      const tags = data.tags || []
      tags.forEach((tag) => {
        const slug = tag.toLowerCase().replace(/\s+/g, '-')
        tagCount[slug] = (tagCount[slug] || 0) + 1
      })
    }
  }
}

walkDirectory(POSTS_DIR)

writeFileSync(OUTPUT_FILE, JSON.stringify(tagCount, null, 2))
console.log('✅ tag-data.json generated.')
