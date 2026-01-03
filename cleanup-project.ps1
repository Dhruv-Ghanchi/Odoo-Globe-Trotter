# Cleanup Script - Remove temporary and redundant files
# Run this script to clean up the project

Write-Host "Cleaning up project files..." -ForegroundColor Yellow

$filesToDelete = @(
    # Test/Debug Scripts
    "test-db-connection.js",
    "test-db-tables.js",
    "check-tables.js",
    "create-tables.js",
    
    # Troubleshooting Documentation
    "TROUBLESHOOTING.md",
    "POSTGRESQL_FIX.md",
    "POSTGRESQL_INSTALL_CHECK.md",
    "START_POSTGRESQL.md",
    "PGADMIN_SETUP_STEPS.md",
    
    # Redundant API Documentation
    "ACTIVITY_API_DOCUMENTATION.md",
    "TRIP_API_DOCUMENTATION.md",
    
    # Development Notes
    "FIXES_SUMMARY.md",
    "REVIEW_FIXES.md"
)

$deletedCount = 0
$notFoundCount = 0

foreach ($file in $filesToDelete) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "✓ Deleted: $file" -ForegroundColor Green
        $deletedCount++
    } else {
        Write-Host "✗ Not found: $file" -ForegroundColor Red
        $notFoundCount++
    }
}

Write-Host "`nCleanup complete!" -ForegroundColor Cyan
Write-Host "Deleted: $deletedCount files" -ForegroundColor Green
Write-Host "Not found: $notFoundCount files" -ForegroundColor Yellow

