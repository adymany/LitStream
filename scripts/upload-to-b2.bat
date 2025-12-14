@echo off
:: B2 Upload Script for LitStream
:: Run this script to upload videos to Backblaze B2

echo.
echo === LitStream B2 Video Uploader ===
echo.

:: Check if already authorized
b2 get-account-info >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Already authorized to B2!
    goto :upload
)

:: Authorize with B2
echo Please enter your Backblaze B2 credentials:
echo.
set /p KEY_ID="Application Key ID: "
set /p APP_KEY="Application Key (secret): "

echo.
echo Authorizing with Backblaze B2...
b2 authorize-account %KEY_ID% %APP_KEY%

if %ERRORLEVEL% NEQ 0 (
    echo Failed to authorize. Please check your credentials.
    pause
    exit /b 1
)

:upload
echo.
echo Uploading videos from public/videos to B2...
echo.

:: Get bucket name
set BUCKET_NAME=litstream-videos

:: Upload all video files
for %%f in (public\videos\*.mp4 public\videos\*.webm public\videos\*.mkv public\videos\*.mov) do (
    echo Uploading: %%~nxf
    b2 upload-file %BUCKET_NAME% "%%f" "videos/%%~nxf"
)

echo.
echo === Upload Complete! ===
echo.
echo Your videos are now available at:
echo https://f003.backblazeb2.com/file/%BUCKET_NAME%/videos/
echo.
pause
