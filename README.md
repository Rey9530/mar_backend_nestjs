<p align="center">
  <a href="https://www.cel.gob.sv/" target="blank"><img src="https://pbs.twimg.com/profile_images/1307069445681172480/qRL3IeTh_400x400.jpg" width="200" alt="Nest Logo" /></a>
</p>
 
## Marca Recognition

1. Clonar el proyecto
2. ```yarn install```
3. Clonar el archivo ```.env.template``` y renombrarlos a ```.env```
4. Cambiar loas variables de entornos
5. Levantar la db en este caso se uso una Db Dockerizada por lo tanto se puede usar el archivo yaml solo ejecutando
```
docker-compose.yaml up -d
```
6. Ejecutar ```npx prisma migrate dev --name first-migration```
7. Levantar con ```yarn start:dev```
8. Ejecutar ```http://localhost:3000/api/seed```