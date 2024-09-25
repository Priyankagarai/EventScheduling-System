Event Scheduling System
A full-stack web application for managing user availability and booking events, built using the MERN stack (MongoDB, Express, React, Node.js). This project enables users to set weekly schedules and allows admins to book events without overlapping with unavailable time slots.

***Features***
User Availability Management: Users can set their weekly available and unavailable time slots.
Admin Event Booking: Admins can book events for users, ensuring no overlap with unavailable slots.
Weekly Schedule Display: Both users and admins can view and manage weekly schedules.
Responsive UI: Built using React with Tailwind CSS for a modern and responsive user interface.
RESTful API: A Node.js/Express backend with MongoDB to handle scheduling and meeting data.
TypeScript Support: The project is written in TypeScript, providing type safety throughout.


***Tech Stack***
Frontend: React, TypeScript, Tailwind CSS
Backend: Node.js, Express, MongoDB
Database: MongoDB
Styling: Tailwind CSS


***Installation***
Clone the Repository:

bash
Copy code
git clone https://github.com/your-username/your-repository.git
cd your-repository
Install Dependencies:

For both frontend and backend:

bash
Copy code
# Frontend dependencies
cd client
npm install

# Backend dependencies
cd ../server
npm install
Set Up Environment Variables:

Create a .env file in the root of your server folder and add the necessary environment variables for MongoDB connection

To start both frontend and backend servers:

bash
Copy code
# Frontend (React)
cd client
npm run dev

# Backend (Node.js/Express)
cd ../server
node index.js
Access the App:

Frontend will be running on: http://localhost:3000
Backend will be running on: http://localhost:5000


***Usage***
Set Availability: Users can log in and define their weekly available and unavailable time slots.
Book Events: Admins can view user schedules and book events without conflicting with unavailable time slots.
View Schedule: The weekly schedule will show all available, unavailable, and booked time slots.
API Endpoints
User Endpoints:
POST /api/users: Create a new user.
POST /api/users/login: Log in as an existing user.
GET /api/users/:id/schedule: Get the user's weekly schedule.
Admin Endpoints:
POST /api/admin/meetings: Book a meeting for a user.
GET /api/admin/users: View all users and their schedules.
