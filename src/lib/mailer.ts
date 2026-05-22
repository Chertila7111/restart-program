import { Resend } from 'resend'

const FROM = 'Снова с собой <hello@snova-s-soboy.ru>'
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://snova-s-soboy.ru'

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not set')
  return new Resend(key)
}

function header() {
  return `<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F0EB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<div style="max-width:560px;margin:2rem auto;background:white;border-radius:1rem;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
<div style="background:#4E7B5E;padding:2rem;text-align:center">
  <div style="font-size:1.5rem;font-weight:800;color:white;letter-spacing:-0.02em">Снова с собой</div>
  <div style="font-size:0.875rem;color:rgba(255,255,255,0.75);margin-top:0.25rem">Программа восстановления</div>
</div><div style="padding:2rem">`
}

function footer() {
  return `<div style="border-top:1px solid #E5EBE3;padding-top:1rem;margin-top:1rem">
  <p style="color:#9CA3AF;font-size:0.75rem;line-height:1.6;margin:0">
    Вопросы — пишите на <a href="mailto:snovassoboi@yandex.com" style="color:#4E7B5E">snovassoboi@yandex.com</a>.<br>
    Программа не является медицинской услугой. Участие 18+.
  </p>
</div></div></div></body></html>`
}

export async function sendWelcomeEmail({
  to, name, product, productName, tempPassword,
}: {
  to: string; name: string; product: string; productName: string; tempPassword?: string
}) {
  if (!process.env.RESEND_API_KEY) { console.warn('[mailer] RESEND_API_KEY not set, skipping'); return }

  const passwordRow = tempPassword
    ? `<tr><td style="padding:0.35rem 0;font-size:0.875rem;color:#6B7280;width:6rem">Пароль</td>
       <td style="padding:0.35rem 0;font-size:0.875rem;font-weight:700;color:#1C2B23;font-family:monospace;letter-spacing:0.05em">${tempPassword}</td></tr>`
    : ''

  const note = tempPassword
    ? `<p style="color:#6B7280;font-size:0.8rem;line-height:1.6;margin:0 0 1rem">Это временный пароль — после входа вы сможете сменить его в настройках.</p>`
    : `<p style="color:#6B7280;font-size:0.8rem;line-height:1.6;margin:0 0 1rem">Куратор свяжется с вами в течение рабочего дня.</p>`

  await getResend().emails.send({
    from: FROM,
    to,
    subject: `Доступ к программе «${productName}» — Снова с собой`,
    html: header() + `
    <h1 style="font-size:1.25rem;font-weight:800;color:#1C2B23;margin:0 0 0.75rem">Добро пожаловать, ${name || 'друг'}!</h1>
    <p style="color:#4A5E48;line-height:1.7;margin:0 0 1.25rem">Оплата прошла успешно. Ваш доступ к <strong>«${productName}»</strong> активирован.</p>
    <div style="background:#F0F7F2;border-radius:0.75rem;padding:1.25rem;margin-bottom:1.5rem">
      <div style="font-size:0.75rem;font-weight:700;color:#4E7B5E;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.75rem">Данные для входа</div>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:0.35rem 0;font-size:0.875rem;color:#6B7280;width:6rem">Email</td>
            <td style="padding:0.35rem 0;font-size:0.875rem;font-weight:600;color:#1C2B23">${to}</td></tr>
        ${passwordRow}
        <tr><td style="padding:0.35rem 0;font-size:0.875rem;color:#6B7280">Тариф</td>
            <td style="padding:0.35rem 0;font-size:0.875rem;font-weight:600;color:#4E7B5E">${productName}</td></tr>
      </table>
    </div>
    <a href="${SITE}/auth/login" style="display:block;text-align:center;background:#4E7B5E;color:white;text-decoration:none;padding:0.875rem 2rem;border-radius:0.75rem;font-weight:700;font-size:1rem;margin-bottom:1.25rem">
      Войти в личный кабинет →
    </a>
    ${note}` + footer(),
  })
}

export async function sendPasswordResetEmail({ to, resetUrl }: { to: string; resetUrl: string }) {
  if (!process.env.RESEND_API_KEY) { console.warn('[mailer] RESEND_API_KEY not set, skipping'); return }

  await getResend().emails.send({
    from: FROM,
    to,
    subject: 'Сброс пароля — Снова с собой',
    html: header() + `
    <h1 style="font-size:1.25rem;font-weight:800;color:#1C2B23;margin:0 0 0.75rem">Сброс пароля</h1>
    <p style="color:#4A5E48;line-height:1.7;margin:0 0 1.5rem">
      Запрос сброса пароля для <strong>${to}</strong>. Ссылка действительна 1 час.
    </p>
    <a href="${resetUrl}" style="display:block;text-align:center;background:#4E7B5E;color:white;text-decoration:none;padding:0.875rem 2rem;border-radius:0.75rem;font-weight:700;font-size:1rem;margin-bottom:1.5rem">
      Сбросить пароль →
    </a>
    <p style="color:#9CA3AF;font-size:0.8rem">Если не запрашивали — проигнорируйте это письмо.</p>` + footer(),
  })
}

const CATEGORY_TEXT: Record<string, string> = {
  thoughts: 'Остановить навязчивые мысли и желание написать бывшему/бывшей',
  anxiety:  'Справиться с тревогой, пустотой и физическим дискомфортом',
  future:   'Вернуть ощущение будущего и найти первые точки опоры',
  work:     'Восстановить рабочий ритм и обычную жизнь',
}

export async function sendQuizResultEmail({
  to, name, category, situation,
  articleTitles,
}: {
  to: string; name: string; category: string; situation: string
  articleTitles: string[]
}) {
  if (!process.env.RESEND_API_KEY) { console.warn('[mailer] RESEND_API_KEY not set, skipping'); return }

  const focus = CATEGORY_TEXT[category] ?? 'Найти опору и постепенно двигаться вперёд'
  const articleRows = articleTitles.map(t =>
    `<li style="margin-bottom:0.5rem;font-size:0.875rem;color:#4A5E48;line-height:1.6">${t}</li>`
  ).join('')

  await getResend().emails.send({
    from: FROM,
    to,
    subject: 'Ваш результат теста — Снова с собой',
    html: header() + `
    <h1 style="font-size:1.2rem;font-weight:800;color:#1C2B23;margin:0 0 0.75rem">Ваш результат сохранён, ${name?.split(' ')[0] || 'друг'}</h1>
    <p style="color:#4A5E48;line-height:1.7;margin:0 0 1.25rem">
      Судя по ответам, сейчас вам важнее всего: <strong>${focus}</strong>.
    </p>
    <div style="background:#F0F7F2;border-radius:0.75rem;padding:1.25rem;margin-bottom:1.5rem">
      <div style="font-size:0.75rem;font-weight:700;color:#4E7B5E;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.75rem">Что можно прочитать сейчас</div>
      <ul style="margin:0;padding-left:1.25rem">${articleRows}</ul>
    </div>
    <p style="color:#6B7280;font-size:0.875rem;line-height:1.7;margin:0 0 1.25rem">
      Вводная встреча — 90 минут в небольшой группе с психологом. Можно просто слушать. Стоимость засчитывается при покупке программы.
    </p>
    <a href="${SITE}/checkout?product=intro" style="display:block;text-align:center;background:#4E7B5E;color:white;text-decoration:none;padding:0.875rem 2rem;border-radius:0.75rem;font-weight:700;font-size:1rem;margin-bottom:1.25rem">
      Записаться на вводную встречу — 1 490 ₽ →
    </a>` + footer(),
  })
}

export async function sendIntroPrepEmail({ to, name }: { to: string; name: string }) {
  if (!process.env.RESEND_API_KEY) { console.warn('[mailer] RESEND_API_KEY not set, skipping'); return }

  await getResend().emails.send({
    from: FROM,
    to,
    subject: 'Как подготовиться к вводной встрече — Снова с собой',
    html: header() + `
    <h1 style="font-size:1.2rem;font-weight:800;color:#1C2B23;margin:0 0 0.75rem">Встреча совсем скоро, ${name?.split(' ')[0] || 'друг'}</h1>
    <p style="color:#4A5E48;line-height:1.7;margin:0 0 1.25rem">Вот несколько вещей, которые помогут провести встречу с пользой:</p>
    <div style="display:flex;flex-direction:column;gap:0.75rem;margin-bottom:1.5rem">
      ${[
        ['Найдите тихое место', 'Встреча онлайн — наушники приветствуются, камера по желанию.'],
        ['Ничего готовить не нужно', 'Можно просто прийти и слушать. Не обязательно говорить о себе.'],
        ['Вопросы для размышления', 'Что сейчас тяжелее всего? Какой поддержки не хватает? Есть ли вопрос к психологу?'],
        ['Журнал состояния', 'В личном кабинете уже доступен дневник — попробуйте сделать первую запись.'],
      ].map(([title, text]) => `
        <div style="background:#F0F7F2;border-radius:0.75rem;padding:1rem 1.25rem">
          <div style="font-weight:700;color:#1C2B23;font-size:0.875rem;margin-bottom:0.25rem">${title}</div>
          <div style="color:#6B7280;font-size:0.825rem;line-height:1.6">${text}</div>
        </div>`).join('')}
    </div>
    <a href="${SITE}/dashboard" style="display:block;text-align:center;background:#4E7B5E;color:white;text-decoration:none;padding:0.875rem 2rem;border-radius:0.75rem;font-weight:700;font-size:1rem;margin-bottom:1rem">
      Перейти в личный кабинет →
    </a>
    <a href="${SITE}/dashboard/firstweek" style="display:block;text-align:center;color:#4E7B5E;text-decoration:none;font-size:0.875rem;margin-bottom:1.25rem">
      План первых 7 дней →
    </a>` + footer(),
  })
}

export async function sendContactEmail({ name, email, message }: { name: string; email: string; message: string }) {
  if (!process.env.RESEND_API_KEY) { console.warn('[mailer] RESEND_API_KEY not set, skipping'); return }

  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || 'snovassoboi@yandex.com'
  await getResend().emails.send({
    from: FROM,
    to: adminEmail,
    replyTo: email,
    subject: `Заявка с сайта от ${name}`,
    html: `<div style="font-family:sans-serif;max-width:520px;padding:1.5rem">
      <h2 style="color:#1C2B23;margin:0 0 1rem">Новое сообщение с сайта</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:1rem">
        <tr><td style="padding:6px 0;color:#6B7280;width:80px">Имя</td><td style="padding:6px 0;font-weight:600">${name}</td></tr>
        <tr><td style="padding:6px 0;color:#6B7280">Email</td><td style="padding:6px 0"><a href="mailto:${email}" style="color:#4E7B5E">${email}</a></td></tr>
      </table>
      <div style="padding:1rem;background:#F0F7F2;border-radius:8px;white-space:pre-wrap;color:#1C2B23">${message}</div>
      <p style="margin-top:1rem;color:#9CA3AF;font-size:0.8rem">Нажмите «Ответить» чтобы ответить напрямую на ${email}</p>
    </div>`,
  })
}
