./archive.sh
cd cdk
cdk ls | xargs -n1 cdk deploy --require-approval never