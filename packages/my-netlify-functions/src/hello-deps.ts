import { Context } from '@netlify/functions';
import flipText from '@test/flip-text';

export default (request: Request, context: Context)=> {
  return new Response(flipText("Hello world"), { status: 200});
}