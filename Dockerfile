# IVR Unity Financial - Docker Image
# Uses nginx to serve static files with basic auth

FROM nginx:alpine

# Install apache2-utils for htpasswd and envsubst
RUN apk add --no-cache apache2-utils gettext

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy application files
COPY index.html /usr/share/nginx/html/
COPY config.js /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY assets/ /usr/share/nginx/html/assets/

# Copy startup script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port 8080 (App Platform requirement)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Start with custom entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
