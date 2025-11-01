# 3D Models Directory

This directory contains all STL files available for download.

## Structure

- **free/**: Free 3D models available to all users
- **premium/**: Premium 3D models requiring purchase

## File Naming Convention

Files should follow this format:
- `{slug}-{version}.stl` or `{slug}-{part}-{version}.stl` for multi-part models

## Important Notes

1. All STL files must be valid and tested for 3D printing
2. Premium models are watermarked and tracked per user
3. Free models are rate-limited to prevent abuse
4. Maximum file size: 500MB per model
5. Supported formats: .stl (binary and ASCII), .zip for multi-part

## Adding New Models

When adding new models:
1. Place STL file in appropriate directory (free/premium)
2. Update database with file path and metadata
3. Generate preview thumbnail (recommended 600x600px)
4. Test download and 3D viewer integration
