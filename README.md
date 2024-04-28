# BACKEND DE PROYECTO SIDAUDI

para iniciar el proyecto utilizar los siguientes comandos

> para levantar la base de datos y el phpmyadmin

```
sudo docker-compose up -d
```

> para copiar las varoables del sistema

```
cp .env.sample .env
```

para instalar las dependencias

```
npm ci
```

para crear la bd y los seeders

```
npm run:setup
npm run dev
```
