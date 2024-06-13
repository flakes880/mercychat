# Mercychat

## Introduction

**MercyChat** is an advanced, user-centric chatbot specifically designed to guide and assist students and staff of IBLT University. The demo version can be access here [https://mercychat.vercel.app](https://mercychat.vercel.app) 

## Technology Used
- Next JS (Fullstack Framework)
- Vercel (Hosting)
- Supabase (Vector Storage, Authentication and Database)
- Langchain (Retrieval Augmented Generation)
- OpenAI (Large Language Model)
- Resend (Email service)

## Environmental Variables

To setup your environmental variables duplicate `.env.local.example` and rename it to `.env.local` then change the variables value to your own.

```bash
SUPABASE_SERVICE_ROLE_KEY=""
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
RESEND_API=""
OPENAI_API_KEY=""
```

## Installation

This application is run on the Node runtime. If you don't have Node server installed on your computer you need to download here [https://nodejs.org/en/download](https://nodejs.org/en/download)

You need to install all the dependency needed to run the code. Copy and paste this command to your terminal.

```bash
npm install
```

You can then start the developement server.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Setup

There two ways you can set up the database. Local database or Supabase cloud database. 

#### Local Database

- Start a local version of Supabase _(runs in Docker)_.

   ```shell
   npx supabase start
   ```

- Store the Supabase URL & public anon key in `.env.local` as stated earlier.

#### Supabase Cloud

- Create a Supabase project at https://database.new, or via the CLI:

   ```shell
   npx supabase projects create -i "MercyChat"
   ```

   Your Org ID can be found in the URL after [selecting an org](https://supabase.com/dashboard/org/_/general).

- Link your CLI to the project.

   ```shell
   npx supabase link --project-ref=<project-id>
   ```

   You can get the project ID from the [general settings page](https://supabase.com/dashboard/project/_/settings/general).

- Store Supabase URL & public anon key in `.env.local` as stated earlier.

   You can get the project API URL and anonymous key from the [API settings page](https://supabase.com/dashboard/project/_/settings/api).

## SQL migration
Apply the migration to our local database.

  ```bash
  npx supabase migration up
  ```

  or if you are developing directly on the cloud, push your migrations up:

  ```
  npx supabase db push
  ```

## Database Schema

#### Table: "documents"
- **Columns**:
  - **id** (bigint): Primary key, auto-generated.
  - **name** (text): Name of the document, cannot be null.
  - **storage_object_id** (uuid): Foreign key referencing storage.objects (id), cannot be null.
  - **created_by** (uuid): Foreign key referencing auth.users (id), defaults to auth.uid().
  - **created_at** (timestamp with time zone): Timestamp of creation, defaults to current timestamp.

#### View: "documents_with_storage_path"
- **Definition**:
  - This view retrieves documents along with their storage paths.
- **Columns**:
  - **id** (bigint): Primary key of the document.
  - **name** (text): Name of the document.
  - **storage_object_id** (uuid): Foreign key referencing storage.objects (id).
  - **created_by** (uuid): Foreign key referencing auth.users (id).
  - **created_at** (timestamp with time zone): Timestamp of creation.
  - **storage_object_path** (text): Path of the storage object associated with the document.

#### Table: "document_contents"
- **Columns**:
  - **id** (bigint): Primary key, auto-incremented.
  - **content** (text): Corresponds to Document.pageContent.
  - **metadata** (jsonb): Corresponds to Document.metadata.
  - **embedding** (vector(1536)): Represents embeddings, compatible with OpenAI embeddings. The size is 1536; adjust if necessary.

#### Table: "questions"
- **Columns**:
  - **id** (bigint): Primary key, auto-incremented.
  - **question** (text): Holds the textual content of the question.
  - **created_by** (uuid): References the ID of the user who created the question, with a default value generated from the auth.uid() function in the auth.users table.
  - **created_at** (timestamp with time zone): Indicates the timestamp when the question was created, with a default value set to the current timestamp using the now() function.

#### Table: "visitors"
- **Columns**:
  - **id** (bigint): Primary key, auto-generated, always unique.
  - **name** (text): Not null, holds the name of the visitor.
  - **email** (text): Not null, unique, stores the email address of the visitor.
  - **created_at** (timestamp with time zone): Not null, default value set to the current timestamp at the time of insertion.

#### Table: "profile"
- **Columns**:
  - **user_id** (uuid): Not null, serves as the identifier for the user profile.
  - **email** (text): Nullable, holds the email address associated with the profile.
  - **name** (text): Nullable, stores the name associated with the profile.
  - **role** (text): Default value 'subscriber', represents the role of the user, set to subscriber by default.
  - **created_at** (timestamp with time zone): Not null, default value set to the current timestamp at the time of insertion.
- **Constraints**:
  - Primary Key: (user_id)
  - Foreign Key: (user_id) references auth.users (id) on delete cascade


## Deployment on Vercel

The easiest way to deploy this app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) 

Check out the [deployment documentation](https://nextjs.org/docs/deployment) for more details.
