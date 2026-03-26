// App.tsx is not used as the entry point.
// The app is bootstrapped via main.tsx → AppRouter.
import { MarkdownViewer } from "./components/MarkdownViewer";

export default function App() {
  return <MarkdownViewer content="<img src=x onerror=alert('XSS_Test')> **Test OK**" />;
}
