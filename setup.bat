@echo off
echo Setting up Blackdot Autos project...

echo Creating .env file...
echo DATABASE_URL=postgresql://postgres:postgres@localhost:5432/blackdot > .env

echo Installing client dependencies...
cd client
call npm install

echo Installing server dependencies...
cd ../server
call npm install

echo Setting up database...
cd ..
call npm run db:push

echo Setup complete! You can now run the development server with:
echo npm run dev 