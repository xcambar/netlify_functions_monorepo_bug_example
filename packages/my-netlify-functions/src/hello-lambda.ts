import { HandlerEvent, Context } from '@netlify/functions';

export const handler = async (event: HandlerEvent, context: Context)=> {
  return { statusCode: 200, body: "Hello lambda"};
}