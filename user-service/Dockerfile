FROM php:8.2-apache

WORKDIR /var/www/html
COPY src/ .
RUN a2enmod rewrite

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf
RUN echo '<Directory /var/www/html>\n\
    AllowOverride All\n\
    </Directory>' >> /etc/apache2/apache2.conf

RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html

EXPOSE 80