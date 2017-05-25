# PSD to html & scss & png
Automatically parse PSD files into html &amp; scss &amp; png

这是一个基于[psd.js](https://github.com/meltingice/psd.js)写的node.js脚本。
它被设计更适用于移动端H5页面的生成，如需生成PC端页面可能需要自己调整一些参数。
它解析PSD并自动生成html、scss、png文件，这个脚本还不算很成熟，里面的东西是按我自己的习惯去进行初始化设置的，需要的人可以按自己的习惯重新定制。


## 使用说明
1. 安装 node.js
2. 安装[psd.js](https://github.com/meltingice/psd.js)，`npm install psd`
3. 安装 [cheerio](https://github.com/cheeriojs/cheerio)，`npm install cheerio`
4. 下载此脚本到 psd.js 所在文件夹
5. 使用 `node`命令运行该脚本*（为了方便，建议将该脚本名字改短一点）*，或使用编辑器的node插件*（sublim 安装node插件后，只需`alt + r`即可）*
6. 生成的scss文件里的 `@include` 的 `bg-img`是我按平时习惯写的 `mixin`，这个需要自己写到base.scss里
```
@mixin bg-img ($pic, $width, $height) {
  background: url($pic) no-repeat center;
  width: $width;
  height: $height;
}
```
7. 生成的html标签，需使用编辑器自动化格式


## PSD文件要求
1. 一个页面一个组
2. 所有图层按自己的要求重命名好
3. 有链接样式的图层建议转换为智能图层或合并图层


## License
MTK
