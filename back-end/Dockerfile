# Use Node.js LTS
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Set PORT environment variable
ENV PORT=8000
EXPOSE 8000

# Start the server
CMD ["node", "server.js"]
