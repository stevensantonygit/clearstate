# PropertySG - Singapore Property Listing Platform

A modern, hyperminimalistic property listing platform built with Next.js, Firebase, and shadcn/ui. Find your dream property in Singapore with ease.

## ✨ Features

- 🏠 **Property Listings** - Browse HDB flats, condominiums, landed properties, and commercial spaces
- 🔍 **Advanced Search** - Smart filtering by location, price, type, bedrooms, and more
- 🌓 **Dark/Light Theme** - Seamless theme switching with system preference detection
- 📱 **Responsive Design** - Optimized for all screen sizes and devices
- 🔐 **Authentication** - Secure login with email/password and Google OAuth
- ❤️ **Favorites** - Save and manage your favorite properties
- 📊 **Property Management** - List, edit, and manage your properties
- 🎨 **Modern UI** - Clean, hyperminimalistic design using shadcn/ui components
- ⚡ **Fast Performance** - Built with Next.js 15 and optimized for speed

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project (for authentication and database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd propertysg
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password and Google providers)
   - Create a Firestore database
   - Set up Firebase Storage
   - Get your Firebase configuration

4. **Configure environment variables**
   Update `.env.local` with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   └── properties/        # Properties listing page
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── auth-dialog.tsx   # Authentication modal
│   ├── navbar.tsx        # Navigation component
│   ├── footer.tsx        # Footer component
│   ├── property-card.tsx # Property listing card
│   └── property-grid.tsx # Properties grid layout
├── contexts/             # React contexts
│   └── auth-context.tsx  # Authentication context
├── lib/                  # Utility libraries
│   ├── firebase.ts       # Firebase configuration
│   └── utils.ts          # Utility functions
└── types/                # TypeScript type definitions
    └── index.ts          # Main type definitions
```

## 🎨 Design System

PropertySG uses a hyperminimalistic design approach with:

- **Color Palette**: Neutral grays with blue accent colors
- **Typography**: Inter font for clean, modern readability
- **Components**: shadcn/ui for consistent, accessible components
- **Spacing**: Consistent spacing scale based on Tailwind CSS
- **Animations**: Subtle transitions and hover effects

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📱 Features Overview

### Home Page
- Hero section with search functionality
- Featured properties showcase
- Property type navigation
- Statistics and value propositions

### Properties Page
- Advanced filtering and search
- Sortable property listings
- Mobile-responsive filters
- Pagination support

### Authentication
- Email/password registration and login
- Google OAuth integration
- Protected routes and user sessions
- User profile management

---

**PropertySG** - Find Your Dream Property in Singapore 🇸🇬
