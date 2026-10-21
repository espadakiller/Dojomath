# Configuration production DojoMath

## Supabase

1. Creer un projet Supabase.
2. Ouvrir SQL Editor et executer `documents-internes/supabase-schema.sql`.
   Executer ensuite `documents-internes/supabase-security-2026-10-21.sql`.
   Cette migration est requise avant de deployer les routes securisees.
3. Ajouter ces variables dans l'hebergeur du site :

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_URL` se trouve dans les reglages API du projet Supabase.
`SUPABASE_SERVICE_ROLE_KEY` doit rester cote serveur uniquement.

## Emails automatiques

Le site envoie un email apres creation de compte et apres reservation via Resend.

1. Creer un compte Resend.
2. Verifier le domaine d'envoi, par exemple `dojomath.fr`.
3. Creer une API key.
4. Ajouter ces variables dans l'hebergeur :

```env
RESEND_API_KEY=
EMAIL_FROM="DojoMath <reservation@dojomath.fr>"
```

Tant que `RESEND_API_KEY` ou `EMAIL_FROM` manque, les emails sont ignores sans bloquer les inscriptions ni les reservations.

## Surveillance et mises a jour

`vercel.json` configure un controle quotidien de `/api/health` a 06:17 UTC.
Verifier son activation dans Vercel > Cron Jobs apres le deploiement.
GitHub Actions reste complementaire : les executions planifiees d'un depot public
peuvent etre desactivees apres 60 jours sans activite.

Avant chaque publication, executer `npm run lint`, `npm run test:security` et
`npm run build`. `npm audit --omit=dev` controle les dependances de production.
Dependabot propose des mises a jour hebdomadaires a relire et tester avant fusion.

Le test reel `node scripts/verify-storage-security.mjs` cree puis supprime des
donnees fictives dans le projet configure. Il doit etre lance seulement avec
l'accord explicite du proprietaire du projet.
