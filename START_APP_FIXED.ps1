$env:NODE_OPTIONS = "--no-experimental-sea"
Write-Host "Starting AI Closet App with Windows fix..." -ForegroundColor Cyan
Write-Host ""
Set-Location $PSScriptRoot
npx expo start --clear

