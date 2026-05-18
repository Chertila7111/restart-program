import nodemailer from 'nodemailer'

function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.yandex.ru',
    port: Number(process.env.SMTP_PORT || 465),
    secure: process.env.SMTP_SECURE !== 'false',
    auth: {
      user: process.env.SMTP_USER || 'hello@snova-s-soboy.ru',
      pass: process.env.SMTP_PASS || '',
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  })
}

export async function sendWelcomeEmail({
  to,
  name,
  product,
  productName,
}: {
  to: string
  name: string
  product: string
  productName: string
}) {
  if (!process.env.SMTP_PASS) return // skip if not configured

  const transport = getTransport()
  const loginUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://snova-s-soboy.ru'}/auth/login`

  await transport.sendMail({
    from: `"Снова с собой" <${process.env.SMTP_USER || 'hello@snova-s-soboy.ru'}>`,
    to,
    subject: `Доступ к программе «${productName}» — Снова с собой`,
    html: `
<!DOCTYPE html>
<html lang="ru">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F0EB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<div style="max-width:560px;margin:2rem auto;background:white;border-radius:1rem;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
  <!-- Header -->
  <div style="background:#4E7B5E;padding:2rem;text-align:center">
    <div style="font-size:1.5rem;font-weight:800;color:white;letter-spacing:-0.02em">Снова с собой</div>
    <div style="font-size:0.875rem;color:rgba(255,255,255,0.75);margin-top:0.25rem">Программа восстановления</div>
  </div>
  <!-- Body -->
  <div style="padding:2rem">
    <h1 style="font-size:1.25rem;font-weight:800;color:#1C2B23;margin:0 0 0.75rem">
      Добро пожаловать, ${name || 'друг'}!
    </h1>
    <p style="color:#4A5E48;line-height:1.7;margin:0 0 1.25rem">
      Оплата прошла успешно. Ваш доступ к программе <strong>«${productName}»</strong> активирован.
    </p>

    <div style="background:#F0F7F2;border-radius:0.75rem;padding:1.25rem;margin-bottom:1.5rem">
      <div style="font-size:0.75rem;font-weight:700;color:#4E7B5E;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.75rem">Ваши данные для входа</div>
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="padding:0.35rem 0;font-size:0.875rem;color:#6B7280;width:6rem">Email</td>
          <td style="padding:0.35rem 0;font-size:0.875rem;font-weight:600;color:#1C2B23">${to}</td>
        </tr>
        <tr>
          <td style="padding:0.35rem 0;font-size:0.875rem;color:#6B7280">Тариф</td>
          <td style="padding:0.35rem 0;font-size:0.875rem;font-weight:600;color:#4E7B5E">${productName}</td>
        </tr>
      </table>
    </div>

    <a href="${loginUrl}" style="display:block;text-align:center;background:#4E7B5E;color:white;text-decoration:none;padding:0.875rem 2rem;border-radius:0.75rem;font-weight:700;font-size:1rem;margin-bottom:1.25rem">
      Войти в личный кабинет →
    </a>

    <p style="color:#6B7280;font-size:0.8rem;line-height:1.6;margin:0 0 1rem">
      Если у вас ещё нет пароля — после первого входа вы сможете его установить.
      Куратор свяжется с вами в течение рабочего дня и объяснит как начать.
    </p>

    <div style="border-top:1px solid #E5EBE3;padding-top:1rem">
      <p style="color:#9CA3AF;font-size:0.75rem;line-height:1.6;margin:0">
        Если возникли вопросы — пишите на <a href="mailto:hello@snova-s-soboy.ru" style="color:#4E7B5E">hello@snova-s-soboy.ru</a>.<br>
        Программа не является медицинской услугой. Участие 18+.
      </p>
    </div>
  </div>
</div>
</body>
</html>
    `.trim(),
  })
}

export async function sendPasswordResetEmail({ to, resetUrl }: { to: string; resetUrl: string }) {
  if (!process.env.SMTP_PASS) return

  const transport = getTransport()
  await transport.sendMail({
    from: `"Снова с собой" <${process.env.SMTP_USER || 'hello@snova-s-soboy.ru'}>`,
    to,
    subject: 'Сброс пароля — Снова с собой',
    html: `
<!DOCTYPE html>
<html lang="ru">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F0EB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<div style="max-width:560px;margin:2rem auto;background:white;border-radius:1rem;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
  <div style="background:#4E7B5E;padding:2rem;text-align:center">
    <div style="font-size:1.5rem;font-weight:800;color:white;letter-spacing:-0.02em">Снова с собой</div>
  </div>
  <div style="padding:2rem">
    <h1 style="font-size:1.25rem;font-weight:800;color:#1C2B23;margin:0 0 0.75rem">Сброс пароля</h1>
    <p style="color:#4A5E48;line-height:1.7;margin:0 0 1.5rem">
      Мы получили запрос на сброс пароля для аккаунта <strong>${to}</strong>.<br>
      Ссылка действительна 1 час.
    </p>
    <a href="${resetUrl}" style="display:block;text-align:center;background:#4E7B5E;color:white;text-decoration:none;padding:0.875rem 2rem;border-radius:0.75rem;font-weight:700;font-size:1rem;margin-bottom:1.5rem">
      Сбросить пароль →
    </a>
    <p style="color:#9CA3AF;font-size:0.8rem;line-height:1.6;margin:0">
      Если вы не запрашивали сброс пароля — просто проигнорируйте это письмо.
    </p>
  </div>
</div>
</body>
</html>
    `.trim(),
  })
}

export async function sendContactEmail({ name, email, message }: { name: string; email: string; message: string }) {
  if (!process.env.SMTP_PASS) return

  const transport = getTransport()
  await transport.sendMail({
    from: `"Снова с собой" <${process.env.SMTP_USER || 'hello@snova-s-soboy.ru'}>`,
    to: process.env.SMTP_USER || 'hello@snova-s-soboy.ru',
    replyTo: email,
    subject: `Новое сообщение от ${name}`,
    html: `<p><b>От:</b> ${name} (${email})</p><p>${message}</p>`,
  })
}
