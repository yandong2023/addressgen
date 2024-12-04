# AddressGen - 专业的国际地址生成器

AddressGen 是一个专业的国际地址生成工具，帮助用户快速生成各个国家和地区的真实地址格式。无论是用于测试、开发还是其他用途，AddressGen 都能提供准确的地址数据。

## 特点

- 支持多个国家和地区的地址格式
- 生成符合当地格式的真实地址
- 简单直观的用户界面
- 快速响应的 API 服务
- 支持批量生成地址

## 在线使用

访问我们的网站：[AddressGen](https://addressgen.vercel.app/)

## 本地开发

### 系统要求

- Node.js >= 18.0.0
- npm 或 yarn

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/yourusername/addressgen.git
cd addressgen
```

2. 安装依赖
```bash
npm install
```

3. 创建环境变量文件
```bash
cp .env.example .env
```

4. 启动开发服务器
```bash
npm run dev
```

5. 构建 CSS（在另一个终端）
```bash
npm run build:css
```

### 构建部署

1. 构建项目
```bash
npm run build
```

2. 启动生产服务器
```bash
npm start
```

## 技术栈

- Frontend: HTML, JavaScript, Tailwind CSS
- Backend: Node.js, Express
- 部署: Vercel

## API 文档

### 生成地址

```
GET /api/address/:country
```

参数：
- country: 国家代码（例如：US, GB, JP）

响应示例：
```json
{
  "success": true,
  "data": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "United States"
  }
}
```

## 贡献指南

欢迎提交 Pull Requests 来改进这个项目。请确保遵循以下步骤：

1. Fork 这个仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情
