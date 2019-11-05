#exclude git and build files
$exclude = @("*.git*","build.*")
#include everything else in this directory
$files = Get-ChildItem -Path . -Exclude $exclude
#create a zip file in the parent folder
Compress-Archive -Path $files -DestinationPath "../reader.zip" -CompressionLevel Fastest -Force