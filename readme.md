# Gigs.tech API

This application is deployed through AWS Elastic Beanstalk via Docker.
Make sure you've got AWS CDK installed locally, after that you can do

```
cd cdk
cdk bootstrap
cdk synth
cdk deploy
```

Which will deploy the API to http://api.gigs.tech