#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "Usage: tools/transcode-hls.sh input.mp4 output-dir"
  exit 1
fi

input="$1"
output_dir="$2"

mkdir -p "$output_dir"/{720p,480p,360p}

ffmpeg -y -i "$input" \
  -filter_complex \
  "[0:v]split=3[v720][v480][v360];[v720]scale=w=1280:h=-2[v720out];[v480]scale=w=854:h=-2[v480out];[v360]scale=w=640:h=-2[v360out]" \
  -map "[v720out]" -map 0:a:0 -c:v:0 libx264 -preset medium -crf 23 -maxrate:v:0 2800k -bufsize:v:0 5600k -c:a:0 aac -b:a:0 128k \
  -map "[v480out]" -map 0:a:0 -c:v:1 libx264 -preset medium -crf 24 -maxrate:v:1 1400k -bufsize:v:1 2800k -c:a:1 aac -b:a:1 96k \
  -map "[v360out]" -map 0:a:0 -c:v:2 libx264 -preset medium -crf 25 -maxrate:v:2 800k -bufsize:v:2 1600k -c:a:2 aac -b:a:2 96k \
  -f hls \
  -hls_time 6 \
  -hls_playlist_type vod \
  -hls_flags independent_segments \
  -hls_segment_type fmp4 \
  -master_pl_name master.m3u8 \
  -var_stream_map "v:0,a:0,name:720p v:1,a:1,name:480p v:2,a:2,name:360p" \
  -hls_segment_filename "$output_dir/%v/seg_%05d.m4s" \
  "$output_dir/%v/index.m3u8"

echo "HLS output ready: $output_dir/master.m3u8"
