@echo off
setlocal

cd /d "%~dp0"

echo ============================================
echo MiniMarket - API propia + Expo
echo ============================================
echo.

echo Revisando API en http://localhost:3001/productos ...
powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:3001/productos' -TimeoutSec 2; if ($r.StatusCode -ge 200) { exit 0 } exit 1 } catch { exit 1 }"

if not errorlevel 1 (
  echo La API ya esta corriendo en el puerto 3001.
) else (
  powershell -NoProfile -ExecutionPolicy Bypass -Command "if (Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue) { exit 0 } exit 1"
  if not errorlevel 1 (
    echo.
    echo El puerto 3001 esta ocupado, pero no responde el endpoint /productos.
    echo Cierra la ventana/proceso que usa ese puerto o cambia el puerto de la API.
    pause
    exit /b 1
  )

  echo Iniciando JSON Server en una ventana nueva...
  start "MiniMarket API - JSON Server" cmd /k "cd /d "%~dp0" && npm run api"

  echo Esperando a que la API inicie...
  timeout /t 3 /nobreak >nul
)

echo.
echo Iniciando Expo...
set API_IP=192.168.10.110
set EXPO_PUBLIC_API_URL=http://%API_IP%:3001
set REACT_NATIVE_PACKAGER_HOSTNAME=%API_IP%
echo IP forzada para Expo Go: %API_IP%
echo API para Expo Go: http://%API_IP%:3001/productos
echo.

call npx expo start --lan --clear

endlocal
