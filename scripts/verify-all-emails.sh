#!/bin/bash
# 개발 환경 전용: 미인증 사용자 전체 이메일 인증 처리
# 사용법: ./scripts/verify-all-emails.sh

set -e

# .env.local에서 DATABASE_URL 파싱
ENV_FILE="$(dirname "$0")/../.env.local"
if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: .env.local 파일을 찾을 수 없습니다."
  exit 1
fi

DB_URL=$(grep '^DATABASE_URL=' "$ENV_FILE" | cut -d'=' -f2-)
if [ -z "$DB_URL" ]; then
  echo "ERROR: DATABASE_URL이 .env.local에 설정되지 않았습니다."
  exit 1
fi

# 미인증 사용자 수 확인
COUNT=$(psql "$DB_URL" -t -A -c "SELECT COUNT(*) FROM users WHERE email_verified = false;" 2>/dev/null)

if [ "$COUNT" = "0" ]; then
  echo "인증 대기 중인 사용자가 없습니다."
  exit 0
fi

# 전체 인증 처리
psql "$DB_URL" -c "
  UPDATE users SET email_verified = true WHERE email_verified = false;
"

echo "완료: ${COUNT}명의 이메일 인증을 처리했습니다."

# 인증된 사용자 목록 출력
psql "$DB_URL" -c "SELECT email, name FROM users WHERE email_verified = true ORDER BY created_at DESC LIMIT 10;"
