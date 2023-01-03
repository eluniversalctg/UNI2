# Uni2Fe

Este proyecto fue generado en la versión 13.1.3.

## Configuración necesaria

Para poder conectar nuestra interfaz con el api debemos agregar las siguientes configuraciones en el archivo `enviroment`. Dicho archivo lo encontramos en la siguiente ruta: `src/environments/environment`, vamos a encontrar el archivo `.ts` o `.prod.ts`. Acá vamos a agregar lo siguiente:

1. production: Por defecto Angular nos genera esta variable la cual nos indica si es producción o si nos encontramos en desarrollo. Ej: `true/false`,
2. localStorageItem: Vamos a definir el nombre de la variable que se generará en el localStorage. Ej: `'uni2'`,
3. basePath: Esta será la dirección IP de nuestro BackEnd. Ej: `'http://localhost:3000/uni2api'`,
4. captcha: Para un método de seguridad tenemos implementado el captcha de Google, el cuál deberá ser generado. Ej: `'6Lcm6boiAAAAAAZY8fwCa9eYraRFC369sdeFdONe'`,

## Compilar el proyecto

Ejecutamos el comando `npm run build` para compilar el proyecto. Esto nos genera la carpeta `dist/` acá vamos a encontrar todo lo necesario para poder servir nuestro sitio web. Contamos con el archivo principal el cual es `index.html`.
