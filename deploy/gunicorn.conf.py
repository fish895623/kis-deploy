"""
Gunicorn configuration for KIS Django backend.
"""

# Bind to localhost only (nginx handles external connections)
bind = "127.0.0.1:8000"

# Number of worker processes
# Recommended: 2 * CPU cores + 1
workers = 2

# Worker class
worker_class = "sync"

# Timeout for worker processes
timeout = 30

# Keep alive connections
keepalive = 2

# Maximum requests per worker before restart (prevents memory leaks)
max_requests = 1000
max_requests_jitter = 50

# Logging
accesslog = "/var/log/kis/gunicorn-access.log"
errorlog = "/var/log/kis/gunicorn-error.log"
loglevel = "info"

# Process naming
proc_name = "kis-backend"

# Graceful timeout
graceful_timeout = 30
