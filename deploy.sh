yarn docs:build
cd docs/.vuepress/dist
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:Magic-Doufu/thinger.io-docs-zh-t.git master:gh-pages
cd -