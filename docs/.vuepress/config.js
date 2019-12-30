module.exports = {
  plugins: ['vuepress-plugin-element-tabs','@vuepress/back-to-top'],
  title: 'Thinger.io 中文文件',
  description: 'Thinger.io 中文文件',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],
  base: '/thinger.io-docs-zh-t/',
  markdown: {
    extendMarkdown: md => {
      md.use(require('markdown-it-task-lists'))
    },
    lineNumbers: false
  },
  theme: 'thindark',
  themeConfig: {
    nav:[
      //{text: '傳產工業4.0協作企劃', link: '' },
      {text: '原文文檔', link: 'https://docs.thinger.io/' }
    ],
    sidebar:[
      ['/', '總覽'],
      {
          title: '裝置',
          sidebarDepth: 1,
          children: [
            ['/devices/', '裝置'],
            ['/devices/arduino', 'ARDUIINO'],
            ['/devices/arduinoboardsexamples', 'ARDUINO 開發板範例'],
            ['/devices/linux', 'LINUX / RASPBERRY PI'],
            ['/devices/sigfox', 'SIGFOX'],
          ]
      },
      ['/coding', '編寫程式'],
      {
          title: '雲端控制台',
          sidebarDepth: 1,
          children: [
            ['/console/devices-administration', '裝置管理'],
            ['/console/buckets', '數據儲存桶'],
            ['/console/endpoints', '端點'],
            ['/console/dashboards', '儀表板'],
            ['/console/file-system', '檔案系統'],
            ['/console/access-tokens', '存取令牌']
          ]
      },
      ['/api', 'API'],
      ['/server-configuration', '伺服器管理'],
      ['/deployment', '伺服器部署']
    ],
    sidebarDepth: 2,
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@assets': './assets/',
        '@server': './assets/Server',
        '@overview': './assets/Overview',
        '@arduino': '../assets/Arduino',
        '@sigfox': '../assets/Sigfox',
        '@linux': '../assets/Linux',
        '@coding': './assets/Coding',
        '@cloud': '../assets/Cloud',
        '@api': './assets/API'
      }
    }
  }
}