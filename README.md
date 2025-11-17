This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Firebase Realtime Database Rules

This project includes Firebase Realtime Database security rules in `database.rules.json` with time-bound read/write access until 2025-12-14.

- Rules file: `database.rules.json`
- Firebase config: `firebase.json` (maps database rules)

Deploy these rules with the Firebase CLI:

```powershell
# Install Firebase CLI (once)
npm install -g firebase-tools

# Log in and select your Firebase project
firebase login
firebase use --add  # choose your project and set an alias

# Deploy only the Realtime Database rules
firebase deploy --only database
```

If you prefer not to install globally, you can use npx:

```powershell
npx firebase login
npx firebase use --add
npx firebase deploy --only database
```

Note: These rules expire at the given timestamp. Update `database.rules.json` before the expiration date to avoid losing access.
