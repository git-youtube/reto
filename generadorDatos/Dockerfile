# Use an image de PHP como base
FROM php:8.2-apache

# Instalación de paquetes cron y pdo
RUN apt-get update && apt-get -y install cron
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Creando un directorio para nuestro script PHP
RUN mkdir /cron_scripts
WORKDIR /cron_scripts
COPY ["generadorDatos.php", "/cron_scripts"]

# Creando el archivo de registro que se escribirá en cada iteración de cron
RUN touch test_cron.log

# Copiando la tabla cron en una ubicación donde será analizada por el sistema
COPY ./crontab /etc/cron.d/crontab
# El propietario puede leer y escribir en la tabla cron, el grupo y otros pueden leerla
RUN chmod 0644 /etc/cron.d/crontab
# Ejecutando nuestra tabla cron utilizando el binario del paquete que instalamos
RUN /usr/bin/crontab /etc/cron.d/crontab
CMD [ "service", "cron", "start" ]