/**
 * Données métier : MySQL base `dzb_cake` via l’API Node (`npm run server`).
 * Schéma : `database/migrations/` + `npm run db:migrate`.
 *
 * Auth personnel : session Express (`express-session`), cookie httpOnly.
 * Routes sensibles (CRUD gâteaux, commandes, inventaire) exigent une session staff valide.
 * En production : `SESSION_SECRET` fort, HTTPS (`secure: true` sur le cookie), `FRONTEND_ORIGIN`
 * aligné sur l’URL du site, et ne pas exposer l’API sans reverse proxy / pare-feu adapté.
 */
export {}
