# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for prisma CLI & nest build)
RUN npm install

# Copy prisma schema first and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy rest of source code
COPY . .

# Build NestJS app
RUN npm run build

# Stage 2: Production (chỉ giữ file cần thiết)
FROM node:18-alpine AS production
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy compiled app from builder
COPY --from=builder /app/dist ./dist

# Copy prisma schema (needed for runtime)
COPY --from=builder /app/prisma ./prisma

# Copy generated prisma client binaries
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

EXPOSE 10000
ENV NODE_ENV=production

CMD ["node", "dist/main.js"]
