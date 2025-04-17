# Use Node.js image based on Debian/Ubuntu
FROM node:18-slim

# Install Python and OpenCV dependencies (with apt-get)
RUN apt-get update && apt-get upgrade -y && apt-get install -y python3 python3-pip python3-opencv libgl1

# Set working directory
WORKDIR /app

# Copy server files
COPY . .

# Install server dependencies
RUN npm install

# Install Python dependencies
RUN pip3 install -r requirements.txt

# Expose the backend port
EXPOSE 5000

# Start the app
CMD ["npm", "run", "dev"]
