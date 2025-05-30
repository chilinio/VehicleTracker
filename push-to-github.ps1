Write-Host "GitHub Repository Creation and Push Script" -ForegroundColor Blue
Write-Host "----------------------------------------" -ForegroundColor Blue
Write-Host ""

Write-Host "Step 1: Go to https://github.com/new and create a new repository" -ForegroundColor Green
Write-Host "- Repository name: VehicleTracker" -ForegroundColor Green
Write-Host "- Do NOT initialize with README, .gitignore, or license" -ForegroundColor Green
Write-Host ""
Write-Host "After creating the repository, enter your GitHub username:" -ForegroundColor Green
$username = Read-Host

# Update PATH to include Git
$env:PATH += ";C:\Program Files\Git\bin"

# Add the remote origin
git remote add origin "https://github.com/$username/VehicleTracker.git"
Write-Host "Remote added: https://github.com/$username/VehicleTracker.git" -ForegroundColor Cyan

# Push to GitHub
Write-Host "Pushing code to GitHub..." -ForegroundColor Green
git push -u origin main

Write-Host ""
Write-Host "Process completed! Check your GitHub repository." -ForegroundColor Green
