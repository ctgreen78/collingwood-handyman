# Builds public/media/home-hero.mp4: a slow zoom slideshow of site images with crossfades.
# 1280x800 (matches the 16:10 hero frame), 30 fps, no audio, loops cleanly back to the first image.
# The first frame is the same cottage deck photo the hero already shows, so the poster and video line up.
# Run from the project folder:  powershell -File scripts\make-hero-video.ps1
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$a = Join-Path $root 'src\assets'
$clips = @(
  "$a\cottage-deck-hero.jpg",
  "$a\services\kitchen-remodel.jpg",
  "$a\services\fence-repair.jpg",
  "$a\services\bathroom-renovation.jpg",
  "$a\services\new-deck-builds.jpg",
  "$a\services\basement-renovation.jpg"
)
$len = 3.2; $fade = 0.7; $fps = 30; $frames = [int]($len * $fps)
$inputs = @(); foreach ($c in $clips) { $inputs += '-i'; $inputs += $c }
$inputs += '-i'; $inputs += $clips[0]   # short static end card = first image, for a seamless loop

$prep = 'scale=1280:800:force_original_aspect_ratio=increase,crop=1280:800,scale=5120:3200'
$f = @()
for ($i = 0; $i -lt $clips.Count; $i++) {
  # Even clips zoom in, odd clips zoom out. Clip 0 starts at zoom 1.0 to match the poster.
  $z = if ($i % 2 -eq 0) { "1+0.08*on/$frames" } else { "1.08-0.08*on/$frames" }
  $f += "[$($i)]$prep,zoompan=z='$z':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=$($frames):s=1280x800:fps=$fps,format=yuv420p,setsar=1[v$i]"
}
$last = $clips.Count
$f += "[$($last)]$prep,zoompan=z='1':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=30:s=1280x800:fps=$fps,format=yuv420p,setsar=1[v$last]"

$prev = 'v0'; $t = $len
for ($i = 1; $i -le $last; $i++) {
  $off = [math]::Round($t - $fade, 3)
  $out = "x$i"
  $f += "[$prev][v$i]xfade=transition=fade:duration=$($fade):offset=$off[$out]"
  $clipLen = if ($i -eq $last) { 1.0 } else { $len }
  $t = $t + $clipLen - $fade
  $prev = $out
}
$graph = $f -join ';'
$dest = Join-Path $root 'public\media\home-hero.mp4'
& ffmpeg -v error -y @inputs -filter_complex $graph -map "[$prev]" -an -c:v libx264 -preset slow -crf 30 -profile:v high -pix_fmt yuv420p -movflags +faststart $dest
if ($LASTEXITCODE -ne 0) { throw 'ffmpeg failed' }
"Wrote $dest  ($([math]::Round((Get-Item $dest).Length/1MB,2)) MB, $([math]::Round($t,1)) s)"
