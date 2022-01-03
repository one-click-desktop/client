var fs = require('fs')
var zip = new require('node-zip')();
var path = require('path');

exports.default = function (buildResult) {
    if (buildResult.platformToTargets.keys().next().value.nodeName === 'win32') {
        zip.file('config.json', fs.readFileSync(path.join(buildResult.outDir, 'config.json')));
        zip.file(buildResult.configuration.productName + '.exe', fs.readFileSync(buildResult.artifactPaths[0]));
        var data = zip.generate({ base64: false, compression: 'DEFLATE' });

        var zipPath = buildResult.artifactPaths[0]
            .replace(buildResult.configuration.productName, buildResult.configuration.productName + ' win')
            .replace('.exe', '.zip');
        fs.writeFileSync(zipPath, data, 'binary');
        return [zipPath]
    }
}