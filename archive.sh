rm -rf dist
export BUNDLE_NAME=$(openssl rand -hex 12)
mkdir -p dist
git archive -o "dist/$BUNDLE_NAME.zip" --format=zip HEAD
