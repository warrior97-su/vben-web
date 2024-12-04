import type { App } from 'vue';

import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';

import 'element-plus/es/components/message/style/css';
import 'element-plus/es/components/loading/style/css';
import 'element-plus/es/components/message-box/style/css';
/**
 * 按需导入 Element Plus 组件
 * Vite 插件 https://github.com/antfu/unplugin-vue-components
 * @param app {App}
 */
export default function styleImport(app: App<any>) {
  const components = [ElLoading, ElMessage, ElMessageBox];
  components.forEach((v) => {
    app.use(v);
  });
  return app;
}
