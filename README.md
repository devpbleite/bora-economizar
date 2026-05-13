# Bora Economizar

Web app mobile-first para controle financeiro familiar.

## Stack

- React + Vite + TypeScript
- Vercel para deploy
- Vercel Functions para a API
- NeonDB/Postgres para persistencia
- Lucide React para icones
- Recharts para graficos

## Rodando localmente

```bash
npm install
npm run dev
```

Quando o NeonDB estiver configurado, copie `.env.example` para `.env.local` e preencha `DATABASE_URL`.

## Banco de dados

Com `DATABASE_URL` configurado:

```bash
npm run db:migrate
```
