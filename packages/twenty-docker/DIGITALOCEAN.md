# Hosting Twenty on DigitalOcean

Twenty runs on a plain DigitalOcean droplet with Docker Compose. This is the same setup as any other Linux host, there is no DigitalOcean-specific image.

## Requirements

- Ubuntu 22.04 or newer droplet with at least 4 GB of RAM. The server, worker, Postgres and Redis all run on the same machine, and smaller droplets can run out of memory during the first start.
- Docker with the Compose v2 plugin (`docker compose version` must work). `docker-compose` v1 is not supported.
- Optional: a domain pointing at the droplet, for HTTPS.

## Install

1. Install Docker: `curl -fsSL https://get.docker.com | sh`
2. Run the installer from an empty directory:

   ```bash
   bash <(curl -sL https://raw.githubusercontent.com/twentyhq/twenty/main/packages/twenty-docker/scripts/1-click.sh)
   ```

   It downloads `docker-compose.yml` and `.env`, generates the secrets, and starts the stack.
3. Set `SERVER_URL` in `.env` to the public URL, for example `http://<droplet-ip>:3000` or `https://crm.example.com`. The default `http://localhost:3000` only works from the droplet itself.
4. Apply the change: `docker compose up -d`.
5. Allow the port through the firewall (`ufw allow 3000`, plus any DigitalOcean cloud firewall), or put a reverse proxy such as Caddy or nginx in front on ports 80 and 443 and proxy to `localhost:3000`.

## Troubleshooting

The first start runs database migrations and can take a few minutes. The installer waits for the `twenty-server-1` container to become healthy, and the container's health check gives up after about 100 seconds.

If the installer hangs or `twenty-server-1` never becomes healthy:

```bash
docker compose ps
docker compose logs server
docker inspect --format='{{.State.Health.Status}}' twenty-server-1
dmesg | grep -i "out of memory"
```

An out-of-memory kill on a small droplet is the most common cause: resize the droplet or add swap, then run `docker compose up -d` again.

## App Platform

[`digitalocean/app.yaml`](digitalocean/app.yaml) is an App Platform spec with the server, the worker, a Postgres database and a Valkey (Redis) database. The image is pulled from Docker Hub, so nothing is built.

The "Deploy to DO" button cannot be used: it only supports a single service plus an optional dev database, and Twenty needs a worker and Redis as well. Deploy the spec directly instead.

1. Create a DigitalOcean Space and an access key. App Platform has no persistent disk, so files must go to S3-compatible storage.
2. In `app.yaml`, replace every `REPLACE_ME`: `ENCRYPTION_KEY` (`openssl rand -base64 32`, same value for server and worker) and the `STORAGE_S3_*` values for your Space. Pin `tag` to a release instead of `latest`.
3. Deploy: `doctl apps create --spec packages/twenty-docker/digitalocean/app.yaml`, or use "Import app spec" in the DigitalOcean console.

The database components are created as dev databases. For production, attach a managed cluster by adding `production: true` and `cluster_name` to each database entry.

## Going further

- Back up the `db-data` and `server-local-data` volumes, or use a DigitalOcean Managed PostgreSQL database by setting `PG_DATABASE_HOST` and the related variables in `.env`.
- For Kubernetes (DOKS), use the Helm chart in [`helm/twenty`](helm/twenty/README.md).
