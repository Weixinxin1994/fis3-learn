// default settings. fis3 release

// Global start
fis.match('*.{js,css}', {
  useHash: true
});

fis.match('::image', {
  useHash: true
});

fis.match('*.js', {
  optimizer: fis.plugin('uglify-js')
});

fis.match('*.css', {
  optimizer: fis.plugin('clean-css')
});

fis.match('*.png', {
  optimizer: fis.plugin('png-compressor')
});

// Global end

// default media is `dev`
fis.media('dev')
  .match('*', {
    useHash: false,
    optimizer: null
  });

// extends GLOBAL config
fis.media('production');




fis3 通过配置来决定代码、资源该如何处理，包括配置、压缩、CDN、合并等；
fis.set(key, value)
fis.set('namespace', 'home');
fis.set('my project namespace', 'common');
fis.set('a.b.c', 'some value'); // fis.get('a') => {b: {c: 'some value'}}



fis.get(key);
// fis.set('namespace', 'common')
var ns = fis.get('namespace');

// fis.set('a.b.c', 'd')
fis.get('a'); // => {b:{c: 'd'}}
fis.get('a.b'); // => {c:'d'}
fis.get('a.b.c'); // => 'd'


//match 给匹配到的文件分配属性，文件属性决定了这个文件进行怎样的操作。
fis.match('{a,b}.js', {
  release: '/static/$0'
});

fis.match('b.js', {
  release: '/static/new/$0'
});
// 语法
fis.match(selector, props[, important])


// fis.media()是模仿自 css 的 @media，表示不同的状态。这是 fis3 中的一个重要概念，其意味着有多份配置，每一份配置都可以让 fis3 进行不同的编译；比如开发时和上线时的配置不同，比如部署测试机时测试机器目录不同，比如测试环境和线上机器的静态资源 domain 不同，一切这些不同都可以设定特定的 fis.media 来搞定；

// 语法
fis.media(mode)

fis.media('dev').match('*.js', {
  optimizer: null
});

fis.media('rd').match('*.js', {
domain: 'http://rd-host/static/cdn'
});


// fis.plugin()插件调用接口
fis.match('*.less', {
  parser: fis.plugin('less', {}) //属性 parser 表示了插件的类型
})



内置的默认配置
全局属性通过 fis.set 设置，通过 fis.get 获取；

var DEFAULT_SETTINGS = {
  project: {
    charset: 'utf8',
    md5Length: 7,
    md5Connector: '_',
    files: ['**'],
    ignore: ['node_modules/**', 'output/**', '.git/**', 'fis-conf.js']
  },

  component: {
    skipRoadmapCheck: true,
    protocol: 'github',
    author: 'fis-components'
  },

  modules: {
    hook: 'components',
    packager: 'map'
  },

  options: {}
};




1.project.charset
解释：指定项目编译后产出文件的编码。
值类型：string
默认值：'utf8'
用法：在项目的fis-conf.js里可以覆盖为
fis.set('project.charset', 'gbk');

2.project.md5Length
解释：文件MD5戳长度。
值类型：number
默认值：7
用法：在项目的fis-conf.js里可以修改为
fis.set('project.md5Length', 8);

3.project.md5Connector
解释：设置md5与文件的连字符。
值类型：string
默认值：_
用法：在项目的fis-conf.js里可以修改为
fis.set('project.md5Connector ', '.');

4.project.files
解释：设置项目源码文件过滤器。
值类型：Array
默认值：'**'
用法：fis.set('project.files', ['*.html']);

5.project.ignore
解释：排除某些文件
值类型：Array
默认值：['node_modules/**', 'output/**', 'fis-conf.js']
用法：fis.set('project.ignore', ['*.bak']); // set 为覆盖不是叠加

6.project.fileType.text
解释：追加文本文件后缀列表。
值类型：Array | string
默认值：无
说明：fis系统在编译时会对文本文件和图片类二进制文件做不同的处理，文件分类依据是后缀名。虽然内部已列出一些常见的文本文件后缀，但难保用户有其他的后缀文件，内部已列入文本文件后缀的列表为： [ 'css', 'tpl', 'js', 'php', 'txt', 'json', 'xml', 'htm', 'text', 'xhtml', 'html', 'md', 'conf', 'po', 'config', 'tmpl', 'coffee', 'less', 'sass', 'jsp', 'scss', 'manifest', 'bak', 'asp', 'tmp' ]，用户配置会 追加，而非覆盖内部后缀列表。
用法：编辑项目的fis-conf.js配置文件
fis.set('project.fileType.text', 'tpl, js, css');

7.project.fileType.image
解释：追加图片类二进制文件后缀列表。
值类型：Array | string
默认值：无
说明：fis系统在编译时会对文本文件和图片类二进制文件做不同的处理，文件分类依据是后缀名。虽然内部已列出一些常见的图片类二进制文件后缀，但难保用户有其他的后缀文件，内部已列入文本文件后缀的列表为： [ 'svg', 'tif', 'tiff', 'wbmp', 'png', 'bmp', 'fax', 'gif', 'ico', 'jfif', 'jpe', 'jpeg', 'jpg', 'woff', 'cur' ]，用户配置会 追加，而非覆盖内部后缀列表。
用法：编辑项目的fis-conf.js配置文件
fis.set('project.fileType.image', 'swf, cur, ico');






文件属性：
1.release：
  设置文件的产出路径。默认是文件相对项目根目录的路径，以/开头该值可以设置为false表示为不产出（unreleasable）文件。
2.packTo：
  分配到这个属性的文件将会合并到这个属性配置的文件中；
  fis.match('/widget/{*,**/*}.js', {
    packTo: '/static/pkg_widget.js'
   })
3.packOrder
  用来控制合并时的顺序，值越小越在前面。配合 packTo 一起使用。 
  fis.match('/*.js', {
    packTo: 'pkg/script.js'
  })
  
  fis.match('/mod.js', {
    packOrder: -100
  })
    
4.query
  指定文件的资源定位路径之后的query，比如'?t=123124132'
  fis.set('new date', Date.now());
  fis.match('*.js', {
      query: '?=t' + fis.get('new date')
  });

5.id
  指定文件的资源id。默认是 namespace + subpath 的值
  fis.match('/static/lib/jquery.js', {
    id: 'jquery',
    isMod: true
  });
  使用
  var $ = require('jquery');


6.moduleId
  指定文件资源的模块id。在插件fis3-hook-module里面自动包裹define的时候会用到，默认是 id 的值。
  fis.match('/static/lib/a.js', {
    id: 'a',
    moduleId: 'a'
    isMod: true
    });
    编译前

    exports.a = 10
    编译后

    define('a',function(require,exports,module){
    exports.a = 10
    })

7.url
  指定文件的资源定位路径，以 / 开头。默认是 release 的值，url可以与发布路径 release 不一致。
  fis.match('*.{js,css}', {
    release: '/static/$0',
    url: '/static/new_project/$0'
})

8.charset
  指定文本文件的输出编码。默认是 utf8，可以制定为 gbk 或 gb2312等。
  fis.match('some/file/path', {
    charset: 'gbk'
  });

9.isHtmlLike 指定对文件进行 html 相关语言能力处理
10.isCssLike 指定对文件进行 css 相关的语言能力处理
11.isJsLike  指定对文件进行 js 相关的语言能力处理

12.useHash
    文件是否携带 md5 戳
    说明：文件分配到此属性后，其 url 及其产出带 md5 戳；
    fis.match('*.css', {
      useHash: false
    });

    fis.media('prod').match('*.css', {
      useHash: true
    });
13.domain
    给文件 URL 设置 domain 信息
    说明：如果需要给某些资源添加 cdn，分配到此属性的资源 url 会被添加 domain；
    fis.media('prod').match('*.js', {
      domain: 'http://cdn.baidu.com/'
  });


14.rExt
    设置最终文件产出后的后缀
    说明：分配到此属性的资源的真实产出后缀
    fis.match('*.less', {
      rExt: '.css'
  });
源码为.less文件产出后修改为.css文件；


15.useMap
  文件信息是否添加到 map.json
  说明： 分配到此属性的资源出现在静态资源表中，现在对 js、css 等文件默认加入了静态资源表中；
  fis.match('logo.png', {
    useMap: true
  });

16.isMod
    标示文件是否为组件化文件
    说明：标记文件为组件化文件。被标记成组件化的文件会入map.json表。并且会对js文件进行组件化包装。
    fis.match('/widget/{*,**/*}.js', {
      isMod: true
    });

17.extras
在[静态资源映射表][]中的附加数据，用于扩展[静态资源映射表][]表的功能。
fis.match('/page/layout.tpl', {
  extras: {
      isPage: true
  }
});

18.requires
    默认依赖的资源id表
    fis.match('/widget/*.js', {
      requires: [
          'static/lib/jquery.js'
      ]
    });

19.useSameNameRequire
    开启同名依赖
    说明：当设置开启同名依赖，模板会依赖同名css、js；js 会依赖同名 css，不需要显式引用。
    fis.match('/widget/**', {
      useSameNameRequire: true
    });

20.useCache
  文件是否使用编译缓存
  说明：当设置使用编译缓存，每个文件的编译结果均会在磁盘中保存以供下次编译使用。设置为 false 后，则该文件每次均会被编译。
  fis.match('**.html', {
    useCache: false
});

21.useCompile
    FIS是否对文件进行编译
    说明：设置为 false 后文件会通过FIS发布，但是FIS不对文件做任何修改
    fis.match('**.html', {
      useCompile: false
    });





插件属性:
1.lint
启用 lint 插件进行代码检查
fis.match('*.js', {
  lint: fis.plugin('js', {

  })
})


2.parser 
启用 parser 插件对文件进行处理；
fis.match('*.less', {
  parser: fis.plugin('less'), //启用fis-parser-less插件
  rExt: '.css'
});
fis.match('*.sass', {
  parser: fis.plugin('node-sass'), //启用fis-parser-node-sass插件
  rExt: '.css'
})

4.preprocessor
标准化前处理
fis.match('*.{css,less}', {
  preprocessor: fis.plugin('image-set')
});

5.standard
自定义标准化，可以自定义 uri、embed、require 等三种能力，可自定义三种语言能力的语法；




6.postprocessor
标准化后处理
fis.match('*.{js,tpl}', {
  postprocessor: fis.plugin('require-async')
})
7.optimizer
启用优化处理插件，并配置其属性
fis.match('*.css', {
  optimizer: fis.plugin('clean-css')
})