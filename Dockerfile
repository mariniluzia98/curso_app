# Stage 1: Build stage (optional for static files, but follows best practices)
FROM node:20-alpine AS builder

WORKDIR /app

# Copy HTML, CSS, and JS files
COPY index.html .
COPY css/ ./css/
COPY js/ ./js/

# Stage 2: Production stage with nginx
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/index.html || exit 1

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
