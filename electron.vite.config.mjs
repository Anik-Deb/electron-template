// import path, { resolve } from 'path'
// import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   main: {
//     plugins: [externalizeDepsPlugin()],
//     resolve: {
//       alias: {
//         '@/lib': resolve('src/main/lib'),
//         '@shared': resolve('src/shared')
//       }
//     }
//   },
//   preload: {
//     plugins: [externalizeDepsPlugin()]
//   },
//   renderer: {
//     resolve: {
//       alias: {
//         '@renderer': resolve('src/renderer/src'),
//         '@/components': resolve('src/renderer/src/components'),
//         '@/utils': resolve('src/renderer/src/utils')
//       }
//     },
//     plugins: [react()]
//   },
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src')
//       // Add more aliases as needed for specific directories or modules
//     }
//   }
// })

import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '@main': resolve('src/main') // Add this line
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@': resolve('src/renderer/src')
      }
    },
    plugins: [react()]
  },
})
