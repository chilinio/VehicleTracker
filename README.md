# Blackdot Autos - Vehicle Maintenance Website

A comprehensive automotive service management platform for Blackdot Autos, providing seamless online booking, client registration, and vehicle maintenance tracking.

![Blackdot Autos](./generated-icon.png)

## Features

- **Home Page**: Showcases services, gallery, testimonials, and contact information
- **Appointment Booking**: Dedicated booking page with comprehensive client registration
- **Client Registration**: Captures full client details including name, address, phone, and email
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Service Catalog**: Detailed information about available maintenance services
- **Testimonials**: Customer reviews with manual navigation controls
- **Contact Form**: Easy way for clients to send inquiries

## Technology Stack

- **Frontend**:
  - React.js with TypeScript
  - Tailwind CSS for styling
  - ShadCN UI components
  - React Hook Form for form handling
  - Zod for validation

- **Backend**:
  - Express.js server
  - PostgreSQL database
  - Drizzle ORM for database operations
  - API endpoints for client data submission

- **Other Tools**:
  - TanStack React Query for data fetching
  - Wouter for routing

## Setup Instructions

### Prerequisites

- Node.js (v16 or newer)
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/blackdot-autos.git
cd blackdot-autos
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=postgresql://username:password@localhost:5432/blackdot
```

4. Set up the database
```bash
npm run db:push
```

5. Start the development server
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5000`

## Database Schema

The application uses the following database tables:

- **users**: Store user authentication information
- **contacts**: Store client inquiries and contact form submissions
- **subscribers**: Store newsletter subscribers
- **appointments** (future implementation): Store appointment bookings

## Project Structure

```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Helper functions and utilities
│   │   ├── pages/        # Page components
│   │   └── App.tsx       # Main application component
├── server/               # Backend Express server
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Database access layer
│   └── db.ts             # Database connection
├── shared/               # Shared code between frontend and backend
│   └── schema.ts         # Database schema and types
└── README.md             # Project documentation
```

## Future Roadmap

- **Online Payment Integration**: Add ability to accept payments for services
- **Service History**: Track vehicle maintenance history for returning clients
- **Admin Dashboard**: Interface for managing appointments and client data
- **SMS Notifications**: Send appointment reminders via SMS
- **Vehicle Information Storage**: Save details about client vehicles

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@blackdotautos.com or visit our website at https://blackdotautos.com.