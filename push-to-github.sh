#!/bin/bash
# nemonote를 새 GitHub 저장소에 올리는 스크립트
# 사용법: 먼저 GitHub에서 빈 저장소(nemonote)를 만든 뒤,
#         아래 YOUR_USERNAME을 본인 GitHub 아이디로 바꾸고 실행하세요.

cd "$(dirname "$0")"

# GitHub 사용자명과 저장소 이름 (필요시 수정)
GITHUB_USER="YOUR_USERNAME"
REPO_NAME="nemonote"

echo "=== 1. Git 저장소 초기화 ==="
git init

echo ""
echo "=== 2. 모든 파일 스테이징 ==="
git add .

echo ""
echo "=== 3. 첫 커밋 ==="
git commit -m "Initial commit: nemonote project"

echo ""
echo "=== 4. 기본 브랜치 이름 설정 (main) ==="
git branch -M main

echo ""
echo "=== 5. 원격 저장소 연결 및 푸시 ==="
echo "원격 URL: https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
git remote add origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
git push -u origin main

echo ""
echo "완료!"
