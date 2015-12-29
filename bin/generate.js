var fileName  = process.argv[2].toLowerCase(),
    moduleName = fileName + 's',
    modelName  = fileName.charAt(0).toUpperCase() + fileName.slice(1),
    fs = require('fs');

console.log('Creating directory');
fs.mkdirSync(__dirname + '/../src/modules/' + moduleName);

console.log('Creating model');
fs.readFile(__dirname + '/_examples/_model', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var result = data.replace(/%_MODEL_NAME_%/g, modelName).replace(/%_FILE_NAME_%/g, fileName);

  fs.writeFile(__dirname + '/../src/modules/' + moduleName + '/' + fileName +'-model.ts', result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});

console.log('Creating controller');
fs.readFile(__dirname + '/_examples/_controller', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var result = data.replace(/%_MODEL_NAME_%/g, modelName).replace(/%_FILE_NAME_%/g, fileName);

  fs.writeFile(__dirname + '/../src/modules/' + moduleName + '/' + fileName +'-controller.ts', result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});

console.log('Edit boot file');
fs.readFile(__dirname + '/../src/boot.ts', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var result =
    data
      .replace('\nexport class', "import {" + modelName + "Controller} from './modules/" + moduleName + "/" + fileName + "-controller';\n\nexport class")
      .replace('\n\t\treturn this', '\t\tnew ' + modelName + 'Controller().configure(this.app);\n\n\t\treturn this');

  fs.writeFile(__dirname + '/../src/boot.ts', result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});

console.log('Creating test directory');
fs.mkdirSync(__dirname + '/../test/modules/' + moduleName);

console.log('Creating model test');
fs.readFile(__dirname + '/_examples/_modelTest', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var result = data.replace(/%_MODEL_NAME_%/g, modelName).replace(/%_FILE_NAME_%/g, fileName).replace(/%_MODULE_NAME_%/g, moduleName);

  fs.writeFile(__dirname + '/../test/modules/' + moduleName + '/' + fileName +'-model.ts', result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});

console.log('Creating controller test');
fs.readFile(__dirname + '/_examples/_controllerTest', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var result = data.replace(/%_MODEL_NAME_%/g, modelName).replace(/%_FILE_NAME_%/g, fileName).replace(/%_MODULE_NAME_%/g, moduleName);

  fs.writeFile(__dirname + '/../test/modules/' + moduleName + '/' + fileName +'-controller.ts', result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});

console.log('Module "'+moduleName + '" successfully created');