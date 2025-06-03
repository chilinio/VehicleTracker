@echo off
ECHO "Fixing 'This site can't be reached' issue..."
ECHO "========================================"

ECHO "Step 1: Checking if Node.js is installed..."
WHERE node
IF %ERRORLEVEL% NEQ 0 (
  ECHO "Node.js is not found. Please complete the Node.js installation."
  ECHO "Running the Node.js installer now..."
  start node-installer.msi
  ECHO "After installation completes, please run this script again."
  PAUSE
  EXIT
)

ECHO "Step 2: Starting the server..."
cd C:\Users\Amechi\Documents\VehicleTracker
node simple-server.js

ECHO "Server is running on http://localhost:3001"
ECHO "Please open this URL in your browser." 