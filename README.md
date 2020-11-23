### vue-comps-manager
>为你的项目增加更灵活的钩子函数，把组件系统变得可管理

适用于vue项目开发的单页应用。

解决的问题：
1 组件/组件层级过深导致的传值繁琐问题
2 使用keep-alive组件导致不能及时更新的问题

优点：
1 增加onshow/onleave钩子，不受 keep-alive组件的缓存影响。
2 可以提供的API 方便的拿到任何（已注册）的组件。
3 减少了多层嵌套组件导致的空间复杂度

注意事项： 
1 需要配合vue-router 使用

#####  安装
```
 npm install vue-comps-manager --save--dev
```

#####  配置main.js
```
import router from '@/router/index'
import CompMan from "vue-comps-manager";

CompMan(router)
```

以上基本配置已经完成

##### 开始配置页面：onshow/onleave
onshow/onleave 钩子配置在 页面的根对象上；
效果： 

* 当路由跳转到该组件会执行onshow, 并带回跳转的参数
* 当路由从一个组件离开到另一个组件会执行onleave 并去向带回到参数中

 a.vue
```
export default {
   name: "a",  // 这里必须配置
   onshow: function (query) {},
   onhide: function (toPath) {}
}
// 如果页面不需要onshow/onhide钩子那么就无需配置。
```

#####  配置全局响应函数（路由发生变化即执行）
注意：
1 name属性是必须的需要依靠该字段 与组件建立映射关系
App.Vue

```
export default {
    name: "app"
    methods: {
        compManGOL () {
            return {
                 a () {},
                b () {},
                c () {}
            }
        }
    }
}
```
"compManGOL" 是默认的全局钩子配置方法， 把想在路由变化即触发的函数放在其中。即可， 同时执行 a,b,c .... 函数

如果你觉得 "compManGOL" 这个名字 你不喜欢，那么继续看到最后 他也是可配置的


##### 组件配置：

在每个想要管理的组件配置响应的名字即可
如：
a.vue
```
export default {
    name: "a"
}
```
b.vue
```
export default {
    name: "b"
}
```

##### 获取组件： 
```
//在任意的组件中：
this.$lib_get("a") //即可获取 a组件
this.$lib_get("b") // 获取b组件
```

##### 个性化配置

提供.config方法实现个性化的配置
目前提供两个配置项：
1 root 作为组件的根节点可以不仅仅叫 app 可以叫任意你觉得好听的名字 （默认 : app）
2 methodsLibName 全局响应函数的仓库 指定一个名称 （默认： compManGOL）

```
import router from '@/router/index' 
import CompMan from "vue-comps-manager";

CompMan(router).config({root: "xxxxPage",methodsLibName: "xxxxOpts" });

```




GitHub：[ https://github.com/allensunjian/vue-components-manager]( https://github.com/allensunjian/vue-components-manager)
### 作为一个前端小学生 希望各位大大点颗星星鼓励
