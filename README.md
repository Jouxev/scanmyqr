# QRHub - Modern QR Code Platform

A comprehensive, production-ready QR code management platform built with Next.js 15, TypeScript, and modern web technologies.

## Features

- **QR Code Generator**: Create QR codes for URLs, text, emails, phone numbers, WiFi, vCards, and more
- **QR Scanner**: Scan QR codes using camera or upload images
- **Dynamic QR Codes**: Update QR code content without reprinting
- **Customization**: Customize colors, logos, frames, and styles
- **Analytics**: Track scans, locations, devices, and user behavior
- **Digital Business Cards**: Create and share professional digital business cards
- **Restaurant Menus**: Create beautiful digital menus with QR codes
- **Multiple Export Formats**: Download in PNG, SVG, or PDF
- **User Authentication**: Google OAuth and email/password authentication
- **Subscription System**: Free and Pro plans with Stripe integration
- **Responsive Design**: Mobile-first, works on all devices
- **Dark/Light Mode**: Beautiful theme support

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **State Management**: Zustand, TanStack Query
- **Forms**: React Hook Form, Zod
- **Animations**: Framer Motion
- **Payments**: Stripe
- **File Storage**: Cloudinary / UploadThing
- **QR Generation**: qrcode library
- **QR Scanning**: html5-qrcode

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd qrhub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL and other settings
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
qrhub/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── dashboard/        # Dashboard pages
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   └── page.tsx          # Landing page
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Layout components
│   └── features/        # Feature-specific components
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
├── types/                # TypeScript types
├── prisma/              # Database schema
└── public/              # Static assets
```

## Development Phases

### Phase 1 - Foundation ✅
- Project initialization
- Database schema
- Authentication system
- Landing page

### Phase 2 - Core Features ✅
- QR code generator
- QR scanner
- QR management

### Phase 3 - Advanced Features
- Dynamic QR codes
- Analytics
- Folders

### Phase 4 - Business Cards
- Digital business cards
- Templates
- Public pages

### Phase 5 - Restaurant Menus
- Menu management
- Templates
- QR integration

### Phase 6 - Payments
- Stripe integration
- Subscription management
- Permissions

### Phase 7 - Admin & Polish
- Admin dashboard
- Testing
- Deployment

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### QR Codes
- `GET /api/qr-codes` - List QR codes
- `POST /api/qr-codes` - Create QR code
- `GET /api/qr-codes/[id]` - Get QR code
- `PUT /api/qr-codes/[id]` - Update QR code
- `DELETE /api/qr-codes/[id]` - Delete QR code

## Environment Variables

See `.env.example` for all required environment variables.

## Deployment

This application is designed to be deployed on:
- **Vercel** - Frontend and serverless functions
- **Neon** - PostgreSQL database
- **Stripe** - Payments
- **Cloudinary** - Image storage

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support, email support@qrhub.app or join our Discord community.

## Roadmap

- [ ] Bulk QR code generation
- [ ] Team workspaces
- [ ] Custom branded short URLs
- [ ] Password-protected QR codes
- [ ] Apple Wallet / Google Wallet integration
- [ ] PWA support
- [ ] Template marketplace
- [ ] Multi-language support
- [ ] Advanced analytics with AI insights

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- All our contributors and users
