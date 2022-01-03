var fs = require('fs')
var util = require('util');
var path = require('path');
var tar = require('targz');
var zip = new require('node-zip')();

var conf = 'config.json';

function makePath (buildResult, platform, extSource, extTarget) {
    return buildResult.artifactPaths[0]
    .replace(buildResult.configuration.productName, buildResult.configuration.productName + '-' + platform)
    .replace(extSource, extTarget);
}

function makeBinaryName(buildResult, extension) {
    return buildResult.configuration.productName + extension;
}

exports.default = async function (buildResult) {
    var target = buildResult.platformToTargets.keys().next().value.nodeName;

    if (target !== 'win32' && target !== 'linux') {
        return [];
    }
    
    var confPath = path.join(buildResult.outDir, conf);
    var binPath = buildResult.artifactPaths[0];
    var bin = path.basename(binPath);

    if (target === 'win32') {
        var binExt = '.exe';
        var arcExt = '.zip';

        zip.file(conf, fs.readFileSync(confPath));
        zip.file(makeBinaryName(buildResult, binExt), fs.readFileSync(binPath));
        var data = zip.generate({ base64: false, compression: 'DEFLATE' });

        var zipPath = makePath(buildResult, target, binExt, arcExt);
        fs.writeFileSync(zipPath, data, 'binary');
        return [zipPath];
    }

    if (target === 'linux') {
        var binExt = '.AppImage';
        var arcExt = '.tar.gz';

        var tarPath = makePath(buildResult, target, binExt, arcExt);

        var compress = util.promisify(tar.compress);
        await compress({
            src: buildResult.outDir,
            dest: tarPath,
            tar: {
                entries: [conf, bin],
                map: function(header) {
                    if (header.name === bin) {
                        header.name = makeBinaryName(buildResult, binExt);
                    }
                }
            }
        })
        return [tarPath];
    }
}