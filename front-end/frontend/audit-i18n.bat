@echo off
REM Script to audit and report i18n compliance across frontend
REM Windows batch version

echo.
echo ======================================================
echo i18n Enforcement Audit Report
echo ======================================================
echo.

REM Run lint and capture output temporarily
npm run lint > lint-output.tmp 2>&1

REM Summary
echo Scanning frontend for i18n violations...
echo.

REM Count violations using FINDSTR (Windows equivalent of grep)
setlocal enabledelayedexpansion

set "hardcoded=0"
set "html_attrs=0"
set "api_urls=0"
set "toasts=0"

for /f "delims=" %%a in ('findstr /c:"no-hardcoded-strings" lint-output.tmp ^| find /c /v ""') do set "hardcoded=%%a"
for /f "delims=" %%a in ('findstr /c:"no-hardcoded-html-attributes" lint-output.tmp ^| find /c /v ""') do set "html_attrs=%%a"
for /f "delims=" %%a in ('findstr /c:"no-api-urls" lint-output.tmp ^| find /c /v ""') do set "api_urls=%%a"
for /f "delims=" %%a in ('findstr /c:"no-hardcoded-toast-messages" lint-output.tmp ^| find /c /v ""') do set "toasts=%%a"

echo [VIOLATIONS SUMMARY]
echo.
if %hardcoded% gtr 0 (
    echo [!] Hardcoded Strings: %hardcoded%
) else (
    echo [OK] Hardcoded Strings: 0
)

if %html_attrs% gtr 0 (
    echo [!] HTML Attributes: %html_attrs%
) else (
    echo [OK] HTML Attributes: 0
)

if %api_urls% gtr 0 (
    echo [!] API URLs: %api_urls%
) else (
    echo [OK] API URLs: 0
)

if %toasts% gtr 0 (
    echo [!] Toast Messages: %toasts%
) else (
    echo [OK] Toast Messages: 0
)

echo.
set /a total=%hardcoded% + %html_attrs% + %api_urls% + %toasts%
echo Total Violations: %total%
echo.

if %total% equ 0 (
    echo [SUCCESS] Congratulations! Your frontend is fully i18n compliant!
) else (
    echo [ACTION REQUIRED]
    echo.
    echo 1. Run auto-fix for basic issues:
    echo    npm run lint:fix
    echo.
    echo 2. Format code:
    echo    npm run format
    echo.
    echo 3. Fix remaining issues manually:
    echo    npm run lint
    echo.
    echo 4. Read guides for detailed fixes:
    echo    - HTML_TOAST_I18N_GUIDE.md
    echo    - EXAMPLES_BEST_PRACTICES.md
    echo    - APPLY_I18N_ENFORCEMENT.md
)

REM Cleanup
del lint-output.tmp

echo.
echo ======================================================
