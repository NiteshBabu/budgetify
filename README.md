<div align="center">

# 💸 Budgetify

<img src="budgetify.webp" alt="Budgetify App Screenshot" width="800" />

## Budgetify is a modern, full-featured budget tracking and expense management application.

<p> Built with Next.js 16, TypeScript, and PostgreSQL. Track your income and expenses, visualize spending patterns, and take control of your finances with an elegant, user-friendly interface.</p>

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Neon](https://img.shields.io/badge/Neon-00E699?style=for-the-badge&logo=neon&logoColor=black)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

## [🔗Budgetify](https://budgetify.niteshbabu.tech)

</div>

## ✨ Features

### 💳 Transaction Management

- **Quick Transaction Creation**: Add income and expense transactions with just a few clicks
- **Custom Categories**: Create and manage personalized categories with emoji icons
- **Transaction History**: View, filter, and search through all your transactions
- **Date Range Filtering**: Filter transactions by custom date ranges (up to 90 days)
- **Export Data**: Export your transactions to CSV for external analysis

### 📊 Analytics & Insights

- **Real-time Statistics**: View income, expenses, and balance at a glance
- **Interactive Charts**: Visualize spending patterns with beautiful Recharts graphs
- **Historical Data**: Track monthly and yearly financial trends
- **Period Comparison**: Compare financial performance across different time periods
- **Category Breakdown**: Understand spending distribution across categories

### 🌍 Multi-Currency Support

- Support for multiple currencies:
  - 💵 USD (US Dollar)
  - 💷 GBP (British Pound)
  - 💶 EUR (Euro)
  - 💴 JPY (Japanese Yen)
  - 💹 INR (Indian Rupee)
- Easy currency switching in settings
- Currency-aware number formatting

### 🎨 User Experience

- **Modern UI**: Clean, intuitive interface built with Radix UI components
- **Dark/Light Mode**: Full theme support with next-themes
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Loading States**: Skeleton loaders for smooth user experience
- **Toast Notifications**: Real-time feedback with Sonner
- **Animated Components**: Smooth transitions and animations

### 🔐 Security & Authentication

- **Clerk Authentication**: Secure user authentication and management
- **Protected Routes**: Middleware-based route protection
- **User Isolation**: Each user's data is completely isolated and secure

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19.2
- **Styling**: Tailwind CSS 4
- **Components**: Radix UI (Headless UI components)
- **State Management**: TanStack React Query
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Themes**: next-themes

### Backend

- **Database**: PostgreSQL
- **ORM**: Prisma 6.19
- **Authentication**: Clerk
- **API**: Next.js API Routes
- **Runtime**: Bun (for development)

### Developer Experience

- **Code Quality**: Biome (linting & formatting)
- **Type Safety**: TypeScript with strict mode
- **Development Tools**:
  - React Query Devtools
  - React Compiler
  - Hot Module Replacement

## 📁 Project Structure

```
budgetify/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── public/                    # Static assets
├── src/
│   ├── app/
│   │   ├── (auth)/           # Authentication pages
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── (dashboard)/      # Main application pages
│   │   │   ├── page.tsx      # Dashboard home
│   │   │   ├── transactions/ # Transaction management
│   │   │   ├── manage/       # Settings & categories
│   │   │   └── _components/  # Dashboard components
│   │   ├── api/              # API routes
│   │   │   ├── categories/
│   │   │   ├── transactions/
│   │   │   ├── stats/
│   │   │   └── history-data/
│   │   └── wizard/           # Onboarding flow
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   ├── data-table/       # Table components
│   │   └── providers/        # Context providers
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities and helpers
│   └── schema/               # Zod validation schemas
├── biome.json                # Biome configuration
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ or Bun
- PostgreSQL database
- Clerk account (for authentication)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/budgetify.git
   cd budgetify
   ```

2. **Install dependencies**

   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/budgetify"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
   CLERK_SECRET_KEY=your_secret_key

   # Clerk URLs
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
   ```

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   # or run migrations
   npx prisma migrate dev
   ```

5. **Run the development server**

   ```bash
   bun run start
   # or
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Usage

### First-Time Setup

1. **Sign Up**: Create an account using Clerk authentication
2. **Set Currency**: Choose your preferred currency in the setup wizard
3. **Create Categories**: Add custom categories for income and expenses
4. **Start Tracking**: Begin adding your transactions!

### Adding Transactions

1. Click the **"New Income"** or **"New Expense"** button on the dashboard
2. Fill in the transaction details:
   - Amount
   - Category
   - Description (optional)
   - Date
3. Click **"Create"** to save

### Managing Categories

1. Go to **Manage** page
2. View existing categories for income and expenses
3. Create new categories with custom names and emoji icons
4. Delete unused categories (transactions must be reassigned first)

### Viewing Analytics

1. **Dashboard**: Quick overview of current period statistics
2. **Transactions**: Detailed transaction history with filtering
3. **History Charts**: Visual representation of financial trends
4. Use date range picker to analyze specific periods

## 🎯 Key Features Explained

### Data Models

**UserSettings**

- Stores user preferences (currency)

**Category**

- Custom categorization for transactions
- Supports both income and expense types
- Emoji icon support

**Transactions**

- Core transaction data (amount, date, description)
- Linked to categories
- Type-based (income/expense)

**MonthHistory & YearHistory**

- Aggregated financial data for faster analytics
- Enables efficient historical comparisons

### API Routes

- `/api/categories` - Category CRUD operations
- `/api/transactions` - Transaction management
- `/api/stats` - Financial statistics
- `/api/history-data` - Historical chart data
- `/api/history-periods` - Available time periods
- `/api/user-settings` - User preferences

## 🔧 Development

### Commands

```bash
# Start development server
bun run start

# Build for production
bun run build

# Lint code
bun run lint

# Format code
bun run format

# Database operations
npx prisma studio          # Open Prisma Studio
npx prisma generate        # Generate Prisma Client
npx prisma db push         # Push schema to database
npx prisma migrate dev     # Create and apply migrations
```

### Code Quality

This project uses [Biome](https://biomejs.dev/) for:

- Fast, comprehensive linting
- Automatic code formatting
- Import sorting

Run checks with:

```bash
bun run lint
bun run format
```

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ using Next.js and TypeScript**
