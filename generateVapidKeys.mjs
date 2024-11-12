import webpush from 'web-push';
import fs  from 'fs';

const vapidKeys = webpush.generateVAPIDKeys();

const envData = `
NEXT_PUBLIC_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}
NEXT_PUBLIC_VAPID_PRIVATE_KEY=${vapidKeys.privateKey}
`

console.log(envData)
fs.writeFileSync('.env', envData, { flag: 'w' });
