# Script to create a GitHub repository and push code
Write-Host "GitHub Repository Creator" -ForegroundColor Cyan
Write-Host "--------------------" -ForegroundColor Cyan

# Ask for GitHub credentials
Write-Host "Please enter your GitHub username:" -ForegroundColor Green
$username = Read-Host

Write-Host "Please enter a Personal Access Token (create one at https://github.com/settings/tokens):" -ForegroundColor Green
$token = Read-Host -AsSecureString
$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
$plainToken = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)

# Convert credentials to Base64 for Basic Auth
$pair = "$($username):$($plainToken)"
$encodedCreds = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($pair))
$headers = @{
    Authorization = "Basic $encodedCreds"
}

# Create the repository
$body = @{
    name = "VehicleTracker"
    description = "Vehicle Maintenance Website with Admin Dashboard"
    private = $false
    auto_init = $false
} | ConvertTo-Json

Write-Host "Creating repository 'VehicleTracker'..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
    Write-Host "Repository created successfully!" -ForegroundColor Green
    
    # Set the remote URL and push
    Write-Host "Setting up Git remote..." -ForegroundColor Yellow
    git remote set-url origin "https://github.com/$username/VehicleTracker.git"
    
    Write-Host "Pushing code to GitHub..." -ForegroundColor Yellow
    git push -u origin main
    
    Write-Host "Done! Your code is now on GitHub at: https://github.com/$username/VehicleTracker" -ForegroundColor Green
}
catch {
    Write-Host "Error creating repository:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response.StatusCode -eq 422) {
        Write-Host "Repository might already exist. Trying to push anyway..." -ForegroundColor Yellow
        git remote set-url origin "https://github.com/$username/VehicleTracker.git"
        git push -u origin main
    }
} 