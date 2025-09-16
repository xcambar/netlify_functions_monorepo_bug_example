import { HandlerEvent, Context } from '@netlify/functions';
import flipText from '@test/flip-text';

export const handler = async (event: HandlerEvent, context: Context)=> {
  return { statusCode: 200, body: flipText("Hello lambda")};
}