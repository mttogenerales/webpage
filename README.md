# mantenimientogenerales.com

Sitio web de **Mantenimientos Generales 2100, C.A.** — estático (HTML + CSS + JS), sin build.

## Estructura
```
index.html          landing
creditos.html       atribución de fotografías (obligatoria por licencias CC BY / CC BY-SA)
css/styles.css      estilos
js/main.js          menú móvil
assets/img/         fotografías optimizadas (Wikimedia Commons, licencias libres)
assets/logo.png     logo
CNAME, .nojekyll, robots.txt, sitemap.xml
```

## Publicar en GitHub Pages
1. Subir todos los archivos a la rama `main` de un repositorio.
2. Settings → Pages: Source = *Deploy from a branch*, Branch = `main` / `/ (root)`.
3. Settings → Pages → Custom domain: `mantenimientogenerales.com` y activar *Enforce HTTPS*.
4. DNS del dominio: registros **A** de `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; **CNAME** de `www` → `<usuario>.github.io`.

## Formulario de contacto
Usa FormSubmit hacia `info@mantenimientogenerales.com`. La primera vez FormSubmit envía un correo de activación a ese buzón: confirmarlo una sola vez. Para otro destino, cambiar el `action` del `<form>` en `index.html`.

## Fotografías propias
Cuando tengan fotos de obra, reemplazar los archivos de `assets/img/` manteniendo el nombre (o editar los `src` en `index.html`) y eliminar la entrada correspondiente de `creditos.html`.
