# Use Node.js LTS image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files first for efficient caching
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install debug
RUN npm install discord.js-selfbot-v13

# Copy the rest of your app
COPY . .

# Default command to run your script
CMD ["node", "autosender.js"]
