# mantenimientogenerales.com

Landing page de **Mantenimientos Generales 2100, C.A.** — sitio estático (HTML + CSS + JS), sin build ni dependencias que instalar.

## Estructura
```
index.html        página principal (landing)
css/styles.css    estilos
js/scene.js       escena 3D del hero (Three.js vía CDN)
js/main.js        menú móvil
assets/           logo
CNAME             dominio personalizado para GitHub Pages
.nojekyll         evita el procesamiento Jekyll
robots.txt / sitemap.xml
```

## Publicar en GitHub Pages
1. Crear un repositorio (p. ej. `mantenimientogenerales.com`) y subir todos estos archivos a la rama `main`.
2. En **Settings → Pages**: Source = *Deploy from a branch*, Branch = `main` / `/ (root)`.
3. En **Settings → Pages → Custom domain** escribir `mantenimientogenerales.com` y activar *Enforce HTTPS* (el archivo `CNAME` ya está incluido).
4. En el proveedor del dominio configurar DNS:
   - Registros **A** para `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Registro **CNAME** para `www` → `<usuario>.github.io`

## Formulario de contacto
El formulario usa [FormSubmit](https://formsubmit.co) apuntando a `info@mantenimientogenerales.com`. La primera vez que alguien envíe, FormSubmit mandará un correo de activación a esa cuenta: hay que confirmarlo una sola vez. Para cambiar el correo destino, editar el atributo `action` del `<form>` en `index.html`.

## Editar contenido
Todo el texto está en `index.html`. El correo `info@mantenimientogenerales.com` aparece en los `mailto:`, en el formulario y en el JSON-LD del `<head>`.

## Para el futuro
- Sustituir las ilustraciones SVG de servicios por fotografías reales de obra: basta reemplazar cada `<svg>` dentro de `.svc__art` por `<img src="assets/fotos/...jpg">`.
- Añadir Google Analytics / Search Console pegando el snippet antes de `</head>`.
