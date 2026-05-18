#!/usr/bin/env python3
import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

HOST = '194.87.76.109'
USER = 'root'
PASSWORD = 'meBdV,Y7ur1gUs'

def run(ssh, cmd, timeout=300):
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    return out, err

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, username=USER, password=PASSWORD, timeout=30)
print('Connected')

# Push new code
print('\n--- git pull ---')
out, err = run(ssh, 'cd /var/www/restart-app && git pull origin main 2>&1')
print(out or err)

# Install deps (in case jose etc. need refresh)
print('\n--- npm install ---')
out, err = run(ssh, 'cd /var/www/restart-app && npm install 2>&1', timeout=120)
print(out[-2000:] if len(out) > 2000 else out)

# Build
print('\n--- npm run build ---')
out, err = run(ssh, 'cd /var/www/restart-app && npm run build 2>&1', timeout=300)
combined = out + err
print(combined[-3000:] if len(combined) > 3000 else combined)

if 'error' in combined.lower() and 'warn' not in combined.lower().replace('error', ''):
    print('\nBUILD MAY HAVE ERRORS - check output above')

# Restart PM2
print('\n--- pm2 restart ---')
out, err = run(ssh, 'pm2 restart restart-app && pm2 save 2>&1')
print(out or err)

# Status
print('\n--- pm2 status ---')
out, err = run(ssh, 'pm2 status 2>&1')
print(out)

ssh.close()
print('\nDone!')
