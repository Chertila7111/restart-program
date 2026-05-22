#!/usr/bin/env python3
import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '194.87.76.109'
USER = 'root'
PASSWORD = 'meBdV,Y7ur1gUs'
RESEND_KEY = 're_Kf3qMddn_3GUZTBfpGyGFTrmtXW6ppnRQ'

def run(ssh, cmd, timeout=300):
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    return out, err

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASSWORD, timeout=30)
print('Connected')

# Git pull
print('\n--- git pull ---')
out, err = run(ssh, 'cd /var/www/restart-app && git pull origin main 2>&1', timeout=60)
print(out, err)

# Ensure RESEND_API_KEY is set
out, _ = run(ssh, 'grep -c RESEND_API_KEY /var/www/restart-app/.env.production 2>/dev/null || echo 0')
if out.strip() == '0':
    run(ssh, f'echo \'RESEND_API_KEY="{RESEND_KEY}"\' >> /var/www/restart-app/.env.production')
else:
    run(ssh, f'sed -i "/RESEND_API_KEY/d" /var/www/restart-app/.env.production')
    run(ssh, f'echo \'RESEND_API_KEY="{RESEND_KEY}"\' >> /var/www/restart-app/.env.production')
print('RESEND_API_KEY ok')

# npm install
print('\n--- npm install ---')
out, err = run(ssh, 'cd /var/www/restart-app && npm install 2>&1', timeout=120)
print(out[-500:])

# DB push (add new columns, non-destructive)
print('\n--- db push ---')
out, err = run(ssh, 'cd /var/www/restart-app && npx prisma db push --skip-generate --accept-data-loss 2>&1', timeout=60)
print(out[-500:])

# Build
print('\n--- build ---')
out, err = run(ssh, 'cd /var/www/restart-app && npm run build 2>&1', timeout=300)
combined = out + err
print(combined[-3000:])

if 'build error' in combined.lower():
    print('\nBuild FAILED')
    ssh.close()
    sys.exit(1)

# Restart
print('\n--- restart ---')
out, _ = run(ssh, 'pm2 restart restart-app --update-env && pm2 save 2>&1')
print(out)

ssh.close()
print('\nDone!')
