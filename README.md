# Jardín 3D · I.E. N.° 007 Bellavista

Recorrido web en Three.js del plano de la institución educativa de Bellavista, Celendín. La distribución sigue el plano de referencia; la iluminación, los materiales, los rótulos y la navegación conservan el estilo visual del proyecto Jardín 3D.

## Abrir

Abre PowerShell en esta carpeta y ejecuta:

```powershell
python -m http.server 8000
```

Luego abre <http://localhost:8000>. Three.js se carga desde jsDelivr, por lo que se necesita conexión a internet.

## Recorrido

- Arrastra con el mouse para girar la cámara y usa la rueda para acercar o alejar. En PC, activa **Controlar al niño** y usa las flechas para caminar, **Shift** para correr y **Espacio** para saltar.
- En celular, activa el control del niño para mostrar el pad táctil de dirección y los botones **Correr** y **Saltar**.
- El menú inferior ofrece vistas del ingreso, el bloque central, los juegos y patio, las áreas verdes, las aulas del fondo y una vista aérea.
- **Seguir al niño** acompaña a un alumno articulado que recorre las rutas del colegio; **Controlar al niño** permite dirigirlo con WASD o las flechas; **Pausar paseo** detiene o reanuda el recorrido automático.
- **Ocultar nombres** alterna los rótulos blancos flotantes de las áreas.
- El botón de sonido activa un ambiente suave y el control de pantalla completa amplía la escena.
