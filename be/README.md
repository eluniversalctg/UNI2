<h1>UNI2 BackEnd</h1>
    <hr />
    <h2>Instalación:</h2>
    <h3>
      Para instalar el sistema se deben de realizar diferentes procesos debido a
      la utilización de sistemas de terceros. Primeramente deben de configurar
      el servicio de CromaAI, Matomo y Apache UNOMI. Próximamente se procede a
      instalar UNI2, para ello debemos de compilar el FrontEnd y BackEnd debido
      a que están en las tecnologías de Angular v13 y NestJS v8 respectivamente.
      Para las configuraciones básicas del BackEnd se debe contar con el archivo
      .env con las siguientes variables de entorno:
    </h3>
    <ol>
      <li>
        <b>MAIL_HOST</b> Este va a ser el servidor que provee el servicio de
        correo. Ej: smtp-mail.outlook.com
      </li>
      <li>
        <b>MAIL_USER</b> La dirección de correo de la cual se van a enviar los
        correos. Ej: dominio@site.com
      </li>
      <li><b>MAIL_PASSWORD</b> La contraseña del correo.</li>
      <li><b>ROLLBAR_TOKEN</b> Clave del gestor de errores.</li>
      <li>
        <b>UNI2DB_URL</b> Esta sería la URL de conexión a la base de datos del
        sistema (MongoDB)
      </li>
      <li>
        <b>CROMADB_URL</b> Esta sería la URL de conexión a la base de datos de
        CROMA (MongoDB)
      </li>
      <li><b>TOKEN_EXPIRES</b> Tiempo de expiración para el JWT. Ej: 12h</li>
      <li><b>TOKEN_SECRET</b> Secret Key del JWT.</li>
      <li>
        <b>PASSWORD_RESET_EXPIRES</b> tiempo para expirar el token de
        restablecimiento de contraseña. Ej: 3600000
      </li>
      <li>
        <b>UNOMI_URL</b> IP del servidor donde nos vamos a conectar para el
        sistema de UNOMI
      </li>
      <li><b>USER_KARAF</b> Usuario de UNOMI</li>
      <li><b>PASSWORD_KARAF</b> Contraseña de UNOMI</li>
      <li>
        <b>PUBLIC_IMAGES</b> IP para conectar donde vamos a tener el servidor de
        imágenes.
      </li>
      <li>
        <b>SERVER_IP</b> IP donde se encuentra corriendo el BE, con su
        respectivo puerto, esto con el fin de conectar el script de
        renderización. Ej: `https://178.23.3.1:3000`
      </li>
    </ol>
    <hr />
    <h2>Como compilar el proyecto:</h2>
    <h3>
      Para poder ejecutar el API como un servicio tenemos que compilar con el
      comando <code>npm run build</code> , esto nos genera una carpeta llamada
      <code>dist</code> la cual será utilizada para el BackEnd. Dentro de la
      carpeta vamos a encontrar una archivo llamado <code>main.js</code> el cuál
      es nuestro archivo principal.
    </h3>
    <hr />
    <h2>Acceder al API:</h2>
    <h3>
      Para tener acceso a las rutas vamos a utilizar el prefijo
      <code>uni2Api</code> entonces utilizaremos la dirección
      <code>http://localhost:3000/uni2Api </code>
      <br />
      Para tener acceso al SWAGGER tendremos que ir a la dirección
      <a href="http://localhost:3000/uni2Api/api" target="_blank"
        >http://localhost:3000/uni2Api/api</a
      >
      y desde ahí tendremos acceso a todas las rutas disponibles y los DTO
      creados.
    </h3>
