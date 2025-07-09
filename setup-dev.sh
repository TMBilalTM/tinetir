#!/bin/bash

echo "Setting up development environment..."

# SQLite için schema oluştur
echo "Creating SQLite database for development..."
DATABASE_URL="file:./dev.db" npx prisma db push

echo "Development setup complete!"
echo "Local database: ./prisma/dev.db"
echo "To view database: npx prisma studio"
