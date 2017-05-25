const
  fs = require('fs'),
  cheerio = require('cheerio'),
  // pug = require('pug');
  PSD = require('psd');
  file = process.argv[2] || 'test.psd';

// dom global variables
var
  // html = fs.readFileSync('test/test.html'),
  $ = cheerio.load('<div class="container"></div>'),
  container = $('.container'),
  divs = [],
  divChild = [],
  buttons = [],
  spans = [];
  htmlHead =
  '<!DOCTYPE html>' + '\n' +
  '<html lang="zh">' + '\n' +
  '<head>' + '\n' +
    '<meta charset="UTF-8">' + '\n' +
    '<meta name="viewport" content="width=750, user-scalable=no">' + '\n' +
    '<meta name="format-detection" content="telephone=no">' + '\n' +
    '<meta name="apple-mobile-web-app-status-bar-style" content="black">' + '\n' +
    '<title>Test</title>' + '\n' +
    '<link rel="stylesheet" href="css/style.css">' + '\n' +
  '</head>' + '\n' +
  '<body>' + '\n',
  htmlFoot = '</body>'+ '\n' +'</html>';

// style global variables
var stylePath = 'test/css/inc/';

PSD.open(file).then((psd) => {
  psd.tree().descendants().forEach((node) => {
    // createDom
    if (node.isGroup() && node.depth() === 1) {
      var pages = [];
      pages.push(node);
      pages.forEach(createSection);
    } else if (node.isGroup() && node.depth() !== 1) {
      divs.push(node);
    } else if (node.name.includes('button')) {
      buttons.push(node);
    } else if (node.isGroup() === false && node.depth() === 2) {
      spans.push(node);
    }
    // saveAsPng
    if (node.isGroup()) {
      return true;
    } else {
      node.saveAsPng("test/images/" + node.name + ".png").catch(function (err) {
        console.log(err.stack);
      });
    }
  });
  spans.reverse().forEach(createSpan);
  divs.reverse().forEach(createDiv);
  divChild.reverse().forEach(createSpan);
  buttons.reverse().forEach(createBtn);
  var doms = $.html()
  fs.writeFileSync('test/index.html', htmlHead + doms + htmlFoot);
});

function createSection(el, index, arr) {
  // dom
  var secTag = $('<section></section>').addClass(arr[index].name);
  if (arr[index].hidden()) {
    secTag.addClass('hide');
  }
  container.append(secTag);

  // style
  var secStyle = '.' + arr[index].name + '{' + '\n' +

    '  ' + 'span' + ' ,a' + '{' + '\n' +
    '    ' + 'position: absolute;' + '\n' +
    '  ' + '}' + '\n' +
    '}';
  fs.writeFile(stylePath + arr[index].name + '.scss', secStyle, (err) => {
    if (err) throw err;
  });
}
function createBtn(el, index, arr) {
  // dom
  var btnTag = $('<a href="#"></a>').addClass(arr[index].name);
  var btnParent = $('.' + arr[index].ancestors()[0].name);
  btnParent.append(btnTag);

  // style
  var n = arr[index].depth();
  var btnStyle = space(n) + '.' + arr[index].name + '{' + '\n' +

    space(n + 2) + "@include bg-img('../images/" + arr[index].name + ".png', " + arr[index].width + 'px, ' + arr[index].height + 'px);' + '\n' +
    space(n + 2) + 'top: ' + arr[index].top + 'px;' + '\n' +
    space(n + 2) + 'left: ' + arr[index].left + 'px;' + '\n' +

    space(n) + '}' +
    '\n' + '}';

  fs.open(stylePath + arr[index].ancestors()[0].name + '.scss', 'r+', (err, fd) => {
    if (err) throw err;
    var stats = fs.statSync(stylePath + arr[index].ancestors()[0].name + '.scss');
    fs.writeSync(fd, btnStyle, stats.size - 1);
  });
}
function createSpan(el, index, arr) {
  // dom
  var spanTag = $('<span></span>').addClass(arr[index].name);
  var spanParent = $('.' + arr[index].parent.name);
  spanParent.append(spanTag);

  // style
  if (arr[index].depth() === 2) {
    var n = 2;
  } else {
    var n = 2 + (arr[index].depth() - 2) * 2;
  }
  var spanStyle = space(n) + '.' + arr[index].name + '{' + '\n' +

    space(n + 2) + "@include bg-img('../images/" + arr[index].name + ".png', " + arr[index].width + 'px, ' + arr[index].height + 'px);' + '\n' +
    space(n + 2) + 'top: ' + arr[index].top + 'px;' + '\n' +
    space(n + 2) + 'left: ' + arr[index].left + 'px;' + '\n' +

    space(n) + '}' +
    '\n' + '}';

  fs.open(stylePath + arr[index].ancestors()[0].name + '.scss', 'r+', (err, fd) => {
    if (err) throw err;
    var stats = fs.statSync(stylePath + arr[index].ancestors()[0].name + '.scss');
    // fs.writeSync(fd, spanStyle, stats.size - 1);
    if (arr[index].depth() === 2) {
      fs.writeSync(fd, spanStyle, stats.size - 1);
    } else {
      fs.writeSync(fd, spanStyle + '\n' + '}', stats.size - 3);
    }
  });
}
function createDiv(el, index, arr) {
  // div dom
  var divTag = $('<div></div>').addClass(arr[index].name);
  var divParent = $('.' + arr[index].parent.name);
  divParent.append(divTag);

  // div style
  var n = arr[index].depth();
  var divStyle = space(n) + '.' + arr[index].name + '{' + '\n' +

    space(n + 2) + 'width: ' + arr[index].width + 'px;' + '\n' +
    space(n + 2) + 'height: ' + arr[index].height + 'px;' + '\n' +
    space(n + 2) + 'top: ' + arr[index].top + 'px;' + '\n' +
    space(n + 2) + 'left: ' + arr[index].left + 'px;' + '\n' +

    space(n) + '}' +
    '\n' + '}';

  fs.open(stylePath + arr[index].ancestors()[0].name + '.scss', 'r+', (err, fd) => {
    if (err) throw err;
    var stats = fs.statSync(stylePath + arr[index].ancestors()[0].name + '.scss');
    fs.writeSync(fd, divStyle, stats.size - 1);
  });

  // divChild
  arr[index].children().forEach(function(child) {
    divChild.push(child);
  });
}
function space(n) {
  var space = new Array(n + 1).join(' ');
  return space;
}