#!/bin/bash

#=================================================================================
# User Input Section
#=================================================================================
echo "Enter the domain name (e.g., demo.mohammedsh.xyz):"
read DOMAIN_NAME

#=================================================================================
# Update System and Install Dependencies
#=================================================================================
echo "Updating system and installing dependencies..."
sudo apt update -y
sudo apt upgrade -y
sudo apt install -y nginx certbot python3-certbot-nginx curl software-properties-common
sudo systemctl start nginx
sudo systemctl enable nginx

# Install Node.js (using nvm for version management)
echo "Installing Node.js..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 20
# Verify Node.js installation
echo "Node.js version installed: $(node -v)"

# Install PM2 to manage the Node.js app
echo "Installing PM2..."
sudo npm install pm2 -g

#=================================================================================
# .env File Handling
#=================================================================================
# Check if .env file exists in the root directory
if [ -f ".env" ]; then
  echo ".env file already exists."
  # Extract the PORT value from the .env file
  PORT=$(grep PORT .env | cut -d '=' -f2 | tr -d '"')
  # If the PORT variable is empty or not found in .env, prompt for input
  if [ -z "$PORT" ]; then
    echo "PORT not found in .env file."
    read -p "Enter the Port (PORT): " PORT
  fi
else
  echo ".env file not found. Creating a new .env file."

  # Prompt for user input to generate .env file
  read -p "Enter MongoDB URL (MONGODB_URL): " MONGODB_URL
  read -p "Enter JWT Secret (JWT_SECRET): " JWT_SECRET
  read -p "Enter Node Environment (NODE_ENV) [production/development]: " NODE_ENV
  read -p "Enter Mailtrap Token (MAILTRAP_TOKEN): " MAILTRAP_TOKEN
  read -p "Enter Mailtrap Endpoint (MAILTRAP_ENDPOINT): " MAILTRAP_ENDPOINT
  read -p "Enter Client URL (CLIENT_URL): " CLIENT_URL
  read -p "Enter the Port (PORT): " PORT

  # Write the environment variables to the .env file
  cat <<EOF > .env
MONGODB_URL="$MONGODB_URL"
JWT_SECRET="$JWT_SECRET"
NODE_ENV="$NODE_ENV"
MAILTRAP_TOKEN="$MAILTRAP_TOKEN"
MAILTRAP_ENDPOINT="$MAILTRAP_ENDPOINT"
CLIENT_URL="$CLIENT_URL"
PORT="$PORT"
EOF

  echo ".env file created successfully based on user input."
fi

#=================================================================================
# Install Dependencies and Build the App
#=================================================================================
echo "Installing backend and frontend dependencies, and building the frontend..."
npm run build

# Start the app with PM2 dynamically using the repo name
REPO_NAME=$(basename -s .git "$(git config --get remote.origin.url)")
echo "Starting the app with PM2 using process name $REPO_NAME..."
pm2 start npm --name "$REPO_NAME" -- run start

#=================================================================================
# Nginx Configuration
#=================================================================================
NGINX_CONFIG_PATH="/etc/nginx/sites-available/$DOMAIN_NAME"
if [ -f "$NGINX_CONFIG_PATH" ]; then
  echo "Nginx configuration for $DOMAIN_NAME already exists. Skipping creation."
else
  echo "Setting up Nginx for domain $DOMAIN_NAME..."
  sudo tee $NGINX_CONFIG_PATH > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN_NAME;

    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
  sudo ln -s /etc/nginx/sites-available/$DOMAIN_NAME /etc/nginx/sites-enabled/
fi

# Restart Nginx
echo "Restarting Nginx..."
sudo systemctl restart nginx

#=================================================================================
# Set Up SSL Using Certbot
#=================================================================================
echo "Setting up SSL with Certbot for domain $DOMAIN_NAME..."
sudo certbot --nginx -d $DOMAIN_NAME

# Configure firewall to allow traffic
echo "Configuring firewall..."
sudo apt install ufw -y
sudo ufw allow 'Nginx Full'
sudo ufw enable

echo "Deployment completed successfully for domain: $DOMAIN_NAME"
#=================================================================================
