Add-Type -AssemblyName System.Drawing

function Process-WeddingPhoto {
    param(
        [string]$src,
        [string]$dst,
        [int]$rotateDeg = 0,
        [int]$maxDim = 1920,
        [long]$quality = 88
    )
    $fullPath = Resolve-Path $src
    $img = [System.Drawing.Image]::FromFile($fullPath)
    if ($rotateDeg -eq 90) {
        $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone)
    } elseif ($rotateDeg -eq 270) {
        $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone)
    }
    
    $w = $img.Width
    $h = $img.Height
    $scale = 1.0
    if ($w -gt $maxDim -or $h -gt $maxDim) {
        if ($w -gt $h) { $scale = $maxDim / $w } else { $scale = $maxDim / $h }
    }
    $tw = [int]($w * $scale)
    $th = [int]($h * $scale)
    
    $bmp = New-Object System.Drawing.Bitmap($tw, $th)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.DrawImage($img, 0, 0, $tw, $th)
    $g.Dispose()
    $img.Dispose()
    
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $quality)
    $bmp.Save($dst, $codec, $encParams)
    $bmp.Dispose()
    Write-Host "Processed $src -> $dst ($tw x $th)"
}

# 1. Hallway Romance (DSC_0569 is upright vertical)
Process-WeddingPhoto -src 'DSC_0569.JPG' -dst 'assets/images/couple_hallway.jpg' -maxDim 1920

# 2. Romantic Dance / Eye Contact (DSC_0516) - was rotated 90 counter-clockwise, rotate 90 clockwise to make upright
Process-WeddingPhoto -src 'DSC_0516.JPG' -dst 'assets/images/couple_dance.jpg' -rotateDeg 90 -maxDim 1920

# 3. Formal Royal Portrait (DSC_0573) - rotate 90 clockwise
Process-WeddingPhoto -src 'DSC_0573.JPG' -dst 'assets/images/couple_regal.jpg' -rotateDeg 90 -maxDim 1920

# 4. Family Blessings (DSC_0399 - grandparents & parents)
Process-WeddingPhoto -src 'DSC_0399.JPG' -dst 'assets/images/family_blessings.jpg' -maxDim 1920

# 5. Family & Brother (DSC_0419)
Process-WeddingPhoto -src 'DSC_0419.JPG' -dst 'assets/images/family_cordial.jpg' -maxDim 1920

# 6. Throne Couple (DSC_0314)
Process-WeddingPhoto -src 'DSC_0314.JPG' -dst 'assets/images/couple_throne.jpg' -maxDim 1920

Write-Host "All real wedding photos successfully processed and optimized!"
