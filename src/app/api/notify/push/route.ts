
import { MongoDb, PusherNotification } from '@dsv911/ez'
import { NextRequest } from "next/server";
import * as webpush from 'web-push'


if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)
{
  throw new Error('Invalid/Missing environment variable: "NEXT_PUBLIC_VAPID_PUBLIC_KEY"')
}

if (!process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY)
{
  throw new Error('Invalid/Missing environment variable: "NEXT_PUBLIC_VAPID_PRIVATE_KEY"')
}
if (!process.env.NEXT_PUBLIC_GCM_PUBLIC_KEY)
{
  throw new Error('Invalid/Missing environment variable: "NEXT_PUBLIC_GCM_PUBLIC_KEY"')
}
webpush.setGCMAPIKey(process.env.NEXT_PUBLIC_GCM_PUBLIC_KEY)




export async function POST (request: NextRequest)
{
  
  console.log("sendPush" + request.text)
      return await sendPush(request)
   
}
/* 
export function GET (request: NextRequest,
)
{

  return new Response(JSON.stringify({ message: 'Push sent.' }), {})
} */

async function sendPush (request: NextRequest)
{
  try
  {
    
    const subUser = await MongoDb.find<webpush.PushSubscription>('subscribeUser','bfx',{},{projection:{endpoint:1,keys:1}})
    const body = await request?.json()
    console.log("subUser" + subUser)
    const { title, message } = body
    console.log("pushPayload", title, message)
    subUser?.map(async (subscription: any) =>
    {
      console.log("subscription=", { ...body, subScription: subscription })
      return PusherNotification({...body,subScription:subscription})
    })
 
    return new Response(JSON.stringify({ message: 'Push sent.' }), { status: 200 })
  }
  catch (e)
  {
    log("ERROR", e)
    return new Response(JSON.stringify({ message: 'Error' }), { status: 405 })
  }
}
