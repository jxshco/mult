const fs = require('fs');
const { exec } = require('child_process');
const packageConfig = require('../utils/package-config/index.ts').default;
const delayForEffect = require('../utils/delay-for-effect/index.ts').default;

module.exports.default = script => {
  delayForEffect('Verifying Config', spinner => {
    const configExists = fs.existsSync(`./${packageConfig.configFileName}`);
    if (!configExists) {
      spinner.fail('No config file found try calling \'mult init\'');
    } else {
      spinner.stop();
      const rawConfig = fs.readFileSync(`./${packageConfig.configFileName}`);
      const config = JSON.parse(rawConfig);
      config.repositories.map(repo => {
        delayForEffect(`Running ${script} for ${repo.name}\n`, spinner2 => {
          exec(`cd ./${repo.name} && ${script} && cd ../`, (err, stdout, stderr) => {
            console.log(stdout);
            spinner2.succeed();
          });
        });
      });
    }
  });
};
