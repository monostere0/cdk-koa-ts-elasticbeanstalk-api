cdk_deploy() {
  # check if $BUNDLE_NAME env var exists
  if [[ ! -z "$BUNDLE_NAME" ]]
  then 
    echo "Deploying stacks to AWS:$AWS_REGION..."
    cd cdk
    cdk ls | xargs -n1 cdk deploy --require-approval never
  else
    echo "Could not find the BUNDLE_NAME environment variable."
  fi
}

 # check if the environment is CI
if [[ ! -z "$CI" ]]
then
  # only deploy if the environment is CI and the branch is master
  if [[ "$CIRCLE_BRANCH" = "master" ]]
  then
    cdk_deploy
  else
    echo "CDK Deployments only run on commits to master"
  fi
# if the environment is not CI, run without checking
# the branch name
else
  cdk_deploy
fi
