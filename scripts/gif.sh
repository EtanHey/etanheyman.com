#!/bin/bash
# Usage: gif.sh <evidenceDir>
set -u
EV="$1"; P="$EV/proof"; B="$EV/before-prod"; A="$EV/after-fixture"
F=/System/Library/Fonts/Supplemental/Arial.ttf
mb=$(node -e 'const r=require(process.argv[1]);console.log(r.find(x=>x.swipe).swipe.map(s=>s.vvLeft).join(" "))' "$B/measurements-before-prod.json")
ma=$(node -e 'const r=require(process.argv[1]);console.log(r.find(x=>x.variant==="head"&&x.swipe).swipe.map(s=>s.vvLeft).join(" "))' "$A/measurements-after-fixture.json")
read -r -a bvv <<< "$mb"; read -r -a avv <<< "$ma"
frames=()
for i in 0 1 2 3 4 5 6 7; do
  magick "$B/before-prod-390-swipe-$i.png" -resize 390x -gravity north -background '#222' -splice 0x56 -font $F -pointsize 15 -fill white -annotate +0+6 "BEFORE production
swipe $i  sideways drift ${bvv[$i]}px" "$P/work-b$i.png"
  magick "$A/head-390-swipe-$i.png" -resize 390x -gravity north -background '#222' -splice 0x56 -font $F -pointsize 15 -fill white -annotate +0+6 "AFTER fixture head
swipe $i  sideways drift ${avv[$i]}px" "$P/work-a$i.png"
  magick "$P/work-b$i.png" "$P/work-a$i.png" -background '#222' -splice 8x0 +append "$P/work-f$i.png"
  frames+=("$P/work-f$i.png")
done
magick -delay 60 -loop 0 "${frames[@]}" "$P/swipe-390-before-after.gif"
rm -f "$P"/work-*.png
