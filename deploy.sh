# only run CDK if the archive bundle name is set
if [[ ! -z "$BUNDLE_NAME" ]]
then 
  cd cdk
  cdk ls | xargs -n1 cdk deploy --require-approval never
else
  echo "Could not find the BUNDLE_NAME environment variable."
fi
