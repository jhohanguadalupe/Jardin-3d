# Jardín 3D

Recorrido web en Three.js inspirado en el plano compartido (terreno de 32,22 × 25,50 m), delimitado por muros y situado sobre Calle P.

## Abrir

Abre PowerShell en esta carpeta y ejecuta:

```powershell
python -m http.server 8000
```

Luego abre <http://localhost:8000>. La escena importa Three.js desde jsDelivr, así que requiere conexión a internet.

## Recorrido

- Arrastra para mirar y usa la rueda para acercar o alejar.
- Pulsa **WASD** o las flechas para caminar.
- Usa **Ambientes**, **El patio** y **Juegos** para ir a cada zona.
- El recorrido queda dentro del terreno amurallado; la calle y las casas cercanas se ven como contexto.
- La rueda del ratón permite alejarse; **Vista general** muestra el predio y Calle P desde arriba.
- Los rótulos flotantes identifican cada área y los letreros físicos indican el acceso, la dirección y la zona infantil.
- Se añadieron señales de salida y ruta de evacuación, zona segura, punto de reunión, primeros auxilios y extintor. La guía de señalización de INDECI usa la ruta hacia zonas seguras como señal de evacuación y verde/blanco para ese tipo de orientación.
- Las señales son parte del diseño visual; la ubicación final de rutas y punto de reunión debe validarse con el plan de seguridad real del local.
- El botón de sonido activa un ambiente suave; el icono de pantalla completa expande la escena.
