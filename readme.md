# U

> Directorio de Master SAPers

## Historia

Leer [la historia aquí](https://foros.consultoria-sap.com/t/directorio-de-usuarios-sap-sapers/67579)

20/01/2026 - Diseño del logo

<img width="200" height="200" alt="image" src="https://github.com/user-attachments/assets/e84be6c0-30a2-4ad9-b4a8-1a3c6626df3a" />


## Cómo funciona

> [Leer](https://github.com/SidVal/SidV/issues/92#issuecomment-3005754163) <- Enlace privado ;-) 

***

# Arquitectura de Procesamiento de Usuarios (Jekyll + JSON)

Este repositorio utiliza una arquitectura de **procesamiento por etapas** para generar páginas de usuarios en Jekyll a partir de fuentes externas en formato JSON.

La lógica está separada en **procesadores con responsabilidades claras**, evitando estados frágiles y permitiendo actualizaciones incrementales sin recrear contenido editorial.

Este README debe leerse como **contexto previo obligatorio** antes de analizar cualquier script JS del proyecto.

---

## 🎯 Objetivo general

- Consumir datos externos (generados fuera de Jekyll)
- Normalizarlos y consolidarlos en `_data/*.json`
- Generar páginas de usuario (`_usuarios/*.md`) **solo una vez**
- Permitir **actualizaciones posteriores de datos** sin tocar los `.md`
- Delegar el render final a Jekyll

---

## 🧱 Estructura de carpetas clave

```text
/temp        → staging de datos crudos (descartable)
/_data       → estado actual normalizado (fuente de verdad para Jekyll)
/_usuarios   → colección Jekyll (identidad persistente)
/assets/js   → procesadores JS
