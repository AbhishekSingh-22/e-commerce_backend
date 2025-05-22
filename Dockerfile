# Use an official Node.js base image
FROM node:20

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Run the app
CMD ["node", "src/index.js"]
