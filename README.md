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
frontend/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   └── page.tsx
│   ├── components/
│   │   ├── conversation-area.tsx
│   │   ├── model-selector.tsx
│   │   ├── sidebar.tsx
│   │   └── top-nav.tsx
│   └── lib/
│       └── utils.ts
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