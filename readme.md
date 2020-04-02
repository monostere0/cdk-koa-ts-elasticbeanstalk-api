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

## Ts-node

Make sure you have installed both typescript and ts-node npm packages globally, as cdk uses them.

## Env vars

Set up an .env file and add the following environment variables to it

```bash
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```
