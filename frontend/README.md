Frontend scaffold instructions:

1. Create Next.js app (from your machine):

```powershell
npx create-next-app@latest ai-recruitment-frontend --ts
cd ai-recruitment-frontend
npm install
```

2. Install Tailwind + shadcn/ui and other libs:

```powershell
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install @shadcn/ui axios @tanstack/react-query
```

3. Create `lib/http.ts` axios instance with baseURL pointing to your backend.

4. Follow the design in the project brief to implement pages under the `app/` router.
