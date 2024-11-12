import { Mongo } from '@dsv911/ez'
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

webpush.setVapidDetails(
  'mailto:dsvdarkside@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY
)
let subscription: webpush.PushSubscription
export async function POST (request: NextRequest)
{
  
  return await setSubscription(request)
}

async function setSubscription (request: NextRequest)
{
  const data = await request.json()
  console.log("test setSubscription", data)
  const body: { subscription: webpush.PushSubscription } = await request.json()
  subscription = body.subscription
  const test = await Mongo.Watch('agTransaction', "bo")
  if (test)
  {
    console.log("test Mongo", test)
    return new Response(JSON.stringify({ message: 'Subscription set.' }), {})
  }

}

async function sendPush (request: Request)
{
  const body: { subscription: webpush.PushSubscription } = await request.json()
  const pushPayload = JSON.stringify(body)
  await webpush.sendNotification(subscription, pushPayload)
  return new Response(JSON.stringify({ message: 'Push sent.' }), {})
}
