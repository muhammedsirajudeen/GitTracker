# -------- STAGE 1: Build the application --------
FROM node:22-slim AS builder

# Set working directory
WORKDIR /app

# Install necessary dependencies
# RUN apt-get update && apt-get install -y \
#     python3 \
#     make \
#     g++ \
#     --no-install-recommends && \
#     rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY ../package*.json ./

# Install dependencies
RUN npm install 


# # Copy the application code
# COPY .. .

# # Build the application
# RUN npm run build

# # -------- STAGE 2: Production-ready minimal image --------
# FROM node:22-slim

# # Set working directory
# WORKDIR /app

# # Copy only necessary files from builder stage
# COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public

# # Expose port
# EXPOSE 3000

# # Set environment to production
# ENV NODE_ENV=production

# # Start the server
# CMD ["npm", "start"]
