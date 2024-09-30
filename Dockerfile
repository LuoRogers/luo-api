# 使用官方 Node.js 作为基础镜像
FROM node:20

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json (或 pnpm-lock.yaml)
COPY package*.json ./
# 或者如果使用 pnpm
# COPY pnpm-lock.yaml ./

# 安装依赖
RUN npm install
# 或者如果使用 pnpm
# RUN npm install -g pnpm && pnpm install

# 复制应用程序代码
COPY . .

# 编译 TypeScript 代码
RUN npm run build
# 或者如果使用 pnpm
# RUN pnpm build

# 公开端口
EXPOSE 3000

# 启动应用
CMD ["node", "dist/index.js"]
