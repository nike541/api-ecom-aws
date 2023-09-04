import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface SwnApiGAtewayProps{
    productMicroservice:IFunction,
    basketMicroservice:IFunction,
    orderingMicroservice:IFunction
}

export class SwnApiGAteway extends Construct{
   
        constructor(scope: Construct,id: string,props:SwnApiGAtewayProps){
            super(scope,id)

                //Product api gateway
                this.createProductApi(props.productMicroservice)
               //Basket api gateway
                this.createBasketApi(props.basketMicroservice)

                this.createOrderApi(props.orderingMicroservice)
              
            
        }  

        private createProductApi(productMicroservice: IFunction){
            const apigw=new LambdaRestApi(this,'productApi',{
                restApiName:'Product Service',
                handler: productMicroservice,
                proxy:false
              
              })
                
              const product =apigw.root.addResource('product');
              product.addMethod('GET');
              product.addMethod('POST');
            
              const singleproduct =product.addResource('{id}');
              singleproduct.addMethod('GET');
              singleproduct.addMethod('PUT');
              singleproduct.addMethod('DELETE');
              
        }
   
private createBasketApi(basketMicroservice: IFunction){
            
    const apigw=new LambdaRestApi(this,'basketApi',{
        restApiName:'Basket Service',
        handler: basketMicroservice,
        proxy:false
      
      })
        
      const basket =apigw.root.addResource('basket');
      basket.addMethod('GET');
      basket.addMethod('POST');
    
      const singlebasket =basket.addResource('{username}');
      singlebasket.addMethod('GET');
      singlebasket.addMethod('DELETE');
      

      const basketCheckout=basket.addResource('checkout')
      basketCheckout.addMethod('POST')

        }
        //Basket microservices api gateway
        //root name=basket
       
        private createOrderApi(orderingMicroservice: IFunction){
            
            const apigw=new LambdaRestApi(this,'orderApi',{
                restApiName:'Order Service',
                handler: orderingMicroservice,
                proxy:false
              
              })
                
              const order =apigw.root.addResource('order');
              order.addMethod('GET');
             
            
              const singleOrder =order.addResource('{username}');
              singleOrder.addMethod('GET');
              
              
                return singleOrder;
              
    }
       
}