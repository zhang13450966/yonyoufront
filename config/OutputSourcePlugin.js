const path = require('path');
const fs = require('fs');

class OutputSourcePlugin {
    constructor({ output, allDependentOutputConfig }) {
        this.output = output;
        this.allDependentOutputConfig = allDependentOutputConfig && JSON.parse(allDependentOutputConfig) || {};
    }
    apply(compiler) {
        compiler.hooks.done.tap(
            'OutputSourcePlugin',
            ({ compilation }) => {
                let outputPath = compilation.compiler.outputPath,
                    configJSONs = [];

                for (let index = 0; index < compilation.entries.length; index++) {
                    const resource = compilation.entries[index].resource;
                    if (fs.existsSync(path.join(resource, '../config.json'))) {
                        configJSONs.push(path.join(resource, '../config.json'))
                    }
                }

                [...compilation.fileDependencies, ...configJSONs].forEach(file => {
                    if (!file.includes('node_modules')) {
                        let targetPath = path.resolve(
                            path.resolve(outputPath, typeof this.output === 'function' ? this.output(file) : this.output),
                            path.relative(path.resolve(__dirname, '../'), file),
                        ), targetDir = path.resolve(targetPath, '../');

                        mkdir(targetDir);

                        fs.copyFileSync(file, targetPath);
                        // fs.writeFileSync(targetPath, fs.readFileSync(file));
                    }
                });

                // 处理指定在入口的config.json配置独立输出的文件 将a复制到b
                if (Object.keys(this.allDependentOutputConfig).length) {
                    // 复制目录
                    Object.entries(this.allDependentOutputConfig).forEach(([input, output]) => {
                        const curInput = path.resolve(outputPath, input.replace('/index', ''));
                        const curOutput = path.resolve(outputPath, output);
                        copyDir(curInput, curOutput);
                    });
                    
                }
            },
        );
    }
}

/**
 * 复制文件夹到目标文件夹
 * @param {string} src 源目录
 * @param {string} dest 目标目录
 * @param {function} callback 回调
 */
 const copyDir = (src, dest, callback) => {
    const copy = (copySrc, copyDest) => {
      fs.readdir(copySrc, (err, list) => {
        if (err) {
          callback(err);
          return;
        }
        list.forEach((item) => {
          const ss = path.resolve(copySrc, item);
          fs.stat(ss, (err, stat) => {
            if (err) {
              callback(err);
            } else {
              const curSrc = path.resolve(copySrc, item);
              const curDest = path.resolve(copyDest, item);
   
              if (stat.isFile()) {
                // 文件，直接复制
                fs.createReadStream(curSrc).pipe(fs.createWriteStream(curDest));
              } else if (stat.isDirectory()) {
                // 目录，进行递归
                fs.mkdirSync(curDest, { recursive: true });
                copy(curSrc, curDest);
              }
            }
          });
        });
      });
    };
   
    fs.access(dest, (err) => {
      if (err) {
        // 若目标目录不存在，则创建
        fs.mkdirSync(dest, { recursive: true });
      }
      copy(src, dest);
    });
 }
  


function mkdir(dir) {
    if (!fs.existsSync(dir)) {
        let parentDir = path.resolve(dir, '../');
        mkdir(parentDir);
        fs.mkdirSync(dir);
    }
}

module.exports = OutputSourcePlugin;