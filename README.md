<a href="https://ageai.sidicode.org.ng">
  <img alt="Ageai – See how well you age with AI" src="https://extrapolate.app/api/og">
  <h1 align="center">Again </h1>
</a>

<p align="center">
  See how well you age with AI
</p>

<p align="center">
  <a href="https://twitter.com/mathogram">
    <img src="https://img.shields.io/twitter/follow/mathogram?style=flat&label=steventey&logo=twitter&color=0bf&logoColor=fff" alt="Abdulakeem Twitter follower count" />
  </a>
  <a href="https://github.com/Sidicodet/Ageai">
    <img src="https://img.shields.io/github/stars/Sidicodet/Ageai?label=Sidicodet%2FAgeai" alt="Ageai repo star count" />
  </a>
</p>

<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#author"><strong>Author</strong></a>
</p>
<br/>

## Introduction

Ageai is an app for you to see how well you age by transforming your face with Artificial Intelligence. 100% free and privacy friendly.

https://user-images.githubusercontent.com/28986134/213781048-d215894d-2286-4176-a200-f745b255ecbe.mp4

## Features

- 3s GIF of your face as it ages through time 🧓
- Store & retrieve photos from [Cloudflare R2](https://www.cloudflare.com/lp/pg-r2/) using Workers
- Photos auto-delete after 24 hours (via [Upstash](https://upstash.com) qStash)

## Deploy Your Own

Note that you'll need to:

- Set up a [ReplicateHQ](https://replicate.com) account to get the `REPLICATE_API_TOKEN` env var.
- Set up an [Upstash](https://upstash.com) account to get the Upstash Redis and QStash env vars.
- Create a [Cloudflare R2 instance](https://www.cloudflare.com/lp/pg-r2/) and set up a [Cloudflare Worker](https://workers.cloudflare.com/) to handle uploads & reads (instructions below).

### Cloudflare R2 setup instructions

1. Go to Cloudflare and create an [R2 bucket](https://www.cloudflare.com/lp/pg-r2/).
2. Create a [Cloudflare Worker](https://workers.cloudflare.com/) using the code snippet below.
3. Bind your worker to your R2 instance under **Settings > R2 Bucket Bindings**.
4. For extra security, set an `AUTH_KEY_SECRET` variable under **Settings > Environment Variables** (you can generate a random secret [here](https://generate-secret.vercel.app/)).
5. Replace all instances of `images.devakimis5989.workers.dev` in the codebase with your Cloudflare Worker endpoint.

<details>
<summary>Cloudflare Worker Code</summary>

```ts
// Check requests for a pre-shared secret
const hasValidHeader = (request, env) => {
  return request.headers.get("X-CF-Secret") === env.AUTH_KEY_SECRET;
};

function authorizeRequest(request, env, key) {
  switch (request.method) {
    case "PUT":
    case "DELETE":
      return hasValidHeader(request, env);
    case "GET":
      return true;
    default:
      return false;
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.pathname.slice(1);

    if (!authorizeRequest(request, env, key)) {
      return new Response("Forbidden", { status: 403 });
    }

    switch (request.method) {
      case "PUT":
        await env.MY_BUCKET.put(key, request.body);
        return new Response(`Put ${key} successfully!`);
      case "GET":
        const object = await env.MY_BUCKET.get(key);

        if (object === null) {
          return new Response("Object Not Found", { status: 404 });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("etag", object.httpEtag);

        return new Response(object.body, {
          headers,
        });
      case "DELETE":
        await env.MY_BUCKET.delete(key);
        return new Response("Deleted!");

      default:
        return new Response("Method Not Allowed", {
          status: 405,
          headers: {
            Allow: "PUT, GET, DELETE",
          },
        });
    }
  },
};
```

</details>

## Author

- Abdulakeem ([@mathogram](https://twitter.com/mathogram))
