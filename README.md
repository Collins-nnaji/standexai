# StandexAI Content Analysis Workbench (Neon + OpenAI)

This app is now a persisted MVP for regulated-content operations:

- Create and store documents in Neon Postgres
- Run 4 AI agents (SEO/GEO/E-E-A-T/Metadata)
- Persist every analysis run and scores
- Review run history per document

## 1) Install

```bash
npm install
```

## 2) Configure environment

Create `.env.local`:

```bash
cp .env.example .env.local
```

Set values:

- `DATABASE_URL`: your Neon pooled or direct Postgres URL
- `OPENAI_API_KEY`: your OpenAI key
- `OPENAI_MODEL` (optional): default is `gpt-4.1-mini`

## 3) Set up Neon schema

Use Prisma to create tables:

```bash
npm run prisma:generate
npm run prisma:push
```

If you prefer migrations locally:

```bash
npm run prisma:migrate
```

## 4) Run app

```bash
npm run dev
```

Open `http://localhost:3000`.

## API endpoints

- `GET /api/documents` - list documents with latest run summary
- `POST /api/documents` - create document `{ title, content }`
- `GET /api/documents/:id` - fetch document + run history
- `PATCH /api/documents/:id` - update title/content
- `GET /api/documents/:id/runs` - list all runs
- `POST /api/runs` - run all agents for a document `{ documentId }`
- `POST /api/analyze` - stateless single-pass analysis `{ content }`

## Stack

- Next.js App Router
- Prisma ORM
- Neon PostgreSQL
- OpenAI Chat Completions with strict JSON schema outputs
