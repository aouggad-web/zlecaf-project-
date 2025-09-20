# zlecaf.online — Pack Netlify (v3.1)

## Ce pack contient
- `index.html` : l'app prête à l'emploi (aucune compilation).

## Déploiement par glisser‑déposer (Netlify)
1) Ouvrez https://app.netlify.com/ et connectez‑vous.
2) Cliquez **Add new site → Deploy manually**.
3) Glissez‑déposez ce dossier (ou le ZIP) dans la zone d’upload.
4) Netlify publie une URL du type `https://<nom>.netlify.app` (immédiat).

## Relier le domaine `zlecaf.online`
1) Sur la page de votre site Netlify : **Site settings → Domain management → Add domain**.
2) Entrez `zlecaf.online` puis **Verify** / **Add domain**.
3) Choisissez l'une des options proposées par Netlify :
   - **Netlify DNS (recommandé)** : Netlify vous donnera des serveurs DNS à configurer chez votre registrar.
     Une fois propagé, l’HTTPS (Let’s Encrypt) s’installe automatiquement.
   - **External DNS** : gardez votre DNS actuel et créez un **CNAME** `www` → l’URL `xxxxx.netlify.app` fournie.
     (Si vous souhaitez que `zlecaf.online` redirige vers `www.zlecaf.online`, marquez `www.zlecaf.online` comme domaine primaire dans Netlify.)
4) Attendez la validation SSL automatique, votre site sera servi en HTTPS.

## Notes
- Le fichier s’appuie sur des CDN (Chart.js & Tailwind). Aucun build requis.
- Pour un mode 100% “sans CDN”, dites‑le moi et je vous fournis un pack avec les JS en local.
