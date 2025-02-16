# Use the official Node.js slim image as the base image
FROM node:22-slim

# Set the working directory
WORKDIR /app

# Install necessary dependencies and build tools
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    make \
    g++ \
    gcc \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package*.json ./

RUN npm install

COPY . .
# RUN npm run build

# Copy the rest of the application code

# Expose port 3000 for development
EXPOSE 3000

# Set environment variables for development
ENV NODE_ENV development
# RUN sudo setenforce 0
# Start the development server for development
CMD ["npm","run","dev"]
