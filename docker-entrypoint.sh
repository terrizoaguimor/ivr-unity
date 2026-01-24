#!/bin/sh
set -e

# Create htpasswd file from environment variables
if [ -n "$HTPASSWD_USER" ] && [ -n "$HTPASSWD_PASS" ]; then
    echo "Creating htpasswd file..."
    htpasswd -bc /etc/nginx/.htpasswd "$HTPASSWD_USER" "$HTPASSWD_PASS"
else
    echo "Warning: HTPASSWD_USER or HTPASSWD_PASS not set, using defaults"
    # Default credentials for development (change in production!)
    htpasswd -bc /etc/nginx/.htpasswd "unity" "Unity2024!"
fi

# Inject ElevenLabs API key into JavaScript
if [ -n "$ELEVENLABS_API_KEY" ]; then
    echo "Injecting ElevenLabs API key..."
    # Create a script that sets the API key before config.js loads
    cat > /usr/share/nginx/html/env.js << EOF
// Environment variables injected at runtime
window.ELEVENLABS_API_KEY = "${ELEVENLABS_API_KEY}";
EOF

    # Inject env.js script before config.js in index.html
    sed -i 's|<script src="config.js"></script>|<script src="env.js"></script>\n  <script src="config.js"></script>|' /usr/share/nginx/html/index.html
else
    echo "Warning: ELEVENLABS_API_KEY not set"
    # Create empty env.js
    echo "window.ELEVENLABS_API_KEY = '';" > /usr/share/nginx/html/env.js
fi

echo "Starting nginx..."
exec "$@"
