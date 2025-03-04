# Modern Chat Application

A modern, elegant chat application built with Next.js, React, and TypeScript. Features a beautiful UI with real-time streaming responses, conversation management, and theme support.

## Features

- 🚀 Real-time streaming responses with typing effect
- 💬 Conversation management (create, select, delete)
- 🎨 Modern UI with light/dark theme support
- 🔄 Automatic message history loading
- 💭 Special formatting for AI thinking process
- 📱 Responsive design
- ⌨️ Keyboard shortcuts support

## Tech Stack

- **Frontend**:
  - Next.js
  - React
  - TypeScript
  - Tailwind CSS
  - Shadcn/ui Components

- **Features**:
  - Server-Sent Events (SSE) for streaming
  - Custom hooks for state management
  - Responsive design patterns
  - Error boundary implementation

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_BASE_URL=your_api_base_url
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
# ASA Dialog + MCP 系统

这是 ASA Dialog + MCP 系统的前端部分，采用现代化技术栈构建，提供智能对话和 MCP 扩展功能。

## 技术栈

- **Next.js 15** - React 框架，提供服务端渲染和静态生成功能
- **React** - 用户界面库
- **TypeScript** - 静态类型检查
- **Tailwind CSS** - 实用优先的 CSS 框架
- **shadcn/ui** - 高质量 UI 组件库
- **date-fns** - 日期处理库
- **Lucide React** - 图标库

## 功能特点

- 三栏式现代布局设计
- 响应式界面，适配桌面和移动设备
- 对话列表和详情页面
- MCP 扩展商店（规划中）
- 用户设置与偏好（规划中）

## 开发指南

### 环境要求

- Node.js 18+ 
- npm 9+

### 安装和运行

1. 克隆仓库

```bash
git clone <仓库地址>
cd asa/frontend
```

2. 安装依赖

```bash
npm install
```

3. 启动开发服务器

```bash
npm run dev
```

4. 打开浏览器访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
# ASA Dialog + MCP 系统

这是 ASA Dialog + MCP 系统的前端部分，采用现代化技术栈构建，提供智能对话和 MCP 扩展功能。

## 技术栈

- **Next.js 15** - React 框架，提供服务端渲染和静态生成功能
- **React** - 用户界面库
- **TypeScript** - 静态类型检查
- **Tailwind CSS** - 实用优先的 CSS 框架
- **shadcn/ui** - 高质量 UI 组件库
- **date-fns** - 日期处理库
- **Lucide React** - 图标库

## 功能特点

- 三栏式现代布局设计
- 响应式界面，适配桌面和移动设备
- 对话列表和详情页面
- MCP 扩展商店（规划中）
- 用户设置与偏好（规划中）

## 开发指南

### 环境要求

- Node.js 18+ 
- npm 9+

### 安装和运行

1. 克隆仓库

```bash
git clone <仓库地址>
cd asa/frontend
```

2. 安装依赖

```bash
npm install
```

3. 启动开发服务器

```bash
npm run dev
```

4. 打开浏览器访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
frontend/
├── public/              # 静态资源
├── src/                 # 源代码
│   ├── app/             # 应用页面
│   │   ├── conversations/  # 对话相关页面
│   │   ├── store/       # MCP 商店页面
│   │   ├── settings/    # 设置页面
│   │   ├── layout.tsx   # 根布局
│   │   └── page.tsx     # 首页
│   ├── components/      # 组件
│   │   ├── layout/      # 布局组件
│   │   └── ui/          # UI 组件
│   └── lib/             # 工具函数
└── package.json         # 项目配置
```

## 开发约定

- 使用 TypeScript 编写所有代码
- 遵循 React 最佳实践
- 使用 Tailwind CSS 进行样式设计
- 使用 shadcn/ui 组件构建界面

## 代码规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化

## 许可

该项目采用 MIT 许可证。
```

## 开发约定

- 使用 TypeScript 编写所有代码
- 遵循 React 最佳实践
- 使用 Tailwind CSS 进行样式设计
- 使用 shadcn/ui 组件构建界面

## 代码规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化

## 许可

该项目采用 MIT 许可证。
```

## Features in Detail

### Real-time Chat
- Streaming responses with typing effect
- Support for markdown formatting
- Special formatting for AI thinking process
- Message history management

### Conversation Management
- Create new conversations
- Switch between existing conversations
- Delete conversations
- Automatic loading of recent conversations

### UI/UX Features
- Modern, clean interface
- Responsive design
- Light/dark theme support
- Smooth animations and transitions
- Enhanced input area with shadow effects
- Avatar support for user and AI messages

### Keyboard Shortcuts
- Enter to send message
- Shift + Enter for new line

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE) 