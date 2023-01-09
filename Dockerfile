#using official 'node' image, with the alpine 3.15 branch as base image for development stage 
FROM node:18.12.1-alpine3.15 As development 
 
# create working directory inside the container 
WORKDIR /usr/src/app 
 
#copy package.json and package-lock.json files 
COPY package*.json ./ 
 
#install dependencies 
RUN npm install --only=development 
 
#copy all files from current directory into container 
COPY . . 
 
# build the application 
RUN npm run build 
 
# expose on port 3000 
EXPOSE 3000 
  
#using official 'node' image, with the alpine 3.15 branch as base image for production stage 
FROM node:18.12.1-alpine3.15 As production 
 
#define the default value for NODE_ENV 
ARG NODE_ENV=production 
ENV NODE_ENV=${NODE_ENV} 
 
# create working directory inside the container 
WORKDIR /usr/src/app 
 
#copy package.json and package-lock.json files 
COPY package*.json ./ 
 
# install only dependencies defined in 'dependencies' in package.json 
RUN npm install --only=production 
 
#copy all files from current directory into container 
COPY . . 
 
# copy files 
COPY --from=development /usr/src/app/dist ./dist 
 
# command to start the server using the production build 
CMD ["node", "dist/main"]