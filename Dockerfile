# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Build Next.js app
RUN npm run build

# Expose port
EXPOSE 8080

# Cloud Run requires listening on $PORT
ENV PORT=8080

# Start app
CMD ["npm", "start"]