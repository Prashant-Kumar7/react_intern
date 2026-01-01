# Real-Time Gallery Interaction App

A multi-user real-time image interaction web application built with React, TypeScript, Tailwind CSS, and InstantDB.

## Features

- 🖼️ **Gallery Section**: Browse images from Unsplash in a responsive grid layout
- 💬 **Real-Time Interactions**: Add emoji reactions and comments that sync instantly across all users
- 📱 **Activity Feed**: View all interactions happening across images in real-time
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- ⚡ **Real-Time Sync**: Powered by InstantDB for instant updates across all clients

## Tech Stack

- **React 19** - UI framework with functional components
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **InstantDB** - Real-time database
- **React Query** - Server state management
- **Zustand** - Client state management
- **Unsplash API** - Image source

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- InstantDB account (free at https://instantdb.com)
- Unsplash API access key (free at https://unsplash.com/developers)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_INSTANTDB_APP_ID=your_instantdb_app_id_here
   VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
   ```

4. **Get your InstantDB App ID**
   - Go to https://instantdb.com
   - Create a new app
   - Copy your App ID and add it to `.env`

5. **Get your Unsplash Access Key**
   - Go to https://unsplash.com/developers
   - Create a new application
   - Copy your Access Key and add it to `.env`

6. **Configure InstantDB Schema**
   
   In your InstantDB dashboard, set up the following schema:
   ```typescript
   {
     images: {
       id: string;
       unsplashId: string;
       url: string;
       thumbUrl: string;
       description: string | null;
       author: string;
       createdAt: number;
     };
     reactions: {
       id: string;
       imageId: string;
       userId: string;
       emoji: string;
       createdAt: number;
     };
     comments: {
       id: string;
       imageId: string;
       userId: string;
       userName: string;
       userColor: string;
       text: string;
       createdAt: number;
     };
   }
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   Navigate to `http://localhost:5173`

## API Handling Strategy

### Unsplash API
- Images are fetched using React Query's `useInfiniteQuery` for pagination
- Images are cached and synced to InstantDB for real-time interactions
- The app uses the Unsplash Search API to fetch nature images

### InstantDB
- All real-time data (reactions, comments) is stored in InstantDB
- Uses InstantDB's React hooks (`useQuery`) for real-time subscriptions
- Transactions are used for mutations (add/delete reactions and comments)

## InstantDB Schema & Usage

The app uses three main tables:

1. **images**: Stores synced Unsplash images
2. **reactions**: Stores emoji reactions on images
3. **comments**: Stores text comments on images

All interactions are synced in real-time using InstantDB's reactive queries.

## Key React Decisions

### Component Structure
- **Gallery**: Displays images in a grid with pagination
- **ImageModal**: Shows full image view with reactions and comments
- **Feed**: Displays global activity feed
- **EmojiPicker**: Custom emoji picker component

### State Management
- **Zustand**: Used for client-side state (selected image, user info)
- **React Query**: Used for Unsplash API data fetching
- **InstantDB**: Used for real-time server state

### Hooks
- `useUnsplashImages`: Fetches images from Unsplash
- `useInstantImages`: Subscribes to InstantDB images
- `useImageReactions`: Subscribes to reactions for a specific image
- `useImageComments`: Subscribes to comments for a specific image
- `useImageActions`: Provides mutation functions for interactions

### Performance Optimizations
- `useMemo` for expensive computations
- `useCallback` for stable function references
- `memo` for ImageCard component to prevent unnecessary re-renders
- Lazy loading images with `loading="lazy"`

## Challenges Faced

1. **Image ID Mapping**: Mapping Unsplash image IDs to InstantDB IDs required careful synchronization logic
2. **Real-Time Updates**: Ensuring smooth real-time updates without flickering required proper state management
3. **InstantDB Query Syntax**: Adapting to InstantDB's query API required some iteration
4. **User Identity**: Implementing persistent user identity with localStorage

## What I Would Improve with More Time

1. **Error Handling**: Add comprehensive error boundaries and error states
2. **Loading States**: More granular loading indicators
3. **Optimistic Updates**: Add optimistic UI updates for better perceived performance
4. **Image Optimization**: Implement image lazy loading and progressive loading
5. **Accessibility**: Add ARIA labels and keyboard navigation
6. **Mobile Responsiveness**: Further optimize for mobile devices
7. **Conflict Resolution**: Better handling of simultaneous interactions
8. **User Profiles**: Allow users to customize their profile
9. **Image Search**: Add search functionality for Unsplash images
10. **Notifications**: Add toast notifications for new interactions

## Deployment

### Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Netlify

1. Push your code to GitHub
2. Import your repository in Netlify
3. Add environment variables in Netlify dashboard
4. Deploy

### Cloudflare Pages

1. Push your code to GitHub
2. Import your repository in Cloudflare Pages
3. Add environment variables in Cloudflare dashboard
4. Deploy

## Testing Real-Time Behavior

1. Open the app in multiple browser tabs or devices
2. Add a reaction or comment in one tab
3. Observe it appear instantly in other tabs
4. Check the Activity Feed to see all interactions

## License

MIT
