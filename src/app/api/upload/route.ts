import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

// Document types — verified only by extension (no magic bytes needed for chat files)
const DOC_TYPES: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'text/plain': 'txt',
  'application/zip': 'zip',
  'application/x-zip-compressed': 'zip',
}

const ALLOWED_TYPES = { ...IMAGE_TYPES, ...DOC_TYPES }

function checkImageMagicBytes(buf: Buffer, mimeType: string): boolean {
  if (mimeType === 'image/jpeg') return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff
  if (mimeType === 'image/png') return buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47
  if (mimeType === 'image/gif') return buf.length >= 4 && buf.slice(0, 4).toString('ascii') === 'GIF8'
  if (mimeType === 'image/webp') return buf.length >= 12 && buf.slice(0, 4).toString('ascii') === 'RIFF' && buf.slice(8, 12).toString('ascii') === 'WEBP'
  return false
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024   // 5 MB for images
const MAX_DOC_SIZE   = 20 * 1024 * 1024  // 20 MB for documents

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    const isImage = !!IMAGE_TYPES[file.type]
    const isDoc   = !!DOC_TYPES[file.type]

    if (!isImage && !isDoc) {
      return NextResponse.json({ error: 'Неподдерживаемый тип файла' }, { status: 415 })
    }

    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_DOC_SIZE
    if (file.size > maxSize) {
      const mb = maxSize / (1024 * 1024)
      return NextResponse.json({ error: `Файл слишком большой (максимум ${mb} МБ)` }, { status: 413 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Validate image magic bytes
    if (isImage && !checkImageMagicBytes(buffer, file.type)) {
      return NextResponse.json({ error: 'Содержимое файла не соответствует типу' }, { status: 415 })
    }

    const ext = ALLOWED_TYPES[file.type]
    const userId = ((session.user as any).id ?? 'user').replace(/[^a-z0-9]/gi, '')
    const filename = `${userId}-${Date.now()}.${ext}`

    const uploadDir = join(process.cwd(), 'uploads')
    await mkdir(uploadDir, { recursive: true })
    await writeFile(join(uploadDir, filename), buffer)

    return NextResponse.json({ url: `/api/uploads/${filename}` })
  } catch {
    return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 })
  }
}
