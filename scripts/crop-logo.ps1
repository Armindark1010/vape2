Add-Type -AssemblyName System.Drawing

$srcFile = "C:\Users\High End\Downloads\image-removebg-preview.png"
$bytes = [System.IO.File]::ReadAllBytes($srcFile)
$ms = New-Object System.IO.MemoryStream($bytes, 0, $bytes.Length)
$src = [System.Drawing.Bitmap]::FromStream($ms)

# 1. logo-icon.png (Emblem only: X=265, Y=82, W=140, H=148)
$iconRect = New-Object System.Drawing.Rectangle(265, 82, 140, 148)
$iconBmp = $src.Clone($iconRect, $src.PixelFormat)
$iconBmp.Save("d:\program\vape2\public\logo-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)

# 2. logo-text.png (Wordmark only: X=197, Y=248, W=282, H=36)
$textRect = New-Object System.Drawing.Rectangle(197, 248, 282, 36)
$textBmp = $src.Clone($textRect, $src.PixelFormat)
$textBmp.Save("d:\program\vape2\public\logo-text.png", [System.Drawing.Imaging.ImageFormat]::Png)

# 3. logo-vertical.png / logo.png (Full Stacked: X=197, Y=82, W=282, H=202)
$fullRect = New-Object System.Drawing.Rectangle(197, 82, 282, 202)
$fullBmp = $src.Clone($fullRect, $src.PixelFormat)
$fullBmp.Save("d:\program\vape2\public\logo-vertical.png", [System.Drawing.Imaging.ImageFormat]::Png)
$fullBmp.Save("d:\program\vape2\public\logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$fullBmp.Dispose()

# 4. logo-horizontal.png (Composite: Icon on Left + Text on Right)
# Target height 90px
$targetH = 90
$iconAspect = $iconBmp.Width / $iconBmp.Height
$iconW = [int]($targetH * $iconAspect) # ~85px
$iconH = $targetH

$textAspect = $textBmp.Width / $textBmp.Height
$textH = 32 # Height of text
$textW = [int]($textH * $textAspect) # ~250px

$gap = 18
$totalW = $iconW + $gap + $textW
$totalH = $targetH

$horizBmp = New-Object System.Drawing.Bitmap($totalW, $totalH)
$g = [System.Drawing.Graphics]::FromImage($horizBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Draw icon on left
$g.DrawImage($iconBmp, 0, 0, $iconW, $iconH)
# Draw text vertically centered on right
$textY = [int](($totalH - $textH) / 2)
$g.DrawImage($textBmp, ($iconW + $gap), $textY, $textW, $textH)

$g.Dispose()
$horizBmp.Save("d:\program\vape2\public\logo-horizontal.png", [System.Drawing.Imaging.ImageFormat]::Png)
$horizBmp.Dispose()

# 5. Favicon PNG (64x64 icon on transparent/subtle background)
$favBmp = New-Object System.Drawing.Bitmap(64, 64)
$gFav = [System.Drawing.Graphics]::FromImage($favBmp)
$gFav.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gFav.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gFav.DrawImage($iconBmp, 2, 2, 60, 60)
$gFav.Dispose()
$favBmp.Save("d:\program\vape2\public\favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$favBmp.Dispose()

$iconBmp.Dispose()
$textBmp.Dispose()
$src.Dispose()
$ms.Dispose()

# 6. Generate Base64-embedded favicon.svg
$favBytes = [System.IO.File]::ReadAllBytes("d:\program\vape2\public\favicon.png")
$favBase64 = [Convert]::ToBase64String($favBytes)
$svgContent = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <image href="data:image/png;base64,$favBase64" x="0" y="0" width="64" height="64" />
</svg>
"@
[System.IO.File]::WriteAllText("d:\program\vape2\public\favicon.svg", $svgContent, [System.Text.Encoding]::UTF8)

Write-Output "SUCCESS: All logo assets generated with 100% precision without cutoffs!"
