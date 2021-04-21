'use strict';

const { BroccoliMergeFiles } = require('broccoli-merge-files');
const path = require('path');

module.exports = {
  name: require('./package').name,

  isDevelopingAddon() {
    return true;
  },

  postprocessTree(type, tree) {
    if (type === 'all') {
      const mergedNode = new BroccoliMergeFiles([tree], {
        patterns: [
          '**/vendor.css',
          `**/${this.app.name}.css`,
          '**/vendor.js',
          `**/${this.app.name}.js`,
        ],
        sort(a, b) {
          const aName = path.basename(a[1]);
          const bName = path.basename(b[1]);
          const aIsVendor = /^vendor\./.test(aName);
          const bIsVendor = /^vendor\./.test(bName);
          if (bIsVendor && !aIsVendor) {
            return 1;
          } else if (aIsVendor && !bIsVendor) {
            return -1;
          } else {
            return 0;
          }
        },
        merge(files) {
          const css = [];
          const js = [];
          for (const file of files) {
            const [filename, data] = file;
            const extname = path.extname(filename);
            if (extname === '.css') {
              css.push(data);
            }
            if (extname === '.js') {
              js.push(data);
            }
          }
          const style = JSON.stringify(css.join('\n'));
          return `
            (function () {
              const __STYLESHEET__ = ${style};
              ${js.join('\n')}
            })();
          `;
        },
        outputFileName: `${this.app.name}.js`,
      });
      return mergedNode;
    }
    return tree;
  },
};
