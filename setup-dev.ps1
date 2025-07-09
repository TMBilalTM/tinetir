# PowerShell script for development setup
Write-Host "Setting up development environment..." -ForegroundColor Green

# SQLite için schema oluştur
Write-Host "Creating SQLite database for development..." -ForegroundColor Yellow
$env:DATABASE_URL = "file:./dev.db"
npx prisma db push

Write-Host "Development setup complete!" -ForegroundColor Green
Write-Host "Local database: ./prisma/dev.db" -ForegroundColor Cyan
Write-Host "To view database: npx prisma studio" -ForegroundColor Cyan
