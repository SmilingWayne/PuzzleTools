import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const isProdEnv = process.env.NODE_ENV === 'production';
const PUBLIC_PATH = isProdEnv ? process.env.PUBLIC_PATH + "/" + process.env.CHAT_VARIABLE : process.env.PUBLIC_PATH;
const OUT_DIR = isProdEnv ? 'build/' + process.env.CHAT_VARIABLE : 'build';
const PLUGINS  = isProdEnv ? [react()] : [
    react(),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace(
          /<\/head>/,
          `
          <script>
          window.onerror = function(message, source, lineno, colno, error) {
            window.parent.postMessage({
              type: 'error',
              data: {
                message: message,
                source: source, 
                lineno: lineno,
                colno: colno,
                error: error?.stack || error?.message
              }
            }, '*');
            return true;
          };
          console.error = function(...args) {
            const message = args.join(' ');
            window.parent.postMessage({
              type: 'console-error',
              data: {
                message: message,
              }
            }, '*');
            return;
          }
          </script>
           <!-- FCP -->
          <script type="module">
            import { onFCP } from 'https://s3plus.meituan.net/mcopilot-pub/nocode-dep/web-vitals.min.js?module';
            onFCP((metric) => {
              console.log('FCP: ', metric);
              // 检查是否为欢迎页
              const welcomeContent = document.querySelector('.text-center');
              const isDefaultTemplate = welcomeContent?.innerHTML.includes('欢迎页') && welcomeContent?.innerHTML.includes('开始构建你的神奇应用');

              // 发送FCP数据
              window.parent.postMessage({
                type: 'nocode.fcp',
                data: {
                  id: metric.id,
                  value: metric.value,
                  delta: metric.delta,
                  navigationType: metric.navigationType,
                  rating: metric.rating,
                  isDefaultTemplate,
                }
              }, '*');
            });
          </script>
          <script type="module" src="./hmr-client.js"></script>
          <script src="https://s3plus.meituan.net/mcopilot-pub/nocode-dep/html2canvas.min.js"></script>
          <script src="https://s3plus.vip.sankuai.com/static-prod01/com.sankuai.mcopilot.nocode.front-files/public/script/element-selector-script.js?v=2"></script>
          <script type="module">
          window.parent.postMessage({
              type: 'version',
              version: 1
          }, '*');
          document.addEventListener('DOMContentLoaded', () => {
              setTimeout(async () => {
                  try {
                      const element = document.getElementById('root');
                      if (!element) {
                          throw new Error('找不到 root 元素');
                      }

                      // 检查元素尺寸
                      const rect = element.getBoundingClientRect();
                      if (rect.width === 0 || rect.height === 0) {
                          throw new Error('元素尺寸为0');
                      }

                      // 等待所有图片加载完成
                      const images = element.getElementsByTagName('img');
                      await Promise.all([...images].map(img => {
                          if (img.complete) return Promise.resolve();
                          return new Promise((resolve) => {
                              img.onload = resolve;
                              img.onerror = resolve;
                          });
                      }));

                      const canvas = await html2canvas(element, {
                          scale: 2,
                          useCORS: true,
                          logging: false,
                          allowTaint: true,
                          backgroundColor: '#ffffff',
                          windowWidth: document.documentElement.offsetWidth,
                          windowHeight: document.documentElement.offsetHeight,
                          onclone: (clonedDoc) => {
                              console.log('DOM已克隆');
                          }
                      });

                      const screenshot = canvas.toDataURL('image/png');
                      console.log('截图生成完成，数据长度:', screenshot.length);

                      window.parent.postMessage({
                          type: 'screenshot_response',
                          screenshot: screenshot
                      }, '*');

                  } catch (error) {
                      window.parent.postMessage({
                          type: 'screenshot_response',
                          error: error.message
                      }, '*');
                  }
              }, 5000);
          });
          </script>
          </head>
          `
        );
      },
    }
];

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: "8080",
    hmr: {
      overlay: false
    }
  },
  plugins: [
    PLUGINS
  ],
  base: PUBLIC_PATH,
  build: {
    outDir: OUT_DIR
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
      {
        find: "lib",
        replacement: resolve(__dirname, "lib"),
      },
    ],
  },
});
