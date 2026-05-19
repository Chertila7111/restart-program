import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ChatShell } from '@/app/dashboard/chats/ChatShell'

export default async function CuratorChatsPage({
  searchParams,
}: {
  searchParams: Promise<{ with?: string; name?: string }>
}) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id as string
  const userName = session?.user?.name ?? ''

  const sp = await searchParams
  const initialUserId = sp.with
  const initialName = sp.name ? decodeURIComponent(sp.name) : undefined

  return (
    <div style={{ position: 'relative', height: 'calc(100vh - 8rem)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Fern top-right */}
      <svg viewBox="0 0 420 700" fill="none" xmlns="http://www.w3.org/2000/svg"
           style={{ position: 'absolute', top: '-1rem', right: '-2rem', width: '340px', height: '560px', opacity: 0.07, pointerEvents: 'none', zIndex: 0 }}>
        <path d="M280 8 C305 160 265 390 130 680" stroke="#4E7B5E" strokeWidth="3" strokeLinecap="round"/>
        <path d="M286 56 C314 42 343 40 371 50 C343 64 314 66 286 56Z" fill="#4E7B5E"/>
        <path d="M286 56 C258 42 229 40 201 50 C229 64 258 66 286 56Z" fill="#4E7B5E"/>
        <path d="M279 112 C307 93 338 88 368 95 C340 112 309 115 279 112Z" fill="#4E7B5E"/>
        <path d="M279 112 C251 93 220 88 190 95 C218 112 249 115 279 112Z" fill="#4E7B5E"/>
        <path d="M269 172 C298 148 331 141 362 146 C333 164 300 169 269 172Z" fill="#4E7B5E"/>
        <path d="M269 172 C240 148 207 141 176 146 C205 164 238 169 269 172Z" fill="#4E7B5E"/>
        <path d="M255 238 C285 211 319 202 352 206 C322 226 288 232 255 238Z" fill="#4E7B5E"/>
        <path d="M255 238 C225 211 191 202 158 206 C188 226 222 232 255 238Z" fill="#4E7B5E"/>
        <path d="M238 310 C268 280 303 270 337 272 C306 294 271 300 238 310Z" fill="#4E7B5E"/>
        <path d="M238 310 C208 280 173 270 139 272 C170 294 205 300 238 310Z" fill="#4E7B5E"/>
      </svg>
      {/* Fern bottom-left */}
      <svg viewBox="0 0 300 500" fill="none" xmlns="http://www.w3.org/2000/svg"
           style={{ position: 'absolute', bottom: '1rem', left: '-1rem', width: '200px', height: '334px', opacity: 0.05, pointerEvents: 'none', zIndex: 0, transform: 'scaleX(-1) rotate(-15deg)' }}>
        <path d="M220 10 C240 120 200 300 90 480" stroke="#4E7B5E" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M224 52 C248 40 272 38 294 46 C271 58 247 60 224 52Z" fill="#4E7B5E"/>
        <path d="M224 52 C200 40 176 38 154 46 C177 58 201 60 224 52Z" fill="#4E7B5E"/>
        <path d="M218 106 C243 91 268 88 292 94 C268 108 242 111 218 106Z" fill="#4E7B5E"/>
        <path d="M218 106 C193 91 168 88 144 94 C168 108 194 111 218 106Z" fill="#4E7B5E"/>
        <path d="M209 162 C234 145 260 140 285 145 C260 161 234 165 209 162Z" fill="#4E7B5E"/>
        <path d="M209 162 C184 145 158 140 133 145 C158 161 184 165 209 162Z" fill="#4E7B5E"/>
        <path d="M196 222 C221 203 248 196 274 200 C249 218 222 222 196 222Z" fill="#4E7B5E"/>
        <path d="M196 222 C171 203 144 196 118 200 C143 218 170 222 196 222Z" fill="#4E7B5E"/>
      </svg>

      <div style={{ marginBottom: '1rem', flexShrink: 0, position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>Чаты</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Переписка с участниками программы</p>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        <ChatShell
          userId={userId}
          userName={userName}
          userRole="curator"
          initialUserId={initialUserId}
          initialName={initialName}
        />
      </div>
    </div>
  )
}
