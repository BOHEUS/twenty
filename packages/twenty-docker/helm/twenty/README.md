# Twenty Helm Chart

Deploy Twenty CRM on Kubernetes with server, worker, PostgreSQL, and Redis components.

## Features
- Server and worker deployments with full env exposure via `values.yaml`.
- Internal PostgreSQL (Spilo) and Redis deployments included.
- PVC-based persistence using dynamic storage classes (no static PV manifests).
- Ingress with configurable annotations, hosts, and TLS.
- Database readiness and migrations handled by server/worker init containers by default.
– Standard Kubernetes Jobs for DB creation/user and migrations have been removed to simplify installs. Readiness and migrations run in init containers.

## Quick Start

See [QUICKSTART.md](QUICKSTART.md) for a simple 2-line install with your domain.

## Installing

**Prerequisites:** Kubernetes 1.21+, Helm 3.8+, default StorageClass

Internal DB + Redis (default):
```bash
helm install my-twenty ./packages/twenty-docker/helm/twenty \
  --namespace twentycrm --create-namespace
```

External DB/Redis:
```bash
helm install my-twenty ./packages/twenty-docker/helm/twenty \
  --namespace twentycrm --create-namespace \
  --set db.enabled=false \
  --set db.external.host=db.example.com \
  --set redisInternal.enabled=false
```

## Key Values


See `values.yaml` for a comprehensive list.

## Notes

- Database URL and Redis URL are composed automatically from chart settings
- Database `twenty` and schema `core` are created automatically by server init container
- No optional jobs: the chart no longer provides separate Jobs for DB or migrations.
- Access token auto-generated (32 chars) if not provided; reuses existing secret if present
  - For production, provide a strong `secrets.tokens.accessToken` value via a secure values file; the auto-generated token is a convenience fallback.
- TLS enabled by default via cert-manager (`acme: true`)
- Requires default StorageClass for PVC provisioning
## Upgrading

Twenty migrates itself. The server container's entrypoint runs `cache:flush`, then `yarn command:prod upgrade`, then `cache:flush` again on every start, so upgrading the instance means rolling out a server pod with a newer image. Do not run the upgrade command by hand and do not look for a migration Job: the chart has none.

### Procedure

1. **Back up PostgreSQL.** `helm rollback` restores the old image but not the schema, and Twenty does not support downgrades. For the bundled database:
   ```bash
   kubectl exec deploy/<release>-twenty-db -- pg_dumpall -U postgres > databases_backup.sql
   ```
   For an external database, use your provider's snapshot or backup tooling.
2. **Read the release notes and the [upgrade guide](https://docs.twenty.com/developers/self-host/capabilities/upgrade-guide)** for your target version. Examples at the time of writing:
   - v2.34+ needs PostgreSQL 15 or newer. Upgrade an external database before the server.
   - v2.5 stores at-rest secrets under `ENCRYPTION_KEY`. Set a dedicated key (via `server.extraEnv` and `worker.extraEnv`) before upgrading, and keep it afterwards.
3. **Pick the target version.** You can jump straight from any version since v1.23 to the latest release. Older versions must first go to the version named in the error message ("Please upgrade to X first").
4. **Pin the image tag explicitly.** `Chart.yaml`'s `appVersion` is only the default and can lag behind releases:
   ```bash
   helm upgrade my-twenty ./packages/twenty-docker/helm/twenty -f values.yaml --set image.tag=vX.Y.Z
   ```
   The server and worker share `image.tag`. Per-component overrides (`server.image.tag`, `worker.image.tag`) should be left unset so they never run different versions.
5. **Watch the rollout.**
   ```bash
   kubectl logs deploy/<release>-twenty-server -f
   kubectl exec deploy/<release>-twenty-server -- yarn command:prod upgrade:status
   ```
   The worker's `wait-for-server` init container waits for the server's `/healthz`, which only answers after the entrypoint upgrade finishes, so the new worker starts after the migration.
6. **Verify.** `upgrade:status` should report the instance and every workspace as up to date. The entrypoint only logs a warning when `upgrade` fails and the server still boots, so a Ready pod does not prove the upgrade succeeded. Use `-f` to show only failed workspaces.

### What to expect

- **Downtime.** With server persistence enabled (the default), the server Deployment uses the `Recreate` strategy, so there is a short outage per rollout. Without PVCs it uses `RollingUpdate`, and old pods keep serving against the migrated schema until they are replaced.
- **Keep the server at one replica during upgrades.** Every new pod runs the upgrade on startup and the chart does not guard against concurrent runs.
- **Long migrations.** Some versions run slow data backfills on first boot. The server startup probe allows about 5 minutes (10s x 30). If the pod is restarted mid-upgrade, it resumes from the last recorded command, but it can loop. Raise the budget before large jumps:
  ```yaml
  server:
    startupProbe:
      failureThreshold: 180   # 30 minutes
  ```
- **Interrupted or failed upgrades.** Rerunning is safe: nothing is rolled back and the upgrade resumes from the last command stored in `upgradeMigration`. Check the server logs, fix the cause, then restart the server pod.
- **Rolling back.** Restore the database backup first, then `helm rollback` (or install the old tag). Rolling back only the image against a migrated schema is unsupported.
- **GitOps (Argo CD, Flux, `helm template`).** Generated passwords and tokens rely on a live cluster lookup, which these tools do not have, so each sync may generate new values. Set `secrets.tokens.accessToken`, `db.internal.appPassword` and `db.internal.env.PGPASSWORD_SUPERUSER` explicitly (or use external secrets) before upgrading this way. A changed `APP_SECRET` invalidates sessions and anything encrypted with it.
- **Manual runs.** Only needed if you set `DISABLE_DB_MIGRATIONS=true` on the server. Run the upgrade detached so a dropped `kubectl exec` session cannot kill it:
  ```bash
  kubectl exec deploy/<release>-twenty-server -- yarn command:prod:background upgrade
  kubectl exec deploy/<release>-twenty-server -- yarn command:prod:background:logs
  ```

## Testing

```bash
helm lint ./packages/twenty-docker/helm/twenty
helm template my-twenty ./packages/twenty-docker/helm/twenty
helm plugin install https://github.com/quintush/helm-unittest
helm unittest ./packages/twenty-docker/helm/twenty
```

## Storage

**Local (default):** Uses PVCs for persistence

**S3:** Set `storage.type=s3` and provide credentials using a values file. You can either pass credentials directly or reference an existing Kubernetes Secret.
```bash
# values-secrets.yaml (do not commit)
# storage:
#   type: s3
#   s3:
#     bucket: my-bucket
#     region: us-east-1
#     # Option A: direct values
#     accessKeyId: AKIA...
#     secretAccessKey: ...
#     # Option B: reference a Secret
#     # secretName: my-s3-creds
#     # accessKeyIdKey: accessKeyId
#     # secretAccessKeyKey: secretAccessKey

helm install my-twenty ./packages/twenty-docker/helm/twenty -f values-secrets.yaml
```

## Production Tips

- **Image versioning:** The chart defaults to `Chart.yaml`'s `appVersion` (currently v1.14.0). Override via `image.tag` in values to pin a different version or use `latest` for rolling updates.
- **Keep secrets secure:** Avoid `--set` for sensitive values; use `-f values-secrets.yaml` or reference existing Kubernetes Secrets via `server.extraEnvFrom`.
  - S3 credentials can be referenced via `storage.s3.secretName + accessKeyIdKey/secretAccessKeyKey` to avoid embedding them in pod specs.
- **Cloud IAM via ServiceAccount:** Server and worker pods run under the namespace's `default` ServiceAccount unless `serviceAccount.create=true`, which creates a dedicated one named after the release (or `serviceAccount.name`, if set). Grant cloud permissions (e.g. S3 access) without static credentials by enabling it and annotating it:
  ```yaml
  serviceAccount:
    create: true
    annotations:
      eks.amazonaws.com/role-arn: arn:aws:iam::123456789012:role/twenty-role   # AWS IRSA
      # iam.gke.io/gcp-service-account: twenty@my-project.iam.gserviceaccount.com  # GCP Workload Identity
  ```
  Set `serviceAccount.automount=false` to skip mounting the Kubernetes API token; the server and worker never call the API, and IRSA / Workload Identity keep working.
