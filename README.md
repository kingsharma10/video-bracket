# Video Bracket

A real-time 16-video tournament bracket where an audience votes on head-to-head matchups from their phones. Built with React, Vite, Tailwind CSS, and Firebase Realtime Database.

## How it works

- The **host** runs the bracket from a laptop at `/`
- The **audience** scans a QR code and votes from their phones at `/vote`
- Votes sync live across all devices via Firebase
- 16 videos → 8 matches → Quarterfinals → Semifinals → Final

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firebase

Create a `.env` file in the project root:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

In the [Firebase Console](https://console.firebase.google.com):
- Create a project and add a web app to get the config values above
- Enable **Realtime Database** and start in test mode

### 3. Add your videos

Edit `src/data/defaultVideos.js` with your 16 YouTube video IDs and titles:

```js
export const DEFAULT_VIDEOS = [
  { id: 'v1', title: 'My Video', ytId: 'YouTube_ID_here' },
  // ... 15 more
];
```

### 4. Run locally

```bash
npm run dev
```

Open `http://localhost:3000`

## Running a tournament

1. Open the host view on your laptop
2. Click **Start Tournament**
3. Share the QR code or `/vote` URL with your audience
4. For each match:
   - Click **Open Voting** to let the audience vote
   - Click **Close Voting** when done
   - Click the winner's name to advance them to the next round
5. Repeat until a champion is crowned

## Deploying to Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

Add your `VITE_FIREBASE_*` environment variables in the Vercel project settings under **Settings → Environment Variables**, then redeploy.

## Tech stack

- [React 18](https://react.dev)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Firebase Realtime Database](https://firebase.google.com/docs/database)
- [React Router](https://reactrouter.com)
- [qrcode.react](https://github.com/zpao/qrcode.react)
