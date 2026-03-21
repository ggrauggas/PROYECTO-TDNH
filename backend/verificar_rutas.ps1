Write-Host "VERIFICANDO RUTAS DEL BACKEND" -ForegroundColor Cyan
Write-Host "=============================="

$rutas = @(
    "/api/health",
    "/api/test-db", 
    "/api/posts",
    "/api/auth/register",
    "/api/auth/login"
)

foreach ($ruta in $rutas) {
    Write-Host "`nProbando $ruta..." -ForegroundColor Yellow
    try {
        if ($ruta -match "login|register") {
            # Para POST
            $body = @{ 
                email = "test@test.com"
                password = "password123"
            } | ConvertTo-Json
            $response = Invoke-RestMethod -Uri "http://localhost:3000$ruta" -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
            Write-Host "   OK $ruta responde" -ForegroundColor Green
        } else {
            # Para GET
            $response = Invoke-RestMethod -Uri "http://localhost:3000$ruta" -Method Get -ErrorAction Stop
            Write-Host "   OK $ruta responde" -ForegroundColor Green
        }
    } catch {
        Write-Host "   ERROR $ruta fallo" -ForegroundColor Red
        Write-Host "   Detalle: $($_.Exception.Message)" -ForegroundColor Red
    }
}