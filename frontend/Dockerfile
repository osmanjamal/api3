FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# تثبيت كل شيء بالقوة 💪
RUN npm install --force --legacy-peer-deps

COPY . .

# تجاهل الأخطاء عند البناء
RUN CI=false npm run build

EXPOSE 3000

CMD ["npm", "start"]