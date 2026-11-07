# Builds dist/ for Freebuff Sites: the static shop in dist/public plus the
# checkout Worker beside it, and the deploy manifest Sites expects.
#   powershell -NoProfile -ExecutionPolicy Bypass -File tools/pack.ps1

param([string]$Out = 'dist')

$ErrorActionPreference = 'Stop'
$root = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$dist = Join-Path $root $Out
$public = Join-Path $dist 'public'

if (Test-Path $dist) { Remove-Item $dist -Recurse -Force }
New-Item -ItemType Directory -Path $public -Force | Out-Null

foreach ($item in @('index.html', 'css', 'js', 'assets')) {
  Copy-Item (Join-Path $root $item) (Join-Path $public $item) -Recurse -Force
}

Copy-Item (Join-Path $root 'server\worker.js') (Join-Path $dist 'worker.js') -Force
Copy-Item (Join-Path $root 'server\prices.js') (Join-Path $dist 'prices.js') -Force

$manifest = @'
{
  "entrypoint": "worker.js",
  "compatibilityDate": "2026-06-01",
  "modules": [
    { "name": "worker.js", "type": "esm", "path": "./worker.js" },
    { "name": "prices.js", "type": "esm", "path": "./prices.js" }
  ],
  "assetsDirectory": "./public"
}
'@

# UTF-8 without BOM: some JSON parsers reject a byte-order mark.
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText((Join-Path $dist 'sites.json'), $manifest, $utf8NoBom)

Write-Output "Packed $dist"
Write-Output "  public/  $(($(Get-ChildItem $public -Recurse -File).Count)) files"
Write-Output "  worker.js, prices.js, sites.json"
