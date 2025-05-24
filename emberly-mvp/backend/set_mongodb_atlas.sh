#!/bin/bash

# Script to set MongoDB Atlas connection string as environment variable

# Check if arguments are provided
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <username> <password> <cluster-url>"
    echo "Example: $0 emberly-user mySecurePassword cluster0.abc123.mongodb.net"
    exit 1
fi

USERNAME=$1
PASSWORD=$2
CLUSTER_URL=$3

# Create or update .env file
if [ -f .env ]; then
    # Check if MONGODB_URI already exists in .env
    if grep -q "MONGODB_URI=" .env; then
        # Replace existing MONGODB_URI
        sed -i '' "s|MONGODB_URI=.*|MONGODB_URI=mongodb+srv://$USERNAME:$PASSWORD@$CLUSTER_URL/emberly?retryWrites=true\&w=majority|g" .env
    else
        # Add MONGODB_URI to .env
        echo "MONGODB_URI=mongodb+srv://$USERNAME:$PASSWORD@$CLUSTER_URL/emberly?retryWrites=true&w=majority" >> .env
    fi

    # Check if MONGODB_DB_NAME already exists in .env
    if ! grep -q "MONGODB_DB_NAME=" .env; then
        echo "MONGODB_DB_NAME=emberly" >> .env
    fi
else
    # Create new .env file
    echo "# MongoDB Atlas Configuration" > .env
    echo "MONGODB_URI=mongodb+srv://$USERNAME:$PASSWORD@$CLUSTER_URL/emberly?retryWrites=true&w=majority" >> .env
    echo "MONGODB_DB_NAME=emberly" >> .env
    echo "" >> .env
    echo "# Add other environment variables as needed" >> .env
fi

echo "MongoDB Atlas connection string has been set in .env file"
echo "To test the connection, run: python3 -m uvicorn app.main:app --reload"

# Make the script executable
chmod +x set_mongodb_atlas.sh 