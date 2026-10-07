#!/bin/sh
height=300
width=300

for i in misc/text_type/*.stl; do
  T=$i.tmp
  b=`basename $i`
  echo import\(\"$b\"\)\; >$T
  openscad --colorscheme="DeepOcean" -o "public/img/type_${b%.*}.png" --imgsize=$width,$height $T 
  rm $T
done
