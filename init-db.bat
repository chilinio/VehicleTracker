@echo off
SET PATH=%PATH%;C:\Program Files\nodejs\
SET PATH=%PATH%;C:\Program Files\PostgreSQL\16\bin\
cd C:\Users\Amechi\Documents\VehicleTracker

echo Setting PGPASSWORD environment variable...
SET PGPASSWORD=postgres

echo Creating database...
psql -U postgres -c "CREATE DATABASE blackdot;" 2>nul

echo Setting up database schema...
npm run db:push

echo Clearing PGPASSWORD environment variable...
SET PGPASSWORD= 