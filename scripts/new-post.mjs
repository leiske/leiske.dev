#!/usr/bin/env node
import readline from 'readline'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function getTodayDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer)
    })
  })
}

async function main() {
  try {
    const title = await question('Post title: ')
    if (!title.trim()) {
      console.error('Title is required')
      process.exit(1)
    }

    const slug = generateSlug(title.trim())
    const date = getTodayDate()
    const filename = `posts/${slug}.md`

    const content = `---
date: ${date}
title: ${title}
slug: ${slug}
description: 
wip: true
# tags:
#   - tag1
#   - tag2
---

`

    await execAsync(`cat > "${filename}" << 'EOF'
${content}EOF
`)

    console.log(`Created ${filename}`)
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  } finally {
    rl.close()
  }
}

main()
