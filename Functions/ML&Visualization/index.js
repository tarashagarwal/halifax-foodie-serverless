'use strict';

// Defining required global constants
const AWS = require('aws-sdk');
const { storage } = require('@google-cloud/storage');
const { bigQuery } = require('@google-cloud/bigquery');
AWS.config.update({region: "us-east-1"});
let s3 = new AWS.S3();

//setting up the environment variables in the config file
let config = require('./config.json');
const environment = process.env.ENVIRONMENT;

exports.handler = async (event, context) => {
     let tables = config.Tables;
     for (const table of tables) {
               try {
                    let data = await processEvent(event.Records);
                    context.succeed(data);
               } catch (e) {
                    context.done(e);
               }
     };
};

// this returns data from the bigQuery
let processEvent = async (Records) => {
     // Getting the Google credentials:
     let googleCreds = await getGC();
     let creds = await s3.getObject({Bucket: config.cred_bucket, Key: config.cred_s3_obj}).promise();
          var chunk = creds.Body.toString();
          let googleKey = JSON.parse(chunk).private_key.split("\\n");
     // executing the BigQuery job:
     try {
          let results = await queryBQ(googleCreds);
          console.log(results);
     } catch (error) {
          console.log(error);
          };
     return 'Success'  ;
};

// this gets the google creds from s3 bucket created that store the google keys
let getGC = async () => {
     return googleKey;
}
;
// Queries BigQuery
let queryBQ = async (googleCreds) => {
     //Create GCS object
     const bigquery = new BigQuery({
          projectId: config.gcp_project_id,
          credentials: {
               client_email: config.gcp_client_email,
               private_key: googleCreds[0]
          }
     });
     const query = ` create or replace table ML_Predict as (SELECT * FROM ML.PREDICT(MODEL csci5408-365812.s3_recipe_data.automl_recipe,
                    (select tag, name,id from s3_recipe_data.s3_data where RAND() < 10 and tag != 'pork')))
   \`;`
     const options = {
          query: query,
          location: 'us-east-1',
          };
     try {
          // Run the query as a job
          // Wait for the query to finish
           // Print the results and save to S3:
          const [job] = await bigquery.createQueryJob(options);
          console.log(`Job ${job.id} started.`);
          const [rows] = await job.getQueryResults();
          rows.forEach(row => console.log(row));
          let res = rows.reduce( (name,predicted_lable,predicted_prob) => { return name + `${predicted_lable},${predicted_prob}\n`}, "");
          return `name,${predicted_lable},${predicted_prob}`.concat(res);
     } catch (error) {
          console.log(error);
     }
};


// Reference from : https://zapier.com/apps/aws-lambda/integrations/google-bigquery
