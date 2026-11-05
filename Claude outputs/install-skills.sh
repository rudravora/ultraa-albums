#!/usr/bin/env bash
# Installs the seven design skills into Claude Code's user skills folder.
# Usage: bash install-skills.sh            (installs into ~/.claude/skills)
#        bash install-skills.sh <folder>   (installs into <folder>, e.g. ./.claude/skills for one project)
# Needs: git and network access to github.com. Existing skill folders are never overwritten.
set -euo pipefail
export GIT_LFS_SKIP_SMUDGE=1

DEST="${1:-$HOME/.claude/skills}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$DEST"

install_skill() {
  local repo="$1" sub="$2" name="$3"
  local dir="$TMP/${repo//\//__}"
  if [ -e "$DEST/$name" ]; then
    echo "skip   $name (already in $DEST)"
    return
  fi
  [ -d "$dir" ] || git clone --depth 1 --quiet "https://github.com/$repo" "$dir"
  [ -f "$dir/$sub/SKILL.md" ] || { echo "ERROR: $repo/$sub has no SKILL.md"; exit 1; }
  cp -R "$dir/$sub" "$DEST/$name"
  echo "added  $name  (from $repo)"
}

install_skill leonxlnx/taste-skill            skills/taste-skill            taste-skill
install_skill nutlope/hallmark                skills/hallmark               hallmark
install_skill pbakaus/impeccable              .claude/skills/impeccable     impeccable
install_skill emilkowalski/skills             skills/apple-design           apple-design
install_skill jakubkrehel/skills              skills/better-typography      better-typography
install_skill lottiefiles/motion-design-skill skills/motion-design          motion-design
install_skill keysjoao/laws-of-ux-skills      laws-of-ux                    laws-of-ux
install_skill keysjoao/laws-of-ux-skills      laws-of-ux-checklist          laws-of-ux-checklist
install_skill keysjoao/laws-of-ux-skills      laws-of-ux-review             laws-of-ux-review

echo
echo "Done. Skills are in: $DEST"
echo "Restart Claude Code, then type /skills (or ask it to list its skills) to confirm all nine load."
