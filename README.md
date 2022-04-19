<img src="https://raw.githubusercontents.com/YiiGaa/Trick/master/Prop/Common/Img/logo.png" width="300"/>

Trick是关注项目过程、轻量易用、模块化、模块拿来即用的前端网页架构。

- 最新稳定版本: v1.0
- 使用文档详见官网，[点击跳转使用手册](https://stoprefactoring.com/#content@content#framework/trick/)

## 编写网页就像玩拼图一样

Trick架构是一套前端的顶层架构，架构本身只约束了工程结构和开发过程，对前端基础技术无任何改造和深度封装（原生HTML开发）。

Trick架构关注的是开发效率和维护成本，保证业务开发人员以近似千人一面的方式完成业页面的开发。

Trick架构的模块是可以单独调试的，可不断积累复用模块，直接复制文件夹到别的项目即可使用。

Trick架构是具备成长性的，A项目积累下来的模块代码，可以直接使用在B项目中，实现项目复利。

提供官方模块库，模块放入指定目录即可使用，[点击跳转](https://stoprefactoring.com/#content@content#module/front/)。

## 架构基础技术

此架构是一种顶层架构，架构本身只约束了工程结构和开发过程，对基础技术无任何改造和深度封装。

架构中的基础技术如下：

- 开发语言：原生HTML（HTML、CSS、JavaScript）

- 基础框架：vue.js（2.5.16）、jQuery（1.12.4）、Bootstrap（5.1.1）


其中，基础框架是可以替换的，请[查看替换方法](https://stoprefactoring.com/#content@content#framework/trick/other-dependence)，或者[联系官方](https://stoprefactoring.com/#content@content#consult/suport/suport-overview)打造个性化工程

## 知识前提要求

在使用Trick架构前，请学习HTML5、CSS、JavaScript、网页开发、vue.js、Bootstrap等相关知识。

Trick架构只是一种规则，实际上是一个原生的前端网页工程，要想真正使用起来，还是需要先学习这些知识。

## 设计思想

从宏观上讲，页面是多个模块的集合，即一个页面是由多个模块拼装而成的。前端代码可以分成两层，页面层和模块层。也就是说，页面可以看作是一个沙盒，在页面的沙盒中拼接模块即可完成页面开发，如图所示。页面只负责布局，具体的控件细节交由模块完成。这样，一个模块即可被多个页面所使用。另外，模块本身也应该可以单独调试。

![](https://raw.githubusercontents.com/YiiGaa/Trick/master/Prop/Common/Img/designconcept.png)
