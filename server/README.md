# Raj Caterers – Backend API

Express + MongoDB REST API for Raj Caterers event planning and catering business.

## Setup

```bash
cd server
npm install
cp .env.example .env   # fill in your values
npm run dev
```

## Seed Admin

After first run, hit this endpoint once to create the admin user:

```
POST /api/auth/seed-admin
```

Then remove or protect this route in `auth.routes.js`.

## API Endpoints

| Method | Route                    | Access  | Description              |
|--------|--------------------------|---------|--------------------------|
| POST   | /api/auth/login          | Public  | Admin login              |
| GET    | /api/auth/me             | Private | Get current admin        |
| PUT    | /api/auth/change-password| Private | Change password          |
| POST   | /api/bookings            | Public  | Create booking           |
| GET    | /api/bookings            | Private | Get all bookings         |
| GET    | /api/bookings/stats      | Private | Dashboard stats          |
| GET    | /api/bookings/:id        | Private | Get single booking       |
| PUT    | /api/bookings/:id        | Private | Update booking           |
| DELETE | /api/bookings/:id        | Private | Delete booking           |
| POST   | /api/enquiries           | Public  | Submit enquiry           |
| GET    | /api/enquiries           | Private | Get all enquiries        |
| GET    | /api/enquiries/stats     | Private | Enquiry stats            |
| PUT    | /api/enquiries/:id       | Private | Update enquiry           |
| DELETE | /api/enquiries/:id       | Private | Delete enquiry           |
| GET    | /api/clients             | Private | Get all clients          |
| GET    | /api/clients/:id         | Private | Get client + bookings    |
| PUT    | /api/clients/:id         | Private | Update client            |
| DELETE | /api/clients/:id         | Private | Deactivate client        |
| GET    | /api/gallery             | Public  | Get gallery images       |
| POST   | /api/gallery             | Private | Upload image             |
| PUT    | /api/gallery/:id         | Private | Update gallery item      |
| DELETE | /api/gallery/:id         | Private | Delete image             |
| GET    | /api/menu                | Public  | Get menu items           |
| POST   | /api/menu                | Private | Create menu item         |
| PUT    | /api/menu/:id            | Private | Update menu item         |
| DELETE | /api/menu/:id            | Private | Delete menu item         |
| GET    | /api/reviews             | Public  | Get approved reviews     |
| GET    | /api/reviews/admin       | Private | All reviews (admin)      |
| POST   | /api/reviews             | Private | Create review            |
| PUT    | /api/reviews/:id         | Private | Approve / update review  |
| DELETE | /api/reviews/:id         | Private | Delete review            |
| POST   | /api/contact             | Public  | Submit contact message   |

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (image uploads)
- Nodemailer (email)
- Helmet + Rate Limiting (security)
