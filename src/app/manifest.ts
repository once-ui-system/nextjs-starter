import { MetadataRoute } from 'next'

export default function manifest (): MetadataRoute.Manifest
{
  return {
    "name": "BoDarinBet",
    "short_name": "Darin.BET",
    "description": "",
    "display": "standalone",

    "icons": [
      {
        "src": "/image/web-app-manifest-192x192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/image/web-app-manifest-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ],
    "start_url": "/login",
    "background_color": "#000000",
    "theme_color": "#4C1C70",


    "id": "BoDarinBet",
    "lang": "th",
    "display_override": [
      "fullscreen",
      "standalone",
      "window-controls-overlay",
      "browser"
    ],
    "categories": [
      "games"

    ]

  }

}
