FROM node:20-alpine

WORKDIR /app

# 安装Python
RUN apk add --no-cache python3 py3-pip
RUN pip3 install ezdxf

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001
CMD ["node", "dist/index.js"]
