param(
  [switch]$SkipTerraform
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$TerraformDir = Join-Path $Root "terraform"
$DistDir = Join-Path $Root "dist"

Push-Location $Root
try {
  Write-Host "Building frontend-shortener..." -ForegroundColor Cyan
  npm run build

  if (-not $SkipTerraform) {
    Write-Host "Applying Terraform..." -ForegroundColor Cyan
    terraform -chdir="$TerraformDir" init
    terraform -chdir="$TerraformDir" apply -auto-approve
  }

  $Bucket = terraform -chdir="$TerraformDir" output -raw bucket_name
  $DistributionId = terraform -chdir="$TerraformDir" output -raw cloudfront_distribution_id
  $Domain = terraform -chdir="$TerraformDir" output -raw cloudfront_domain_name

  Write-Host "Uploading assets to s3://$Bucket..." -ForegroundColor Cyan
  aws s3 sync "$DistDir" "s3://$Bucket" --delete --cache-control "public,max-age=31536000,immutable" --exclude "index.html"
  aws s3 cp (Join-Path $DistDir "index.html") "s3://$Bucket/index.html" --cache-control "no-cache,no-store,must-revalidate" --content-type "text/html"

  Write-Host "Invalidating CloudFront distribution $DistributionId..." -ForegroundColor Cyan
  aws cloudfront create-invalidation --distribution-id "$DistributionId" --paths "/*" | Out-Null

  Write-Host ""
  Write-Host "Frontend shortener deployed:" -ForegroundColor Green
  Write-Host "https://$Domain" -ForegroundColor Green
}
finally {
  Pop-Location
}
