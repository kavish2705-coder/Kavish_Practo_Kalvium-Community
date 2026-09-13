# Google Cloud Platform Deployment Guide

This guide covers deploying the Practo Clone application to Google Cloud Platform using **Cloud Run** (for the Next.js frontend/backend API) and **Cloud SQL** (for PostgreSQL).

## Prerequisites

1.  **Google Cloud SDK (`gcloud`)** installed on your machine.
2.  A Google Cloud Project with billing enabled.
3.  The following APIs enabled in your project:
    *   Cloud Run API
    *   Cloud SQL Admin API
    *   Cloud Build API
    *   Container Registry API (or Artifact Registry API)

Enable these APIs using the command:
```bash
gcloud services enable run.googleapis.com sqladmin.googleapis.com cloudbuild.googleapis.com containerregistry.googleapis.com
```

## Step 1: Set up Cloud SQL (PostgreSQL)

1.  Create a new PostgreSQL instance:
    ```bash
    gcloud sql instances create practo-db-instance --database-version=POSTGRES_15 --cpu=1 --memory=4GB --region=us-central1
    ```

2.  Set the password for the `postgres` user:
    ```bash
    gcloud sql users set-password postgres --instance=practo-db-instance --password=YOUR_SECURE_PASSWORD
    ```

3.  Create the application database:
    ```bash
    gcloud sql databases create practo_clone --instance=practo-db-instance
    ```

4.  Get the Connection Name (needed for Cloud Run):
    ```bash
    gcloud sql instances describe practo-db-instance --format="value(connectionName)"
    ```
    *This will look like `your-project-id:us-central1:practo-db-instance`.*

## Step 2: Push Database Migrations

Before deploying the app, ensure your database schema is up-to-date. You can temporarily allow your IP to connect to Cloud SQL and run `npx prisma db push` or use a Cloud Build step specifically for migrations.

## Step 3: Deploy to Cloud Run

The repository includes a `cloudbuild.yaml` file to automate the build and deployment process.

1.  Submit the build to Cloud Build. You will need to provide your secrets via build substitutions:

    ```bash
    gcloud builds submit --config cloudbuild.yaml \
      --substitutions=_DATABASE_URL="postgresql://postgres:YOUR_SECURE_PASSWORD@/practo_clone?host=/cloudsql/YOUR_CONNECTION_NAME",_NEXTAUTH_SECRET="your-generated-secret-key",_NEXTAUTH_URL="https://your-cloud-run-url.a.run.app"
    ```

    *Note: Replace `YOUR_SECURE_PASSWORD`, `YOUR_CONNECTION_NAME`, and `your-generated-secret-key` with your actual values.*
    *Note 2: For the first deployment, you might not know your `NEXTAUTH_URL` until Cloud Run provisions the service. You can deploy it once, get the URL, and then deploy it again with the correct `NEXTAUTH_URL`.*

## Important Considerations

*   **Database URL for Cloud Run:** Notice the `host=/cloudsql/YOUR_CONNECTION_NAME` part in the `DATABASE_URL`. This is how Cloud Run securely connects to Cloud SQL using Unix sockets without exposing the database to the public internet.
*   **Security:** In a true production environment, instead of passing secrets directly via the command line (`--substitutions`), you should use **Google Cloud Secret Manager** and reference those secrets in your `cloudbuild.yaml` or directly in the Cloud Run service configuration.
