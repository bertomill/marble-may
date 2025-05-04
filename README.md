# Marble-May AI App Builder

This is an AI-powered application builder that helps businesses create web applications based on their needs. The app leverages the Vercel AI SDK and OpenAI to generate app ideas and code for users.

## Features

- **User Authentication**: Sign up and login with Supabase
- **Dashboard**: View and manage your app projects
- **AI-Powered App Generation**:
  - Questionnaire to understand your business needs
  - AI generates app ideas based on your input
  - Select features for your app
  - AI builds your app with code generation
  - Preview your application
  - Deploy your application

## Code Structure Map

### User Journey & File Mapping

1. **Authentication & Home** 
   - Landing page: `/app/page.tsx`
   - Auth form: `/components/auth/AuthForm.tsx`
   - Auth processing: `/lib/supabase.ts`

2. **Dashboard**
   - Page container: `/app/dashboard/page.tsx`
   - Projects list: `/components/dashboard/ProjectsList.tsx`
   - Project card: `/components/dashboard/ProjectCard.tsx`

3. **App Builder Flow**
   - Builder page: `/app/builder/page.tsx`
   - Main controller: `/components/builder/AppBuilder.tsx` (orchestrates all steps)
   
   a. **Questionnaire Step**
   - UI: `/components/builder/QuestionnaireStep.tsx`
   - Form submission → Saves to Supabase → Sends to AI
   
   b. **Idea Generation Step**
   - UI: `/components/builder/IdeaStep.tsx`
   - API endpoint: `/app/api/generate/route.ts`
   - AI processing: `/lib/ai.ts` (generateAppIdea function)
   - Feature selection → Prepares for code generation
   
   c. **Build Step**
   - UI: `/components/builder/BuildStep.tsx`
   - API endpoint: `/app/api/generate/route.ts`
   - AI processing: `/lib/ai.ts` (generateAppCode function)
   - Code generation → Saves to database
   
   d. **Preview Step**
   - UI: `/components/builder/PreviewStep.tsx`
   - Deployment simulation
   - Return to dashboard

4. **Data Flow**
   - User input → AppBuilder state → API calls → Database storage
   - Database interactions: `/lib/supabase.ts`
   - Project type definitions: `/types.ts`

5. **Layout & Navigation**
   - Root layout: `/app/layout.tsx`
   - Navigation: `/components/layout/MainNav.tsx`

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Supabase**: Auth and database
- **Vercel AI SDK**: AI integration
- **Tailwind CSS**: Styling
- **shadcn/ui**: UI components

## Getting Started

### Prerequisites

- Node.js 18+
- NPM or Yarn
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   # Supabase credentials
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # OpenAI API key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Set up your Supabase project:
   - Create a new project in Supabase
   - Set up authentication (Email/Password)
   - Create the following tables:
     - `projects`: For storing user app projects

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### projects
- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to auth.users)
- `name`: String
- `business_details`: Text
- `app_idea`: Text
- `features`: Array of strings
- `generated_code`: Text or JSONB
- `status`: Enum ('idea', 'building', 'preview', 'published')
- `preview_url`: String (Optional)
- `published_url`: String (Optional)
- `created_at`: Timestamp
- `updated_at`: Timestamp

## License

MIT
