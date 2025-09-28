# Script to help find your EC2 instances
# This requires AWS CLI to be installed and configured

Write-Host "Looking for your EC2 instances..." -ForegroundColor Yellow

# Check if AWS CLI is installed
if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
    Write-Host "AWS CLI is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install AWS CLI from: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    Write-Host "Or provide your EC2 instance IP address manually" -ForegroundColor Yellow
    exit 1
}

try {
    # Get running EC2 instances
    $instances = aws ec2 describe-instances --query 'Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress,PrivateIpAddress,InstanceType,Tags[?Key==`Name`].Value|[0]]' --output table 2>$null
    
    if ($instances) {
        Write-Host "Found EC2 instances:" -ForegroundColor Green
        Write-Host $instances
        Write-Host ""
        Write-Host "Use the PublicIpAddress for deployment" -ForegroundColor Cyan
    } else {
        Write-Host "No EC2 instances found or AWS CLI not configured" -ForegroundColor Red
        Write-Host "Please check your AWS credentials or create an EC2 instance first" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error accessing AWS: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please check your AWS credentials configuration" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Manual setup:" -ForegroundColor Yellow
Write-Host "1. Go to AWS Console > EC2 > Instances" -ForegroundColor White
Write-Host "2. Find your running instance" -ForegroundColor White
Write-Host "3. Copy the Public IPv4 address" -ForegroundColor White
Write-Host "4. Run: .\deploy-aws.bat" -ForegroundColor White
