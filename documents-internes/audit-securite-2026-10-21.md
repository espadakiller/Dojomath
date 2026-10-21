# Audit de securite DojoMath - 21 octobre 2026

## Perimetre et technologie

Code des routes API, sessions, stockage Supabase, paiement Stripe, reservation,
contact Resend, dependances npm et en-tetes HTTP. Domaine confirme : domaths.fr.
Le code ne contient aucun PHP, composer.json, .ovhconfig ou .htaccess : il tourne
avec Next.js/React sur Node.js, heberge sur Vercel. L'alerte PHP des 20/21 octobre
ne s'applique donc pas a cette application. Aucun hebergement PHP OVH distinct
n'a ete audite dans ce perimetre.

## Failles corrigees

1. Paiement : le parametre client_reference_id pouvait annoncer une formule plus
   chere que le paiement. Le serveur exige maintenant un paiement paid en EUR,
   le montant exact de la formule et une reference coherente avec ce montant.
2. Paiement : la liste des evenements dedupliques etait limitee a 50 et deux
   evenements pouvaient crediter la meme session. Un registre SQL persistant
   identifie chaque session Stripe et chaque evenement de maniere unique.
3. Reservations : debit de jetons et creation du cours se faisaient separement.
   Ils sont maintenant executes dans la meme transaction, avec verrouillage.
4. Comptes : une connexion ou un remboursement de debit pouvait reecrire un
   ancien solde. Les sessions modifient uniquement les champs de session ; les
   credits incrementent le solde courant sous verrou.
5. Inscriptions : une course entre deux inscriptions pouvait ecraser un compte.
   La creation utilise maintenant INSERT et l'unicite de l'adresse email.
6. Calendrier : seuls les debuts identiques etaient bloques. Le serveur et le
   calendrier verifient les intervalles complets, plus cinq minutes de battement.
7. Cours passes/annules : une requete directe pouvait demander un deplacement
   non autorise. L'API et la fonction SQL verifient le compte, l'etat et l'heure.
8. Rappels : une ecriture issue d'un ancien instantane pouvait remettre un ancien
   statut. La fonction ne modifie maintenant que reminderSentAt.
9. Tentatives abusives : le compteur en memoire etait propre a chaque instance
   Vercel. Les compteurs sont atomiques dans Supabase, avec cles hachees et delai
   d'expiration. Une limite globale par IP complete celle de chaque email.
10. Requetes : taille bornee pendant la lecture, refus des JSON null/tableaux,
    des contenus non JSON et des origines cross-site. Les en-tetes de proxy
    fournis dans la requete n'ajoutent plus une origine autorisee.
11. Robustesse : delais maximaux pour Supabase et Resend, erreurs API generiques,
    refus du stockage fichier en production si Supabase est mal configure,
    reponses privees non mises en cache, cookie de session invalide refuse.
12. Dependances : Next.js 16.2.9 -> 16.4.2, React/React DOM 19.2.4 -> 19.3.1,
    ESLint Next aligne et dependances indirectes compatibles mises a jour.
    Le verrou PostCSS obsolete a ete remplace par une version corrigee.

## Migration

`supabase-security-2026-10-21.sql` est appliquee au projet de production avec
l'accord explicite du proprietaire. Elle conserve les donnees existantes,
active RLS, retire l'acces direct anon/authenticated aux tables privees et aux
fonctions financieres, et reserve les fonctions RPC au role serveur service_role.
Les modifications de schema se font dans une transaction SQL.

## Verification

- Tests locaux : tailles JSON, JSON invalides, origines forgees, signature Stripe,
  signatures expirees, formule falsifiee, devise/montant invalides, chevauchement,
  heures ete/hiver, mots de passe et cookies invalides.
- Tests reels Supabase avec deux comptes fictifs example.invalid et dates 2099 :
  reservations concurrentes (un seul debit autorise), double evenement pour une
  session, credit simultane avec connexion, propriete d'une reservation,
  chevauchement de stage, absence de debit en cas d'echec, blocage d'un cours
  annule, reutilisation d'un creneau libere, limites de tentatives concurrentes.
- Tous les enregistrements de test ont ete supprimes ; aucun email n'a ete envoye.
- npm audit --omit=dev : zero vulnerabilite connue apres mise a jour.
- Compilation de production Next.js 16.4.2, TypeScript et ESLint verifies.

## Points restants et limites

- Cinq alertes npm de developpement correspondent a une seule chaine de
  dependances : eslint-config-next -> plugin-next -> fast-glob -> micromatch ->
  braces (GHSA-vfj7-8cjw-p6xm). npm ne propose qu'un retour incompatible a Next
  ESLint 14 pour la retirer. Pas de downgrade force. Cette chaine est absente
  des dependances de production ; suivre le correctif amont et Dependabot.
- Les cles Resend et Supabase anciennement partagees dans la conversation doivent
  etre remplacees dans Vercel et localement, puis les anciennes revoquees par le
  proprietaire. Elles ne sont pas dans les fichiers suivis par Git.
- La confirmation d'inscription est un email de bienvenue, pas une validation
  de la propriete de l'adresse email. Aucun mecanisme de reset de mot de passe
  base seulement sur un email non verifie n'a ete ajoute.
- La CSP conserve unsafe-inline pour les scripts d'hydratation Next.js ; les
  entrees utilisateur sont echappees et le JSON-LD neutralise les balises HTML.
- Aucun audit ne garantit l'absence de toute faille ; ce document couvre les
  controles effectivement realises et les scenarios testes.

## Sources officielles consultees

- https://nextjs.org/blog/nextjs-security-update-october-14-2026
- https://nextjs.org/blog/september-2026-security-release
- https://www.php.net/archive/2026.php
- https://docs.github.com/en/actions/how-tos/manage-workflow-runs/disable-and-enable-workflows
- https://vercel.com/docs/cron-jobs/usage-and-pricing
