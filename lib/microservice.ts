import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, NodejsFunctionProps } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface SwnMicroservicesProps{
    productTable:ITable
    basketTable:ITable
    orderTable:ITable
}

export class SwnMicroservices extends Construct{
        
public readonly productMicroservice:NodejsFunction
public readonly basketMicroservice:NodejsFunction
public readonly orderMicroservice:NodejsFunction

constructor(scope:Construct, id:string,props: SwnMicroservicesProps){
             super(scope,id)
             //product microservices
             this.productMicroservice=this.createProductFunction(props.productTable);
             //Basket microservices
             this.basketMicroservice=this.createBasketFunction(props.basketTable)  

            this.orderMicroservice=this.createOrderingFunction(props.orderTable)
             

       }

       private createProductFunction(productTable: ITable):NodejsFunction{
             
        const nodeJsFunctionprops: NodejsFunctionProps={
            bundling:{
              externalModules:[
               'aws-sdk'
            ]
            },
            environment:{
                PRIMART_KEY:'id',
                DYNAMODB_TABLE_NAME:productTable.tableName
            },
            runtime:Runtime.NODEJS_14_X
           }
      
           //product lambada function
           const productFunction = new NodejsFunction(this,'productLambdaFunction',{
            entry:join(__dirname,'/../src/product/index.js'),
           ...nodeJsFunctionprops     
           })
           productTable.grantReadWriteData(productFunction)
           return productFunction;
       }

       private createBasketFunction(basketTable:ITable) : NodejsFunction{
            const basketFunctionProps:NodejsFunctionProps={
                bundling:{
                    externalModules: [
                       'aws-sdk',
                    ],
                },
                environment:{
                    PRIMARY_KEY:'userName',
                    DYNAMODB_TABLE_NAME:basketTable.tableName,
                    EVENT_SOURCE:"com.swn.basket.checkoutbasket",
                    EVENT_DETAILTYPE:"CheckoutBasket",
                    EVENT_BUSNAME:"SwnEventBus"

                },
                runtime:Runtime.NODEJS_14_X,
            }
            
            const basketFunction=new NodejsFunction(this,'basketLambdaFunction',{
                entry: join(__dirname,'/../src/basket/index.js'),
                ...basketFunctionProps,
            })
            basketTable.grantReadWriteData(basketFunction)
            return basketFunction
       }

       private createOrderingFunction(orderTable:ITable) : NodejsFunction{
        const nodeJSFunctionProps:NodejsFunctionProps={
            bundling:{
                externalModules: [
                   'aws-sdk',
                ],
            },
            environment:{
                PRIMARY_KEY:'userName',
                SORT_KEY:'orderDate',
                DYNAMODB_TABLE_NAME:orderTable.tableName,
            },
            runtime:Runtime.NODEJS_14_X,
        }
        
        const orderFunction=new NodejsFunction(this,'orderingLambdaFunction',{
            entry: join(__dirname,'/../src/ordering/index.js'),
            ...nodeJSFunctionProps,
        })
        orderTable.grantReadWriteData(orderFunction)
        return orderFunction
   }
}