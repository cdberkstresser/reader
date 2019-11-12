zip -r -FS ../reader-Firefox.zip * --exclude *.git*  --exclude *build.*
mv manifest.json manifest.base
jq 'del(.browser_specific_settings)' manifest.base > manifest.json
zip -r -FS ../reader-Chrome.zip * --exclude *.git*  --exclude *build.* --exclude *manifest.base
rm manifest.base