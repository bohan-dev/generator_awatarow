# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Remove default nginx configuration and files
RUN rm -rf /etc/nginx/conf.d/default.conf /usr/share/nginx/html/*

# Copy the build output and move into nginx html directory
COPY --from=build /app/dist /tmp/dist
RUN cp -r /tmp/dist/* /usr/share/nginx/html/ && rm -rf /tmp/dist

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 for Google Cloud Run
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]