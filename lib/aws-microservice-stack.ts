import * as cdk from 'aws-cdk-lib';
import {Stack,StackProps} from 'aws-cdk-lib'
import { EventBus, Rule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';
import { SwnApiGAteway } from './apigateway';
import { SwnDatabase } from './database';
import { SwnEventsBus } from './eventbus';
import { SwnMicroservices } from './microservice';
import { SwnQueue } from './queue';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsMicroserviceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'AwsMicroserviceQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    
    const database=new SwnDatabase(this,'Database')
    
    const microservices=new SwnMicroservices(this,'Microservices',{
      productTable:database.productTable,
      basketTable:database.basketTable,
      orderTable:database.orderTable
    })
    
    const apigateway = new SwnApiGAteway(this,'ApiGateway',{
      productMicroservice: microservices.productMicroservice,
      basketMicroservice: microservices.basketMicroservice,
      orderingMicroservice:microservices.orderMicroservice
    })

    const queue = new SwnQueue(this, 'Queue', {
      consumer: microservices.orderMicroservice
    });

    const eventbus = new SwnEventsBus(this,'EventBus',{
      publisherFunction: microservices.basketMicroservice,
      targetQueue: queue.orderQueue
    })
  
   }
      }

