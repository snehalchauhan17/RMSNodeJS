# Step 1: Build the Angular application
FROM node:20.18.1 AS build-stage

# Set the working directory in the container
WORKDIR /app

# Install dependencies
COPY package*.json ./

# Install dependencies (using legacy-peer-deps to ignore peer conflicts)
RUN npm install --legacy-peer-deps

# Copy the rest of the Angular application code
COPY . .

# Optionally build the app (if you need to do a production build)
# RUN npm run build --prod

# Expose port 4200 for local testing
EXPOSE 4200

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Start the Angular development server
CMD ["ng", "serve", "--host", "10.154.2.172", "--port", "4200"]
