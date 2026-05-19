/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

let _initialized = false
let _promise: Promise<void> | null = null

export async function ensureDb(): Promise<void> {
  if (_initialized) return
  if (!_promise) _promise = _init().then(() => { _initialized = true })
  await _promise
}

async function sql(s: string) {
  try { await (prisma as any).$executeRawUnsafe(s) } catch { /* ignore if already exists */ }
}

async function _init() {
  // ── Base tables ──
  await sql(`CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "phone" TEXT,
    "passwordHash" TEXT,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`)
  await sql(`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`)

  await sql(`CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
  )`)
  await sql(`CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_prov_key" ON "Account"("provider","providerAccountId")`)

  await sql(`CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
  )`)
  await sql(`CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken")`)

  await sql(`CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
  )`)
  await sql(`CREATE UNIQUE INDEX IF NOT EXISTS "VToken_token_key" ON "VerificationToken"("token")`)
  await sql(`CREATE UNIQUE INDEX IF NOT EXISTS "VToken_ident_token_key" ON "VerificationToken"("identifier","token")`)

  await sql(`CREATE TABLE IF NOT EXISTS "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "product" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id")
  )`)

  await sql(`CREATE TABLE IF NOT EXISTS "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "message" TEXT,
    "source" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`)

  await sql(`CREATE TABLE IF NOT EXISTS "JournalEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'daily',
    "mood" INTEGER NOT NULL DEFAULT 5,
    "anxiety" INTEGER NOT NULL DEFAULT 5,
    "urgeToWrite" INTEGER NOT NULL DEFAULT 1,
    "energy" INTEGER NOT NULL DEFAULT 5,
    "sleep" TEXT NOT NULL DEFAULT 'ok',
    "triggers" TEXT,
    "helpers" TEXT,
    "note" TEXT,
    "nextStep" TEXT,
    "situation" TEXT,
    "intensity" INTEGER,
    "wantToDo" TEXT,
    "saferAction" TEXT,
    "weekSum1" TEXT,
    "weekSum2" TEXT,
    "weekSum3" TEXT,
    "weekSum4" TEXT,
    "weekSum5" TEXT,
    "sharedWithSpecialist" INTEGER NOT NULL DEFAULT 0,
    "isDraft" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "JEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
  )`)
  await sql(`CREATE UNIQUE INDEX IF NOT EXISTS "JEntry_userId_date_type_key" ON "JournalEntry"("userId","date","type")`)

  await sql(`CREATE TABLE IF NOT EXISTS "PsychologistProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "speciality" TEXT,
    "approach" TEXT,
    "education" TEXT,
    "experience" TEXT,
    "bio" TEXT,
    "workStyle" TEXT,
    "quote" TEXT,
    "photoUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PsychProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
  )`)
  await sql(`CREATE UNIQUE INDEX IF NOT EXISTS "PsychProfile_userId_key" ON "PsychologistProfile"("userId")`)
  // Add columns to existing tables (silently ignored if column already exists)
  await sql(`ALTER TABLE "PsychologistProfile" ADD COLUMN "workStyle" TEXT`)
  await sql(`ALTER TABLE "PsychologistProfile" ADD COLUMN "quote" TEXT`)
  await sql(`ALTER TABLE "PsychologistProfile" ADD COLUMN "meetingLink" TEXT`)

  await sql(`CREATE TABLE IF NOT EXISTS "PushSubscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PS_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
  )`)
  await sql(`CREATE UNIQUE INDEX IF NOT EXISTS "PS_userId_endpoint_key" ON "PushSubscription"("userId","endpoint")`)

  await sql(`CREATE TABLE IF NOT EXISTS "TaskCompletion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TaskCompl_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
  )`)
  await sql(`CREATE UNIQUE INDEX IF NOT EXISTS "TaskCompl_userId_taskId_key" ON "TaskCompletion"("userId","taskId")`)

  // ── New tables ──
  await sql(`CREATE TABLE IF NOT EXISTS "Conversation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subject" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`)

  await sql(`CREATE TABLE IF NOT EXISTS "ConversationMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "CM_convId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE,
    CONSTRAINT "CM_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
  )`)
  await sql(`CREATE UNIQUE INDEX IF NOT EXISTS "CM_convId_userId_key" ON "ConversationMember"("conversationId","userId")`)

  await sql(`CREATE TABLE IF NOT EXISTS "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" DATETIME,
    CONSTRAINT "Msg_convId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE,
    CONSTRAINT "Msg_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE
  )`)

  await sql(`CREATE TABLE IF NOT EXISTS "AvailableSlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "doctorId" TEXT NOT NULL,
    "startAt" DATETIME NOT NULL,
    "durationMin" INTEGER NOT NULL DEFAULT 45,
    "isBooked" INTEGER NOT NULL DEFAULT 0,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Slot_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE CASCADE
  )`)

  await sql(`CREATE TABLE IF NOT EXISTS "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'individual',
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "Booking_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "AvailableSlot"("id") ON DELETE CASCADE
  )`)
  await sql(`CREATE UNIQUE INDEX IF NOT EXISTS "Booking_slotId_key" ON "Booking"("slotId")`)

  // ── Extended tables ──
  await sql(`CREATE TABLE IF NOT EXISTS "UserProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "photoUrl" TEXT,
    "age" TEXT,
    "city" TEXT,
    "timezone" TEXT,
    "phone" TEXT,
    "telegram" TEXT,
    "about" TEXT,
    "situation" TEXT,
    "mainPain" TEXT,
    "goals" TEXT,
    "moodNow" INTEGER,
    "diaryAccess" TEXT NOT NULL DEFAULT 'private',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
  )`)
  await sql(`CREATE UNIQUE INDEX IF NOT EXISTS "UserProfile_userId_key" ON "UserProfile"("userId")`)

  await sql(`CREATE TABLE IF NOT EXISTS "Group" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "startDate" DATETIME,
    "psychologistId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'recruiting',
    "currentWeek" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`)

  await sql(`CREATE TABLE IF NOT EXISTS "GroupParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "diaryAccessGranted" INTEGER NOT NULL DEFAULT 0,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GP_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE
  )`)
  await sql(`CREATE UNIQUE INDEX IF NOT EXISTS "GP_groupId_userId_key" ON "GroupParticipant"("groupId","userId")`)

  await sql(`CREATE TABLE IF NOT EXISTS "SpecialistNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "specialistId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "tags" TEXT,
    "isImportant" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`)

  await sql(`CREATE TABLE IF NOT EXISTS "Recommendation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "specialistId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'session',
    "summary" TEXT NOT NULL,
    "focus" TEXT,
    "exercises" TEXT,
    "nextStep" TEXT,
    "visibleToUser" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`)

  await sql(`CREATE TABLE IF NOT EXISTS "SpecialistAvailability" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "specialistId" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 60,
    "type" TEXT NOT NULL DEFAULT 'individual',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SA_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "User"("id") ON DELETE CASCADE
  )`)

  await sql(`CREATE TABLE IF NOT EXISTS "Meeting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL DEFAULT 'custom',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "duration" TEXT NOT NULL DEFAULT '90 мин',
    "meetingLink" TEXT,
    "doctorId" TEXT,
    "targetTiers" TEXT NOT NULL DEFAULT '["intro","base","plus","personal"]',
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "createdBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`)

  // ── curatorId column on Group ──
  try { await (prisma as any).$executeRawUnsafe(`ALTER TABLE "Group" ADD COLUMN "curatorId" TEXT`) } catch { /* already exists */ }

  // ── lastSeenAt on User ──
  try { await (prisma as any).$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN "lastSeenAt" DATETIME`) } catch { /* already exists */ }

  // ── Notifications for curators ──
  await sql(`CREATE TABLE IF NOT EXISTS "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'info',
    "title" TEXT NOT NULL,
    "body" TEXT,
    "relatedId" TEXT,
    "read" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notif_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
  )`)

  // ── Seed accounts ──
  await seedDoctor()
  await seedCurator()
  await seedTestUser()
}

async function seedTestUser() {
  const email = 'test@snova-s-soboy.ru'
  try {
    const passwordHash = await bcrypt.hash('Test2026!', 10)
    await (prisma as any).$executeRawUnsafe(`
      INSERT OR IGNORE INTO "User" ("id","email","name","passwordHash","role","createdAt","updatedAt")
      VALUES ('test-user-anna', '${email}', 'Анна (тест)', '${passwordHash}', 'user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `)
    await (prisma as any).$executeRawUnsafe(`
      INSERT OR IGNORE INTO "Order" ("id","userId","email","name","product","productName","amount","status","createdAt","updatedAt")
      VALUES ('order-test-intro', 'test-user-anna', '${email}', 'Анна (тест)', 'intro', 'Вводная встреча', 1490, 'paid', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `)
  } catch { /* ignore */ }
}

async function seedCurator() {
  const email = 'curator@snova-s-soboy.ru'
  const curatorId = 'curator-elena-demo'
  const doctorId = 'doctor-maria-sokolova'
  const groupId = 'group-seed-spring-2026'
  try {
    const passwordHash = await bcrypt.hash('Curator2026!', 10)
    await (prisma as any).$executeRawUnsafe(`
      INSERT OR IGNORE INTO "User" ("id","email","name","passwordHash","role","createdAt","updatedAt")
      VALUES ('${curatorId}', '${email}', 'Елена Куратор', '${passwordHash}', 'curator', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `)
    // Create a seed group and add the test user so the curator cabinet has something to show
    await (prisma as any).$executeRawUnsafe(`
      INSERT OR IGNORE INTO "Group" ("id","title","psychologistId","status","currentWeek","curatorId","createdAt")
      VALUES ('${groupId}', 'Группа — Весна 2026', '${doctorId}', 'active', 1, '${curatorId}', CURRENT_TIMESTAMP)
    `)
    await (prisma as any).$executeRawUnsafe(`
      INSERT OR IGNORE INTO "GroupParticipant" ("id","groupId","userId","status","joinedAt")
      VALUES ('gp-seed-anna-001', '${groupId}', 'test-user-anna', 'active', CURRENT_TIMESTAMP)
    `)
  } catch { /* ignore */ }
}

async function seedDoctor() {
  const email = 'doctor@snova-s-soboy.ru'
  const doctorId = 'doctor-maria-sokolova'
  const convId = 'conv-support-general'
  try {
    const passwordHash = await bcrypt.hash('Doctor2026!', 10)
    await (prisma as any).$executeRawUnsafe(`
      INSERT OR IGNORE INTO "User" ("id","email","name","passwordHash","role","createdAt","updatedAt")
      VALUES ('${doctorId}', '${email}', 'Мария Соколова', '${passwordHash}', 'psychologist', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `)
    await (prisma as any).$executeRawUnsafe(`
      INSERT OR IGNORE INTO "PsychologistProfile" ("id","userId","speciality","approach","education","experience","bio","createdAt","updatedAt")
      VALUES ('psych-maria-sokolova', '${doctorId}', 'Клинический психолог', 'КПТ и схема-терапия', 'МГУ, факультет психологии · Сертификат КПТ (Beck Institute)', '9 лет практики · 300+ индивидуальных клиентов · 4 года ведения групп', 'Специализируюсь на работе с расставаниями, потерями и переходными периодами. Провожу как групповые, так и индивидуальные сессии.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `)
    await (prisma as any).$executeRawUnsafe(`
      INSERT OR IGNORE INTO "Conversation" ("id","subject","createdAt","updatedAt")
      VALUES ('${convId}', 'Общий чат с психологом', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `)
    await (prisma as any).$executeRawUnsafe(`
      INSERT OR IGNORE INTO "ConversationMember" ("id","conversationId","userId")
      VALUES ('cm-doctor-general', '${convId}', '${doctorId}')
    `)
    await (prisma as any).$executeRawUnsafe(`
      INSERT OR IGNORE INTO "Message" ("id","conversationId","senderId","text","createdAt")
      VALUES ('msg-welcome-init', '${convId}', '${doctorId}',
        'Добро пожаловать! Я Мария — психолог программы «Снова с собой». Здесь вы можете задать вопросы по программе, записаться на индивидуальную встречу или просто написать, если нужна поддержка. Отвечаю в будни с 10:00 до 19:00 МСК.',
        CURRENT_TIMESTAMP)
    `)
    // Remove the stale demo group if it still exists
    await (prisma as any).$executeRawUnsafe(
      `DELETE FROM "GroupParticipant" WHERE groupId = 'group-demo-spring-2026'`
    ).catch(() => {})
    await (prisma as any).$executeRawUnsafe(
      `DELETE FROM "Group" WHERE id = 'group-demo-spring-2026'`
    ).catch(() => {})
  } catch { /* ignore */ }
}
