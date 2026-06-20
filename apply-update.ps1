# apply-update.ps1 — run this after every zip download
$zip = Get-ChildItem "$env:USERPROFILE\Downloads" -Filter "gateforge-update*.zip" |
       Sort-Object LastWriteTime -Descending |
       Select-Object -First 1

if ($zip) {
    Write-Host "Extracting $($zip.Name) ..."
    Expand-Archive -Path $zip.FullName -DestinationPath . -Force
    Write-Host "✅ Applied. You can now delete it from Downloads if you want."
} else {
    Write-Host "❌ No gateforge-update*.zip found in Downloads."
}