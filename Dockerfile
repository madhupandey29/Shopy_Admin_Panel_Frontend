# Use official Node.js LTS image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the Next.js app
RUN npm run build

# Production image, copy only necessary files
FROM node:18-alpine AS runner

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy built app from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/package.json ./package.json

# Set environment variable to production
ENV NODE_ENV=production

# Expose port (default for Next.js)
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]