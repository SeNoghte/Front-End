# Stage 1: Build the Angular app
FROM registry.docker.ir/node:18 AS build
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the Angular app source code
COPY . .

# Build the Angular app
RUN npm run build

# Stage 2: Serve the app using nginx
FROM registry.docker.ir/nginx:alpine
COPY --from=build /app/dist/front-end/browser /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
