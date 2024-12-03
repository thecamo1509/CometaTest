
# CometaTest

![Aplicacion para gestionar promociones esporadicas](https://i.imgur.com/OOVLeol.png)
Este proyecto es una aplicación basada en Next.js con soporte para TypeScript, pnpm como gestor de paquetes y una arquitectura estructurada para facilitar el desarrollo y la escalabilidad.

## Requisitos previos

- Asegurate de seguir los pasos uno a uno y en el orden indicado. 
- Debes correr el proyecto en tu maquina local (es posible que si usas una instancia online no funcione correctamente)

## Instalacion

Esta aplicacion utiliza pnpm para gestionar paquetes por lo que los comandos descritos abajo usaran el mismo:

1. Clona el repositorio.
2. Ubicate en la carpeta raiz `/CometaTest/` usando `cd CometaTest`
3. Crea un archivo .env en la ruta `/CometaTest/apps/frontend`
4. Agrega la variable de entorno `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000`
5. En la carpeta raiz corre el siguiente comando: `pnpm i && pnpm dev`
6. Es importante a que esperes a que todas las dependencias de python y de node sean instaladas.
7. Ve a tu navegador e ingresa a http://localhost:3000

## Como usar la App

La aplicacion consiste con dos modulos principales: manager y clientes:

#### Crear una orden de cervezas

- Ve a http://localhost:3000/clients y dale clic en `Crear una orden de cervezas`
- Llena los datos del formulario para crear tu orden
- Al crear tu orden seras redireccionado a ella

#### Detalles de la orden
- La ruta /clients/order/[uid] te mostrara todos los detalles de la orden
- No te preocupes puedes ordenas mas rondas de cerveza que se iran procesando.
- Aqui puedes crear diferentes rondas de cervezas.
- Tambien podras marcar tu orden como paga. Ten en cuenta que si pagas tu orden no podras agregar mas rondas a tu orden. Deberas crear una nueva.

#### Panel del manager
- Como el manager puedes verificar tu stock solo debes ir a /manager
- Tambien podras visualizar las promociones que estan activas.
- Aqui tambien podras crear promociones. Es importante que para que la veas en tu panel la promocion este activa. 


