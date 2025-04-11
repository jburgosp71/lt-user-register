# lt-user-register
Registers the user (if it doesn't exist) and returns the database id

- Crear un Servicio de usuario para tener la lógica de negocio
- Crear un Repositorio de usuario para tener separada la lógica de acceso a la base de datos
- Crear un Servicio de Email para gestionar el envío de emails

* Los servicios serían inyectados, facilitando por ejemplo el poder cambiar de motor de BBDD o el motor de envío de email sin tener que modificar nuestro Controller

* En lo posible el tema de la conexión y las queries manuales estaría mejor gestionarlas a través de ORM o QueryBuilders para mayor abstracción y mejorar el mantenimiento de la aplicación

* En el tema de emails se está acoplando el registro al envío de la notificación, aquí se nos puede generar un cuello de botella. Una solución es utilizar una cola de eventos (Beanstalk, RabbitQ)
  donde se inserte el evento de "userCreate" con los datos necesarios, y que exista un Listener que se encargue de leer esos eventos para realizar el envío. Asi desacoplamos lógicas y
  simplificamos el mantenimiento de la app.

* El método registerAndNotify() recibe algo (any) que es bastante inseguro y poco mantenible. Estaría bien crear un Dto (UserRegisterDto) con unas validaciones que ayudarían a recibir
  correctamente la información necesaria para el proceso

* Lo mismo pasa con la respuesta, para una práctica REST deberíamos retornar un objeto que fuera fácilmente mantenible (UserResponse) con los datos necesarios (id, message, fecha creación)

* No hay gestión de errores, se deberían de generar las excepciones necesarias para asegurar el correcto funcionamiento, InternalServerError, BadRequest, ...

* Cada parte del código debería tener sus tests unitarios (para los Servicios mencionados), tests de integración para validar el correcto funcionamiento del controller con la BBDD, y
  otro para probar el MailService. Y los tests E2E para probar todo el flujo, desde la petición REST hasta la respuesta recibida

TODO

- Quedaría pendiente la lógica de las colas en el UserService para hacer más eficiente la inserción de usuarios y el envío de email

DEPENDENCIAS

- En el package.json se han incluido las dependencias utilizadas

CONTAINER

- Se incluye Dockerfile y docker-compose para poder testearlo desde dentro del contenedor:
- Para arrancar el contenedor:
````
docker-compose up --build
````

- Para ejecutar los tests:
````
  docker exec -it nestjs-app sh -c "npm run test"
````