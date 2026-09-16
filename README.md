# openbabel.cheminfo.org

Convert a chemical structure between any pair of the formats
[Open Babel](https://openbabel.org/) reads and writes — in the browser, or from
a URL.

The repository is one npm workspace per half:

- `backend/` — a Fastify service that shells out to `obabel`, serves the REST
  API under `/v1`, its OpenAPI documentation at `/docs`, and the built frontend
  with a head written per route.
- `frontend/` — the React + Vite page: paste, draw or drop a structure, pick the
  options, and read the result with a 2D or 3D preview of it.

## Local development

```bash
npm install
npm run dev
```

`npm run dev` starts both halves: the API on `20808` and the Vite dev server on
`20809`, which proxies `/v1` and `/docs` to the API. Both ports derive from the
project's creation date, and `PORT` moves the pair together.

`obabel` must be on the machine. It is found at `/opt/homebrew/bin/obabel` or
`/usr/bin/obabel`; `BABEL` names it anywhere else.

**Open Babel 3.2 or newer.** It is the first release that reads ChemDraw's
current CDXML with its bond orders intact — 3.1.1 turns aspirin into a radical
with no aromatic ring. The image installs it from Debian sid, since trixie and
Ubuntu still ship 3.1.1. On an older binary the CDXML test skips rather than
pin the wrong answer.

```bash
npm test        # unit tests, type-check, colour tokens, eslint, prettier
npm run test-e2e  # Playwright; run `npx playwright install chromium` in frontend/ once
npm run build     # the frontend, into frontend/dist
```

## Configuration

Every variable is documented in `.env.example`; copy it to `.env` and edit.
The ones worth knowing:

| Variable                   | What it does                                                                                                   |
| -------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `PORT`                     | Port the API listens on. The dev server takes `PORT + 1`.                                                      |
| `SITE_URL`                 | Where the site is served, written into every canonical address and social card. Behind a proxy, set it.        |
| `TRUST_PROXY`              | The proxies whose `X-Forwarded-For` is believed. An address, a CIDR range, a comma-separated list, or `true`.  |
| `TRACKING_SCRIPT`          | Audience-measurement snippet, injected verbatim at the end of the served page's `<head>`. Unset loads nothing. |
| `BABEL`                    | Path to the `obabel` binary. Auto-detected when unset.                                                         |
| `MAX_PARALLEL_CONVERSIONS` | How many `obabel` processes run at once (default 4).                                                           |
| `MAX_QUEUED_CONVERSIONS`   | How many wait before the API replies `503` (default 32).                                                       |
| `CONVERSION_TIMEOUT_MS`    | When a running conversion is killed (default 2000).                                                            |

A conversion killed by the timeout says so in the response `log` rather than
failing silently.

## The API

Everything the page does, a URL does too.

| Route                        | What it answers                                                                                    |
| ---------------------------- | -------------------------------------------------------------------------------------------------- |
| `GET/POST /v1/convert`       | The conversion itself: `inputFormat`, `outputFormat`, and the hydrogen, pH and coordinate options. |
| `GET /v1/formats`            | Every format, read and written, in one answer.                                                     |
| `GET/POST /v1/inputFormats`  | The formats it reads.                                                                              |
| `GET/POST /v1/outputFormats` | The formats it writes.                                                                             |
| `GET /v1/health`             | The liveness probe the deploy script reads.                                                        |
| `GET /docs`                  | Swagger UI for all of the above.                                                                   |

The parameters arrive either as a query string or as a `multipart/form-data`
body, which is how the page sends a file.

## Sharing and embedding

Every page is a real address — `/` is the converter, `/about` is what the tool
is built on — and the Share button writes the link or the `<iframe>` snippet.
A link can also frame the tool and switch parts off by name:

```
https://openbabel.cheminfo.org/?embed&hide=log,help&input=draw
```

`?embed` drops the site chrome a host page already carries, `?hide=` takes the
options, help, preview or log panel off, and `?input=` opens the converter on
the typed, drawn or dropped input.

## Deployment with Docker

The image is published at `ghcr.io/cheminfo/openbabel.cheminfo.org`. The
deployment mode is chosen with `COMPOSE_FILE` in `.env`; with none set,
`docker compose` uses `compose.yaml`, which publishes the port on the host.

```bash
git clone https://github.com/cheminfo/openbabel.cheminfo.org
cd openbabel.cheminfo.org

cp .env.example .env

# Run the released image:
docker compose pull && docker compose up -d

# Or rebuild from the current checkout:
docker compose up -d --build
```

Open <http://localhost:20808/> for the converter, or
<http://localhost:20808/docs> for the Swagger UI.

### Behind a Cloudflare Tunnel

Uncomment `COMPOSE_FILE=compose.cloudflared.yaml` in `.env`, then in the
Cloudflare dashboard (<https://dash.cloudflare.com>):

1. **Networking → Tunnels → Create a tunnel → Cloudflared connector**.
2. Copy the generated token into `.env` as `TUNNEL_TOKEN=...`.
3. Open the tunnel, go to the **Published applications** tab, and add an
   application with:
   - **Public hostname**: `openbabel.lactame.com` (or another domain you control)
   - **Service type**: HTTP
   - **Service URL**: `openbabel:20808` (match `PORT` from `.env`)

Then `docker compose up -d`. No port is published on the host.

### Behind Traefik

For a host already running [Traefik](https://traefik.io/) on an external Docker
network named `traefik`, with a `websecure` entrypoint and a `letsencrypt` cert
resolver, uncomment `COMPOSE_FILE=compose.traefik.yaml` in `.env` and run
`docker compose up -d`. Adjust the `Host(...)` label in `compose.traefik.yaml`
to the hostname you have configured (default `openbabel.cheminfo.org`).

## License

[MIT](./LICENSE)

Open Babel is distributed under [its own license](https://github.com/openbabel/openbabel/blob/master/COPYING).
