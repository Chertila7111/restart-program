import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Снова с собой <hello@snova-s-soboy.ru>'
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://snova-s-soboy.ru'

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
    Вопросы — пишите на <a href="mailto:hello@snova-s-soboy.ru" style="color:#4E7B5E">hello@snova-s-soboy.ru</a>.<br>
    Программа не является медицинской услугой. Участие 18+.
  </p>
</div></div></div></body></html>`
}

export async function sendWelcomeEmail({
  to, name, product, productName, tempPassword,
}: {
  to: string; name: string; product: string; productName: string; tempPassword?: string
}) {
  if (!process.env.RESEND_API_KEY) return

  const passwordRow = tempPassword
    ? `<tr><td style="padding:0.35rem 0;font-size:0.875rem;color:#6B7280;width:6rem">Пароль</td>
       <td style="padding:0.35rem 0;font-size:0.875rem;font-weight:700;color:#1C2B23;font-family:monospace;letter-spacing:0.05em">${tempPassword}</td></tr>`
    : ''

  const note = tempPassword
    ? `<p style="color:#6B7280;font-size:0.8rem;line-height:1.6;margin:0 0 1rem">Это временный пароль — после входа вы сможете сменить его в настройках.</p>`
    : `<p style="color:#6B7280;font-size:0.8rem;line-height:1.6;margin:0 0 1rem">Куратор свяжется с вами в течение рабочего дня.</p>`

  await resend.emails.send({
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
  if (!process.env.RESEND_API_KEY) return

  await resend.emails.send({
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

export async function sendContactEmail({ name, email, message }: { name: string; email: string; message: string }) {
  if (!process.env.RESEND_API_KEY) return

  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || 'snovassoboi@yandex.com'
  await resend.emails.send({
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
