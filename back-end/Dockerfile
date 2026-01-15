# Use Node.js LTS
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose port (Back4App will provide it via env)
ENV PORT=8000
EXPOSE $PORT

# Start the server
CMD ["node", "server.js"]
