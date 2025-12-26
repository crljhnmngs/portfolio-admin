FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Generate Prisma Client
RUN bunx prisma generate

# Expose the port Next.js runs on
EXPOSE 3000

# Start the development server
CMD ["bun", "run", "dev"]