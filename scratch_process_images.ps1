Add-Type -AssemblyName System.Drawing

$inputPath = Resolve-Path "DSC_0314.JPG"
$img = [System.Drawing.Image]::FromFile($inputPath)

Write-Host "Original Image Dimensions: $($img.Width) x $($img.Height)"

# Helper function to save cropped/resized jpeg
function Save-ResizedImage {
    param(
        [System.Drawing.Image]$source,
        [int]$cropX, [int]$cropY, [int]$cropW, [int]$cropH,
        [int]$targetW, [int]$targetH,
        [string]$outputPath,
        [long]$quality = 85
    )

    $targetBmp = New-Object System.Drawing.Bitmap($targetW, $targetH)
    $g = [System.Drawing.Graphics]::FromImage($targetBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $destRect = New-Object System.Drawing.Rectangle(0, 0, $targetW, $targetH)
    $srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)

    $g.DrawImage($source, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    # Save as JPEG with specific quality
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $quality)

    $targetBmp.Save($outputPath, $codec, $encoderParams)
    $targetBmp.Dispose()
    Write-Host "Saved: $outputPath"
}

# 1. Full Optimized (1920 wide)
$scale = 1920 / $img.Width
$h1 = [int]($img.Height * $scale)
Save-ResizedImage -source $img -cropX 0 -cropY 0 -cropW $img.Width -cropH $img.Height -targetW 1920 -targetH $h1 -outputPath "assets/images/couple_optimized.jpg"

# 2. Closeup on Couple (focus on their smiling faces & floral arch)
# Image is 6000 x 4000. Faces are around center (X ~ 1800 to 4200, Y ~ 700 to 3000)
Save-ResizedImage -source $img -cropX 1500 -cropY 600 -cropW 3000 -cropH 2400 -targetW 1400 -targetH 1120 -outputPath "assets/images/couple_closeup.jpg"

# 3. Portrait Crop (Vertical 3:4 for mobile cards and arches)
Save-ResizedImage -source $img -cropX 1400 -cropY 500 -cropW 2800 -cropH 3500 -targetW 1080 -targetH 1350 -outputPath "assets/images/couple_portrait.jpg"

# 4. Ring / Mehendi Hands Detail Crop
Save-ResizedImage -source $img -cropX 2400 -cropY 2200 -cropW 2000 -cropH 1600 -targetW 1000 -targetH 800 -outputPath "assets/images/couple_detail.jpg"

$img.Dispose()
Write-Host "All crops and optimizations generated successfully!"
