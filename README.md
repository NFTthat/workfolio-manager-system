# 🎨 Portfolio Management System

A modern, full-stack portfolio management system built with Next.js 15, featuring a responsive public portfolio website and an admin dashboard for content management.

## ✨ Features

### 🌐 Public Portfolio Website
- **Responsive Design**: Mobile-first design that works seamlessly on all devices
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Dark/Light Mode**: Theme switching support with next-themes
- **Smooth Animations**: Framer Motion for engaging user interactions
- **Portfolio Sections**: Hero, About, Experience, Skills, Projects, and Contact
- **Optimized Performance**: Next.js 15 with App Router for optimal loading

### 🛠️ Admin Dashboard
- **Authentication**: Secure admin login with NextAuth.js
- **Content Management**: Full CRUD operations for all portfolio sections
- **Drag & Drop**: Reorder experiences and projects with DnD Kit
- **Rich Text Editor**: MDX Editor for content creation
- **Image Upload**: Built-in image upload functionality
- **Real-time Updates**: Socket.io for live content updates
- **Form Validation**: Zod schema validation for data integrity

### 🗄️ Backend & Database
- **Next.js API Routes**: RESTful API endpoints
- **Prisma ORM**: Type-safe database operations
- **SQLite Database**: Lightweight, file-based database
- **TypeScript**: Full type safety throughout the application

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the following variables in `.env`:
   ```env
   DATABASE_URL=file:./db/custom.db
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secret-key-here
   ```

4. **Initialize the database**
   ```bash
   npm run db:push
   npm run db:generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the portfolio.

   For admin access, visit [http://localhost:3000/admin](http://localhost:3000/admin)
   - **Default Admin Credentials**: 
     - Email: `admin@example.com`
     - Password: `admin123`

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── portfolio/          # Portfolio data endpoints
│   │   └── upload/             # File upload endpoint
│   ├── admin/                  # Admin dashboard pages
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/                 # React components
│   ├── admin/                  # Admin-specific components
│   ├── portfolio/              # Portfolio-specific components
│   ├── providers/              # Context providers
│   └── ui/                     # shadcn/ui components
├── hooks/                      # Custom React hooks
└── lib/                        # Utility functions and configurations
    ├── auth/                   # Authentication configuration
    ├── db.ts                   # Database client
    ├── socket.ts               # Socket.io configuration
    ├── types/                  # Type definitions
    └── utils.ts                # Utility functions
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:push      # Push schema changes to database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:reset     # Reset database
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | SQLite database connection string | Yes |
| `NEXTAUTH_URL` | URL for NextAuth.js | Yes |
| `NEXTAUTH_SECRET` | Secret key for NextAuth.js | Yes |

## 🎨 Portfolio Sections

### Hero Section
- Name and professional title
- Brief introduction
- Call-to-action buttons
- Profile image

### About Section
- Detailed about me content
- Skills overview
- Personal information
- Contact details

### Experience Section
- Work experience timeline
- Company information
- Role descriptions
- Achievement bullets
- Drag-and-drop reordering

### Skills Section
- Technical skills categorization
- Skill level indicators
- Skill categories
- Drag-and-drop reordering

### Projects Section
- Project showcase
- Project descriptions
- Technology tags
- External links
- Drag-and-drop reordering

### Contact Section
- Contact information
- Social media links
- Contact form (optional)

## 🔐 Admin Features

### Authentication
- Secure login system
- Session management
- Password protection
- Automatic logout

### Content Management
- **About Editor**: Rich text editing for personal information
- **Experience Editor**: Add/edit work experience
- **Skills Editor**: Manage technical skills
- **Projects Editor**: Showcase portfolio projects
- **Contact Editor**: Update contact information
- **Meta Editor**: SEO and metadata management

### Media Management
- Image upload for projects and profile
- Image optimization with Sharp
- File size validation
- Supported formats: JPG, PNG, WebP

### Real-time Features
- Live content updates
- Real-time collaboration
- Socket.io integration
- Instant preview changes

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms
The application can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- Render
- DigitalOcean
- AWS

### Environment Setup for Production
```env
DATABASE_URL=file:./db/custom.db
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret-key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Components from [shadcn/ui](https://ui.shadcn.com/)
- Authentication with [NextAuth.js](https://next-auth.js.org/)
- Database with [Prisma](https://prisma.io/)
- Icons from [Lucide React](https://lucide.dev/)
- Animations with [Framer Motion](https://www.framer.com/motion/)

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the code comments for additional context

---

Built with ❤️ for the developer community. Powered by Next.js and modern web technologies.