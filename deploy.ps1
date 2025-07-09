# PowerShell deployment script for Tinetir
Write-Host "🚀 Deploying Tinetir to Vercel..." -ForegroundColor Green

Write-Host "📋 Vercel Environment Variables Setup:" -ForegroundColor Yellow
Write-Host "Please add these environment variables in Vercel Dashboard:" -ForegroundColor Yellow
Write-Host ""
Write-Host "DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMDFKWk5aRTNXWjY3VlFTTTBOWTNSTk1RM1MiLCJ0ZW5hbnRfaWQiOiI1YmQ1NDVjNDk2M2RiNjhhZjJhNGE4ZjAwMDE4MWFhZTRjMzEzZjA0ZWFmY2Q3ZGVmODFmZTI3N2RhMWZjZWU1IiwiaW50ZXJuYWxfc2VjcmV0IjoiOWYyMWU2Y2ItMzg2OC00YmFiLTg1MjAtMmRiYjRhZjhmYTRiIn0.VT9QDozmWePqzFgHzIdJ5tK2W5k3wbjAYdqqnA3smAY" -ForegroundColor Cyan
Write-Host ""
Write-Host "DIRECT_URL=postgres://5bd545c4963db68af2a4a8f000181aae4c313f04eafcd7def81fe277da1fcee5:sk_UaQA2TAZfkIUUnftsTMrB@db.prisma.io:5432/?sslmode=require" -ForegroundColor Cyan
Write-Host ""
Write-Host "NEXTAUTH_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6" -ForegroundColor Cyan
Write-Host ""
Write-Host "NEXTAUTH_URL=https://your-project-name.vercel.app" -ForegroundColor Cyan
Write-Host ""

Write-Host "📦 Building project locally for testing..." -ForegroundColor Yellow
npm run build:prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Local build successful!" -ForegroundColor Green
    Write-Host "🚀 Ready for Vercel deployment" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. git add ." -ForegroundColor White
    Write-Host "2. git commit -m 'Deploy to production'" -ForegroundColor White
    Write-Host "3. git push" -ForegroundColor White
    Write-Host "4. Vercel will auto-deploy!" -ForegroundColor White
} else {
    Write-Host "❌ Local build failed. Please fix errors before deploying." -ForegroundColor Red
}
