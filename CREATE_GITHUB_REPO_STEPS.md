# Steps to Create a GitHub Repository

1. **Go to GitHub**: Open your web browser and navigate to https://github.com/
2. **Login**: Log in to your GitHub account
3. **Create Repository**: Click the "+" icon in the upper right corner, then select "New repository"
   
4. **Fill Repository Information**:
   - Owner: Select your username or organization
   - Repository name: VehicleTracker
   - Description (optional): Vehicle Maintenance Website with Admin Dashboard
   - Make it Public or Private as preferred
   - DO NOT check "Initialize this repository with a README"
   - DO NOT add .gitignore or license
   
5. **Create Repository**: Click the green "Create repository" button

After creating the repository, GitHub will show a page with setup instructions. Return to the terminal and run the commands shown in GITHUB_INSTRUCTIONS.md to push your local repository to GitHub.

## Note About Authentication

GitHub no longer accepts password authentication through the command line. Use one of these authentication methods:

1. **Personal Access Token (PAT)**:
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Generate new token
   - Give it a name, select the "repo" scope, and click "Generate token"
   - Copy the token and use it as your password when prompted

2. **SSH Authentication**:
   - Set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
   - Use the SSH URL when adding the remote: `git remote add origin git@github.com:USERNAME/VehicleTracker.git`

Once the repository exists on GitHub, you can run the push commands. 