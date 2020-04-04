# export the random zip name
export BUNDLE_NAME=$(openssl rand -hex 12)

# clean the previous builds
rm -rf dist

# build the source code
npm run build

# create the dist folder
mkdir -p dist

# archive only the files in the build dir, not its contents
cd build; zip -rq "../dist/$BUNDLE_NAME.zip" *

# go back to root
cd ..

# clean the build output
rm -rf build