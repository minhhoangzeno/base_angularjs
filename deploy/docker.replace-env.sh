#!/bin/sh

# Substitutes environment variables
#
# 1. Get a list of files need to process in target folder
# 2. Get a list of environment variables that name start with "SIMCEL_"
# 3. Loop through the files and replace all placeholders with its corresponding value
#    (placeholders are defined in `src/environments/environment.ci.ts`)

TARGET_FOLDER=/usr/share/nginx/html
TARGET_FILES=$(find $TARGET_FOLDER -iname '*.js' -or -iname '*.html' -or -iname '*.htm')
TARGET_VARS=$(printenv | awk -F= '/^SIMCEL_/ {print $1}')

RED="\x1B[0;31m"
GREEN="\x1B[0;32m"
YELLOW="\x1B[0;33m"
RESET="\x1B[0m"

for V in $TARGET_VARS; do
  echo -e "==> Replacing environment ${RED}$V${RESET} with ${GREEN}$(printenv $V)${RESET}"
done
for F in $TARGET_FILES; do
  echo -e "> Processing ${YELLOW}${F}${RESET}"
  envsubst "$(printf '${%s} ' $TARGET_VARS)" <"$F" >"$F.tmp"
  mv "$F.tmp" "$F"
done
