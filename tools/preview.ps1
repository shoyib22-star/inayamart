# Minimal static file server for previewing Waggle locally.
#   powershell -NoProfile -ExecutionPolicy Bypass -File tools/preview.ps1 -Port 5178
# Then open http://127.0.0.1:5178/
# Uses a TCP listener (no admin rights, no dependencies). Stops with Ctrl+C.

param([int]$Port = 5178)

$ErrorActionPreference = 'Stop'
$root = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$mime = @{
  '.html'  = 'text/html; charset=utf-8'
  '.css'   = 'text/css; charset=utf-8'
  '.js'    = 'text/javascript; charset=utf-8'
  '.json'  = 'application/json; charset=utf-8'
  '.svg'   = 'image/svg+xml'
  '.png'   = 'image/png'
  '.jpg'   = 'image/jpeg'
  '.jpeg'  = 'image/jpeg'
  '.webp'  = 'image/webp'
  '.ico'   = 'image/x-icon'
  '.woff2' = 'font/woff2'
  '.woff'  = 'font/woff'
  '.txt'   = 'text/plain; charset=utf-8'
}

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
$listener.Start()
Set-Content -Path (Join-Path $root '.preview.pid') -Value $PID -Encoding ascii
Write-Output "Waggle preview: http://127.0.0.1:$Port/  (root: $root, pid: $PID)"

function Send-Response($stream, [string]$status, [string]$type, [byte[]]$bytes) {
  $head = "HTTP/1.1 $status`r`nContent-Type: $type`r`nContent-Length: $($bytes.Length)`r`nCache-Control: no-store`r`nConnection: close`r`n`r`n"
  $headBytes = [System.Text.Encoding]::ASCII.GetBytes($head)
  $stream.Write($headBytes, 0, $headBytes.Length)
  $stream.Write($bytes, 0, $bytes.Length)
  $stream.Flush()
}

while ($true) {
  $client = $listener.AcceptTcpClient()
  try {
    $stream = $client.GetStream()
    $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::ASCII, $false, 8192, $true)
    $requestLine = $reader.ReadLine()
    if ([string]::IsNullOrWhiteSpace($requestLine)) { continue }

    while ($true) {
      $line = $reader.ReadLine()
      if ($null -eq $line -or $line -eq '') { break }
    }

    $target = ($requestLine.Split(' '))[1]
    $pathOnly = ($target -split '\?')[0]
    $decoded = [System.Uri]::UnescapeDataString($pathOnly)
    if ($decoded -eq '/') { $decoded = '/index.html' }

    # The deployed Worker handles these; locally there is no Stripe key, so
    # answer the same way it does before one is configured.
    if ($decoded.StartsWith('/api/')) {
      $apiStatus = '503 Service Unavailable'
      $apiBody = '{"error":"Card payments run on the deployed Worker. See the README."}'
      if ($decoded -eq '/api/status') {
        $apiStatus = '200 OK'
        $apiBody = '{"payments":false}'
      }
      Send-Response $stream $apiStatus 'application/json; charset=utf-8' ([System.Text.Encoding]::UTF8.GetBytes($apiBody))
      continue
    }

    $relative = $decoded.TrimStart('/') -replace '/', [System.IO.Path]::DirectorySeparatorChar
    $full = [System.IO.Path]::GetFullPath((Join-Path $root $relative))

    if (-not $full.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
      Send-Response $stream '403 Forbidden' 'text/plain; charset=utf-8' ([System.Text.Encoding]::UTF8.GetBytes('Forbidden'))
    }
    elseif (-not (Test-Path -LiteralPath $full -PathType Leaf)) {
      Send-Response $stream '404 Not Found' 'text/plain; charset=utf-8' ([System.Text.Encoding]::UTF8.GetBytes('Not found'))
    }
    else {
      $bytes = [System.IO.File]::ReadAllBytes($full)
      $ext = [System.IO.Path]::GetExtension($full).ToLowerInvariant()
      $type = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
      Send-Response $stream '200 OK' $type $bytes
    }
  }
  catch {
    Write-Output "request failed: $($_.Exception.Message)"
  }
  finally {
    if ($client) { $client.Close() }
  }
}
