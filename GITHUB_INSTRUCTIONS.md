# GitHub Repository Setup Instructions

Follow these steps to create a GitHub repository and push your code:

## Step 1: Create a GitHub Repository
1. Go to https://github.com/new
2. Name your repository: `VehicleTracker`
3. Make sure you DO NOT initialize with README, .gitignore, or license
4. Click "Create repository"

## Step 2: Push Your Code
After creating the repository, GitHub will show commands to push an existing repository.

Run these commands in your terminal, replacing `USERNAME` with your GitHub username:

```
git remote remove origin
git remote add origin https://github.com/USERNAME/VehicleTracker.git
git branch -M main
git push -u origin main
```

## Step 3: Verify
1. Refresh your GitHub repository page
2. You should see all your code and the README we created

If you're prompted for credentials, enter your GitHub username and password (or personal access token if you have 2FA enabled). 