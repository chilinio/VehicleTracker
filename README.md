# Auto Extreme - Vehicle Maintenance & Customization Website

![Auto Extreme](https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1000)

## Project Overview

Auto Extreme is a responsive website for a vehicle maintenance and customization business. The platform showcases services, displays a gallery of completed work, features customer testimonials, and provides a client registration system for booking appointments.

## Current Status

The project is functional with the following completed features:

- ✅ Responsive homepage with modern design
- ✅ Services showcase section
- ✅ About section with company information
- ✅ Gallery of completed work with filtering
- ✅ Customer testimonials section
- ✅ Appointment booking system with client registration
- ✅ Newsletter subscription
- ✅ Persistent database storage for contacts and subscribers
- ✅ Fully responsive design for all device sizes

## Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **TanStack Query** - Data fetching and state management
- **Wouter** - Routing

### Backend
- **Express.js** - Node.js web server
- **Drizzle ORM** - Database ORM
- **PostgreSQL** - Database
- **Vite** - Development server and bundler

## Dependencies

```json
"dependencies": {
  "@hookform/resolvers": "^latest",
  "@neondatabase/serverless": "^latest",
  "@radix-ui/react-*": "^latest",
  "@tanstack/react-query": "^latest",
  "class-variance-authority": "^latest",
  "clsx": "^latest",
  "connect-pg-simple": "^latest",
  "date-fns": "^latest",
  "drizzle-kit": "^latest",
  "drizzle-orm": "^latest",
  "drizzle-zod": "^latest",
  "express": "^latest",
  "express-session": "^latest",
  "lucide-react": "^latest",
  "react": "^latest",
  "react-dom": "^latest",
  "react-hook-form": "^latest",
  "react-icons": "^latest",
  "tailwindcss": "^latest",
  "typescript": "^latest",
  "wouter": "^latest",
  "zod": "^latest",
  "zod-validation-error": "^latest"
}
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or newer)
- npm or yarn
- PostgreSQL database (local or remote)

### Clone and Setup
1. Clone the repository:
   ```
   git clone <repository-url>
   cd auto-extreme
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
   ```

4. Initialize the database:
   ```
   npm run db:push
   ```

5. Start the development server:
   ```
   npm run dev
   ```

6. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Project Structure

```
/
├── client/
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions
│   │   ├── pages/           # Page components
│   │   ├── App.tsx          # Main app component
│   │   ├── index.css        # Global CSS
│   │   └── main.tsx         # Entry point
│   └── index.html           # HTML template
├── server/
│   ├── db.ts                # Database configuration
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API routes
│   ├── storage.ts           # Data storage abstraction
│   └── vite.ts              # Vite server configuration
├── shared/
│   └── schema.ts            # Shared data models and schemas
├── drizzle.config.ts        # Drizzle ORM configuration
├── package.json             # Project metadata and dependencies
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

## Database Schema

```typescript
// Users
users {
  id: serial (PK)
  username: text
  password: text
}

// Contacts (Appointment Form)
contacts {
  id: serial (PK)
  name: text
  email: text
  phone: text
  address: text
  city: text
  state: text
  zipCode: text
  service: text
  message: text
  createdAt: text
}

// Newsletter Subscribers
subscribers {
  id: serial (PK)
  email: text
  createdAt: text
}
```

## Roadmap & Future Enhancements

- [ ] User authentication for administrative access
- [ ] Admin dashboard for managing appointments
- [ ] Calendar integration for appointment scheduling
- [ ] Email notifications for appointment confirmations
- [ ] Online payment integration for service deposits
- [ ] Customer portal for tracking service history
- [ ] Integration with social media platforms
- [ ] SEO optimizations for better visibility
- [ ] Analytics to track visitor behavior
- [ ] Vehicle service history tracking
- [ ] Automated email marketing campaigns

## Deployment

The project is configured to be easily deployed to any hosting platform that supports Node.js applications. Recommended platforms include:

- Vercel
- Netlify
- Heroku
- DigitalOcean
- AWS

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or suggestions regarding this project, please contact:
- Email: info@autoextreme.com