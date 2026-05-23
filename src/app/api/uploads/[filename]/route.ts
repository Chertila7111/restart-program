import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { readFile } from 'fs/promises'
import { join, basename } from 'path'

const EXT_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
}

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } },
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Sanitize: strip path traversal, allow only safe filenames
  const safe = basename(params.filename).replace(/[^a-zA-Z0-9._-]/g, '')
  const ext = safe.split('.').pop()?.toLowerCase() ?? ''
  const mime = EXT_MIME[ext]
  if (!mime || !safe) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const filePath = join(process.cwd(), 'uploads', safe)
    const buf = await readFile(filePath)
    return new NextResponse(buf, {
      headers: {
        'Content-Type': mime,
        'Cache-Control': 'private, max-age=3600',
        'Content-Disposition': 'inline',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
