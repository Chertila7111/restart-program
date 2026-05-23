import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

function checkMagicBytes(buf: Buffer, mimeType: string): boolean {
  if (mimeType === 'image/jpeg') {
    return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff
  }
  if (mimeType === 'image/png') {
    return buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47
  }
  if (mimeType === 'image/gif') {
    return buf.length >= 4 && buf.slice(0, 4).toString('ascii') === 'GIF8'
  }
  if (mimeType === 'image/webp') {
    return buf.length >= 12 &&
      buf.slice(0, 4).toString('ascii') === 'RIFF' &&
      buf.slice(8, 12).toString('ascii') === 'WEBP'
  }
  return false
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Файл слишком большой (максимум 5 МБ)' }, { status: 413 })
    }

    const ext = MIME_TO_EXT[file.type]
    if (!ext) {
      return NextResponse.json({ error: 'Только JPG, PNG, WebP или GIF' }, { status: 415 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    if (!checkMagicBytes(buffer, file.type)) {
      return NextResponse.json({ error: 'Содержимое файла не соответствует типу' }, { status: 415 })
    }

    const userId = ((session.user as any).id ?? 'user').replace(/[^a-z0-9]/gi, '')
    const filename = `${userId}-${Date.now()}.${ext}`

    // Store outside public/ — served via auth-protected /api/uploads/[filename]
    const uploadDir = join(process.cwd(), 'uploads')
    await mkdir(uploadDir, { recursive: true })
    await writeFile(join(uploadDir, filename), buffer)

    return NextResponse.json({ url: `/api/uploads/${filename}` })
  } catch {
    return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 })
  }
}
