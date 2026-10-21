# Diagnostic du 21 octobre 2026

## Domaine et hebergement

- Le site est deploye sur Vercel et repond en HTTP 200 sur https://www.domaths.fr.
- https://domaths.fr redirige vers https://www.domaths.fr.
- Le dernier commit a4d2db6 dispose d'un statut de deploiement Vercel reussi.
- dojomaths.fr et www.dojomaths.fr pointent vers 213.186.33.5 (OVH).
- http://www.dojomaths.fr affiche "Site en construction" ; HTTPS echoue.
- Il faut confirmer la propriete de dojomaths.fr dans OVH avant toute modification.

Pour raccorder ce second domaine :

1. Ouvrir le projet dojomath dans Vercel > Settings > Domains.
2. Ajouter dojomaths.fr et www.dojomaths.fr, avec redirection permanente vers
   https://www.domaths.fr afin de conserver les URLs canoniques et les paiements.
3. Dans la zone DNS OVH de dojomaths.fr, appliquer exactement les valeurs A/CNAME
   indiquees par Vercel. Retirer uniquement les anciennes entrees web en conflit.
4. Conserver les MX et les TXT email (SPF, DKIM, DMARC).
5. Attendre la propagation, puis verifier les deux noms en HTTPS et la redirection.

## Comptes et reservations

- /api/health retourne {"ok":false} en production au moment du diagnostic.
- Le nom du projet Supabase uoatmpvcuqwqxpmipgxo.supabase.co ne se resout plus.
- La pause a ete confirmee dans le tableau de bord, puis le projet a ete restaure.
- La connexion Supabase/GitHub a ete retablie par le proprietaire.
- Ne pas creer une nouvelle base vide ni remplacer les cles sans confirmer le statut.

## Cause de l'arret de la surveillance

- GitHub indique que le workflow Supabase keepalive a ete desactive apres 60 jours
  sans activite dans ce depot public.
- Derniere execution visible : #236, reussie, le 14 septembre 2026.
- La surveillance ne peut pas restaurer elle-meme un projet deja suspendu.

## Correctifs de surveillance

- vercel.json ajoute un controle quotidien de /api/health a 06:17 UTC.
- Ce controle Vercel ne depend pas de l'activite du depot GitHub.
- /api/health verifie les tables comptes ET reservations avec select=id, limit=1.
- Une panne retourne HTTP 503 et Cache-Control: no-store, sans donnees personnelles.
- Les appels Supabase expirent apres 10 secondes pour eviter les attentes indefinies.
- Le workflow GitHub reste complementaire ; le reactiver dans Actions apres connexion.
- Sur Vercel Hobby, l'heure peut varier dans l'heure planifiee.
- Les controles gratuits reduisent le risque de pause sans garantir une disponibilite
  permanente. Supabase conserve la possibilite de suspendre une offre gratuite.

## Verification apres restauration et deploiement

1. Supabase doit afficher Healthy et conserver les tables existantes.
2. https://www.domaths.fr/api/health doit retourner HTTP 200 et {"ok":true}.
3. Dans Vercel > Cron Jobs, verifier que /api/health est enregistre et executer Run.
4. Dans GitHub > Actions, reactiver Supabase keepalive et executer Run workflow.
5. Tester la connexion a un compte existant et l'affichage de ses reservations.

Sources :
- https://docs.github.com/en/actions/how-tos/manage-workflow-runs/disable-and-enable-workflows
- https://vercel.com/docs/cron-jobs/usage-and-pricing
- https://supabase.com/docs/guides/platform/free-project-pausing
