# Step 1: Build the application
FROM node:22 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

ARG API_URL
ARG SOCKET_URL

ENV API_URL=$API_URL
ENV SOCKET_URL=$SOCKET_URL

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm build

# Step 2: Run the application
# Use a smaller base image for production
FROM node:22-alpine AS runner

WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Install pnpm globally
RUN npm install -g pnpm

# Install only production dependencies
RUN pnpm install --prod

# Expose the port that the application will run on
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
