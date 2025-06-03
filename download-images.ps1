$images = @{
    "interior-detailing.jpg" = "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg"
    "wheel-tire.jpg" = "https://images.unsplash.com/photo-1511918984145-48de785d4c4e?auto=format&fit=crop&w=800&q=80"
}

$outputDir = "site-with-fixed-images/images"

# Create output directory if it doesn't exist
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force
}

foreach ($image in $images.GetEnumerator()) {
    $outputPath = Join-Path $outputDir $image.Key
    Write-Host "Downloading $($image.Key)..."
    try {
        Invoke-WebRequest -Uri $image.Value -OutFile $outputPath
        Write-Host "Downloaded successfully to $outputPath"
    } catch {
        Write-Host "Error downloading $($image.Key): $_"
    }
} 