---
date: 2026-05-25
title: "Turning a YouTube DJ set into a Spotify playlist with Azure AI Foundry"
cover: "https://unsplash.it/400/300/?random?music"
slug: playlist-creator
categories:
    - Side Projects
    - Azure
    - React
    - TypeScript
tags:
    - React
    - TypeScript
    - Azure Functions
    - Azure AI
    - Spotify
---

You know the feeling. You stumble onto a two-hour YouTube DJ set that absolutely slaps. You want it on Spotify. Forty-five minutes later you are squinting at a timestamped description, alt-tabbing between tabs, second-guessing every "feat." spelling, and questioning your life choices. By track 12 you have given up.

I have lost that fight one too many times, so I built a small app to let the computer do the squinting. Paste a YouTube URL, get a Spotify playlist.

The source code is here:

**<https://github.com/goncalvesj/playlist-creator>**

The app itself runs on Azure Static Web Apps, but it is currently locked to my Spotify developer app's allowlist for personal use, so there is no public link to share.

## How it works

The flow is three steps from the user's point of view:

1. Sign in with Spotify.
2. Paste a YouTube URL.
3. Review the matched tracks, then create the playlist in your account.

Under the hood there are two clear halves:

- Track extraction runs server-side in an Azure Function. It fetches the YouTube video description via the YouTube Data API and asks Azure AI Foundry to pull a clean tracklist out of it.
- Spotify search and playlist creation run in the browser, using the user's own signed-in token. The app never sees Spotify credentials and the Foundry/YouTube secrets never leave the server.

```text
Azure Static Web App
 |-- /                          Vite + React SPA (Spotify PKCE, search, playlist creation)
 `-- /api/extract-tracklist     Azure Function (Node 20)
     |-- YouTube Data API v3    Reads the video description
     `-- Azure AI Foundry       Structured-output tracklist extraction
```

## The tracklist extraction

The interesting bit is asking the model for structured JSON, not free text. The function does roughly this:

1. Apply a per-client rate limit and a short-lived per-video cache.
2. Validate the body with Zod and resolve the YouTube video ID from any of the supported URL forms.
3. Fetch the video snippet from the YouTube Data API and confirm the description actually looks like a tracklist (timestamps or ` - ` separators across at least a few lines).
4. Call Azure AI Foundry's v1 Responses API with a strict JSON schema, `temperature: 0`, and a prompt that explicitly tells the model to only return tracks that appear in the description.

The response comes back already shaped, so the function just validates and returns it:

```json
{
  "videoId": "abc123",
  "videoTitle": "Boiler Room: Artist Name | Live Set",
  "channelTitle": "Boiler Room",
  "source": "description",
  "confidence": "high",
  "tracks": [
    { "artist": "Daft Punk", "title": "Around the World (Alex Gopher Remix)", "timestamp": "00:12:34" }
  ]
}
```

## Spotify matching in the browser

Once the SPA has the tracklist, it calls Spotify's search API for each track and picks the best match. A couple of small things that made a big difference:

- Using `fast-fuzzy` to score candidate matches so "feat.", "ft.", apostrophes and remix tags do not throw off the choice.
- Using `p-limit` to cap concurrency so the Spotify rate limit does not get hammered when a 30-track set lands.
- Letting the user review matches and uncheck anything they do not want before the playlist is created.

Auth uses Spotify's PKCE flow, so there is no client secret in the browser and no backend session to maintain.

## The tech stack

- Frontend: Vite, React, TypeScript, React Router, TanStack Query, Tailwind v4, `@spotify/web-api-ts-sdk`, `fast-fuzzy`, `p-limit`, Workbox PWA service worker.
- Backend: Azure Functions v4 on Node 20, the `openai` SDK pointed at Azure AI Foundry's v1 Responses API, Zod for validation.
- Hosting: Azure Static Web Apps with the Functions app as the linked API.
- Telemetry: Application Insights web SDK in the browser, OpenTelemetry with the Azure Monitor exporter on the Functions side.

## A few things I would call out

- It is a PWA. The frontend is installable, ships a Workbox service worker for fast repeat loads, and registers a web share target so a YouTube link shared from the Android YouTube app can drop straight into the page.
- Telemetry is privacy-conscious by design. Playlist names, raw YouTube URLs, Spotify tokens, prompts and model responses are never logged. Video IDs are hashed before they leave the function.
- There is a local quirk worth knowing about: the Static Web Apps CLI injects a `traceparent` with the "not sampled" flag when proxying `/api/*`, which silently drops every backend span under the default OTel sampler. The local settings override this with `OTEL_TRACES_SAMPLER=always_on` for dev only.

## Limitations

Honest about what it does not do:

- It only extracts tracklists that already exist as text in the YouTube description. No captions, no comments, no OCR, no audio fingerprinting.
- There is no history. Each conversion is a one-shot.
- Spotify is in Development Mode, so each user has to be added explicitly to the Spotify app's allowlist. It is not a public multi-tenant product and was never meant to be.

If you want to see how the pieces fit together, or fork it for your own use, the repo is here:

**<https://github.com/goncalvesj/playlist-creator>**
