import { defineConfig } from "cypress";
import fs from "fs"
export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        readFolder(folderPath) {
          return new Promise((resolve, reject) => {
            try {
              const files = fs.readdirSync(folderPath);
              resolve(files);
            } catch (err) {
              reject(err);
            }
          })
        },
      })
    },
  },
})