# Configuration production DojoMath

## Supabase

1. Creer un projet Supabase.
2. Ouvrir SQL Editor et executer `documents-internes/supabase-schema.sql`.
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
