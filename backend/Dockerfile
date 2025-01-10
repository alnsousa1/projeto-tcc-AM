FROM php:8.0-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    curl \
    git

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Set working directory
WORKDIR /var/www

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy existing application directory contents
COPY . /var/www

# Instale dependências do projeto
RUN composer install

# Copy existing application directory permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Exponha portas usadas no projeto
EXPOSE 80 443 8000