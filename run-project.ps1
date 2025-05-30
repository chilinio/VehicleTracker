# Set environment variables
$env:PATH += ";C:\Program Files\nodejs\"
$env:PATH += ";C:\Program Files\PostgreSQL\16\bin\"
$env:NODE_ENV = "production"
$env:DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/blackdot"
$env:PORT = "3000"

# Write .env file
Set-Content -Path ".env" -Value "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/blackdot`nPORT=3000" -NoNewline

# Set PostgreSQL password for commands
$env:PGPASSWORD = "postgres"

# Create database if it doesn't exist
Write-Host "Creating database (if it doesn't exist)..."
psql -U postgres -c "CREATE DATABASE blackdot;" 2>$null

# Run database migrations
Write-Host "Setting up database schema..."
& "C:\Program Files\nodejs\npm.cmd" run db:push

# Build the client
Write-Host "Building the client..."
& "C:\Program Files\nodejs\npm.cmd" run build

# Start production server
Write-Host "Starting production server..."
& "C:\Program Files\nodejs\npm.cmd" run start 