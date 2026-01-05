# collaborative-note-app
A real-time collaborative note-taking web application built with Next.js and NextUI (HeroUI). Features rich text editing, version history, and live collaboration capabilities.

## 🚀 Features

### Core Features

- **Notes Management**
  - Create, edit, and delete notes
  - Rich text formatting (bold, italics, underline, lists, code blocks, blockquotes, links)
  - Search functionality to quickly find notes
  - Responsive sidebar with note previews

- **Version History**
  - Automatic version tracking for every edit
  - View previous versions with timestamps
  - Restore notes to any previous version
  - Clear version indicators and relative time display

- **Real-time Collaboration**
  - Simulated real-time sync using localStorage (can be extended to WebSockets)
  - Automatic saving with debouncing
  - Multi-user support ready

- **UI/UX**
  - Modern, clean interface using NextUI components
  - Dark mode support
  - Smooth transitions and animations
  - Responsive design for all screen sizes
  - Minimalistic design aligned with modern UI standards

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: NextUI (HeroUI) v2
- **State Management**: Zustand
- **Rich Text Editor**: React Quill
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety
- **Date Formatting**: date-fns

## 📦 Installation

### Prerequisites

- **Node.js**: Version 18.17.0 or higher (latest LTS recommended)
- **npm**: Comes with Node.js

If you're using nvm (Node Version Manager):
```bash
# Install and use the latest LTS version
nvm install --lts
nvm use --lts
nvm alias default node  # Set as default

# Or use the version specified in .nvmrc
nvm use
```

1. **Initialize Git repository** (if not already done)
   ```bash
   cd collaborative-note-app
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Install dependencies**

   Make sure you're using the correct Node.js version:
   ```bash
   # If using nvm, ensure you're in the project directory
   nvm use
   
   # Install dependencies
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)


This project is created as part of a frontend developer assignment.

Built with ❤️ using Next.js and NextUI

