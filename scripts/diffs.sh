#!/bin/bash
# Usage: diffs.sh <evidenceDir>
set -u
EV="$1"; P="$EV/proof"; A="$EV/after-fixture"; B="$EV/before-prod"
mkdir -p "$P"
F=/System/Library/Fonts/Supplemental/Arial.ttf
# AE at exact match, plus counts above 1% / 2% / 5% channel tolerance and PSNR.
stats() { local r=""; for fz in 1% 2% 5%; do r="$r fuzz$fz=$(magick compare -fuzz $fz -metric AE "$1" "$2" null: 2>&1 | cut -d' ' -f1)"; done; echo "$r PSNR=$(magick compare -metric PSNR "$1" "$2" null: 2>&1 | cut -d' ' -f1)"; }
label() { magick "$1" -gravity north -background '#222' -splice 0x40 -font $F -pointsize 28 -fill white -annotate +0+5 "$2" "$3"; }
for w in 1440 1280 390; do
  for s in top grid full; do
    # Crop the wider "before" captures to the after width (the extra strip is the overflow itself).
    g=$(magick identify -format '%wx%h' "$A/head-$w-$s.png")
    magick "$A/insitu-base-$w-$s.png" -crop "$g+0+0" +repage "$P/work-ib.png"
    magick "$B/before-prod-$w-$s.png" -crop "$g+0+0" +repage "$P/work-bp.png"
    n=$(magick compare -metric AE "$P/work-ib.png" "$A/head-$w-$s.png" "$P/insitu-diff-$w-$s.png" 2>&1)
    echo "insitu A/B (same build, clip toggled, base cropped to $g) $w $s differing_pixels=$n$(stats "$P/work-ib.png" "$A/head-$w-$s.png")"
    n2=$(magick compare -metric AE "$P/work-bp.png" "$A/head-$w-$s.png" "$P/prod-vs-after-diff-$w-$s.png" 2>&1)
    echo "production before vs fixture after (cropped to $g) $w $s differing_pixels=$n2$(stats "$P/work-bp.png" "$A/head-$w-$s.png")"
    if [ "$s" != full ]; then
      label "$B/before-prod-$w-$s.png" "BEFORE production ($w)" $P/work-a.png
      label "$A/head-$w-$s.png" "AFTER fixture head ($w)" $P/work-b.png
      label "$P/prod-vs-after-diff-$w-$s.png" "pixel diff" $P/work-c.png
      magick $P/work-a.png $P/work-b.png $P/work-c.png -background '#222' +append "$P/sbs-$w-$s.png"
    fi
  done
done
rm -f $P/work-*.png
