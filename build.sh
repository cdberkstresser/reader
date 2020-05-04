zip -r -FS ../reader-Chrome.zip * --exclude *.git*  --exclude *build.* --exclude *manifest.base
mv manifest.json manifest.base
jq '.browser_specific_settings.gecko += {id : "{3f0845bb-e6dc-4c4c-a43d-5b49221a3b13}"}' manifest.base > manifest.json
zip -r -FS ../reader-Firefox.zip * --exclude *.git*  --exclude *build.*
rm manifest.json
mv manifest.base manifest.json
