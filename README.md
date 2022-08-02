# zhihu_project

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### 笔记

#### 权限认证的两种方式 8-2
上节我们实现了获取 神奇的token，它是我们告诉后端 我已经登录的重要标识符
那么它是怎样工作的呢，这节我们了解一下，在web应用中呢，是怎样完成权限认证的

首先呢说一下比较传统的解决方案

1. 基于cookie和session的方案
首先我们post 用户名密码，给服务器验证，如果验证正确，就会创建一个对应的session数据并且保存
这个session数据可以保存在内存中或者数据库中
保存完毕之后会发送返回一个HTTP状态码 200 ok 的response，这个response中一般会有一个header叫Set-Cookie：然后带上sessionid
浏览器拿到这个response以后呢，因为有Set-Cookie这个header，就会把这个cookie保存到这个浏览器中
下次我们访问需要权限的接口以后，比如请求Get/api/user 就会自动把这个cookie带上 Cookie:sessionid
然后就到服务器端，服务器端会使用Cookie中的信息sessionid查看服务器是否存在该session数据
如果验证存在，则返回HTTP 200 ok {name:'Guguuu'}，不存在的话则 HTTP 401 Not authorized。

基于Cookie的身份验证是有状态的，意味着这个验证记录，或者会话，必须同时保存在服务器端和客户端，服务器端需要跟踪记录session并且存至内存或者数据库
同时我们的前端在Cookie中要保存对应的sessionid做为session唯一的标识符。

这种模式的问题在于它的扩展性不好，如果只有一台服务器还好，如果是多台服务器，就意味着要实现session共享

另外一种解决方案
2. 称之为token bases 基于token的解决方案
不同于之前要在服务器中保存信息的特点，它把所有的信息都保存在客户端，之后每次请求都将生成的信息发回服务器
json web token (JWT) 就是这种方案的一个代表

首先还是 将用户名密码以post方式发送给服务器，这时候，服务器端验证我们的登录信息登录成功的时候呢，会使用JWT算法生成已签名的token
这个token，会随着 HTTP 200 ok 返回到浏览器端，浏览器把这个token储存在客户端，最常见的就是储存在localstroage或者sessionstroage中
之后每一次向服务器发送请求，都会携带上这个token，我们可以放在Cookie中自动发送，但是这样不能跨域
所以最好做法就是官方文档里写的，把token放在HTTP请求的头信息Header :{ Authorization:Bearer<token>}
发送过去之后，服务器拿到了这个token信息，然后JWT反向验证，验证对应的token是否正确
如果验证通过，就返回HTTP 200 ok，并带上对应的信息。不通过则 HTTP 401 Not authorized
如果用户退出登录，token就会在客户端销毁，把什么localStroage或者sessionStroage销毁就完事了，这一步与服务器无关

然后发现，基于token的身份验证是没有状态的，即服务器不用记录哪些用户已经登录或者哪些jwt已经处理，每个发送到服务器的请求都会带上一个token
服务器利用这个token检查确认请求的真实性。

token的组成
通过加密算法，将用户的一些信息，比如id，密码储存在一个加密的字符串当中，以后用户与服务器端通信的时候，都要发送这个token
服务器完全可以只靠这个来认证用户的身份。所以服务器变成了一个无状态的，从而容易实现扩展，你想要部署多少台服务器都可以。

#### 8-4 持久化登录状态⭐⭐
 8-3的提交中我设置了axios的通用header，还使用了组合action完成了 让Login组件触发这个组合Action，完成登录获取token并且获取当前用户

 但存在一个问题，即虽然登录了，但一刷新，登录状态就消失了。需要重新登录等一系列操作
 网站的一个常用需求就是去记住用户的登录状态。
 如果要记住登录状态，就需要将数据持久化在一个地方。
 有3种选择，即Cookie、localStorage、sessionStorage，而Cookie不支持跨域，不在考虑范围之内

 这里我选择localStorage，长期保留数据。

 确定了方案之后，我们应该存什么？ 是否要把登录的所有User信息一股脑全部存进去？
 这个localStorage是我们前端完全可控的，用户可以往里面伪造任何的内容。
 只有token才是我们和后端访问的唯一凭证，所以我们要把token存入localStorage
 随后每次进入App，用已经存好的token发送一次fetchCurrentUser拿到真实的User信息

 而token也是有时效性的，假如在请求的时候，后端返回错误信息，就可以弹出提示，同时把localStorage清空
 
 1. 首先在store中，获取token的同时把他保存在localStorage中，并且把store的token的取值设置从本地存储拿。
 2. 然后当App第一次加载的时候，判断token是否存在&&用户还未登录
 3. 满足条件则 --> 设置Authorization头 并且发送fetchCurrentUser请求
 4. 请求成功 ---> 显式用户登录信息
 5. 请求失败 或者token过期  显式错误提示 清空localStorage token (请求错误应该是一个全局的反馈，当token过期或者用户输入错误，或者其他问题，要有一个反馈，不然就会一直显式Loader组件。所以应该在store中)
 
 本次8-5提交，由于没有处理退出登录，所以本地存储会一直保存这个token，所以哪怕重新运行项目，也会保持登录状态

 #### 8-6 创建Message组件
 上一次提交做了一个简单的message错误提示。这一次呢我把它抽象成一个message组件
 Message组件是一个用于全局提示的组件，它不仅可以显示错误的信息，还可以添加成功操作的信息。
 甚至显示一个普通的提示。所以应该要有三种类型。

 和Loader组件一样，一看就知道是一个全局性质的组件，所以它也应该和Loader组件一样，使用Teleport标签添加到根节点去。 而不是附属于某一个特定的组件。

 Message右边还有一个可关闭的按钮，所以这个组件应该需要一个状态存在

 至于样式嘛，嘿嘿，bootstrap复制！！

 emm 在Loader和Message中

            const node = document.createElement('div')
            node.id = 'message'
            document.body.appendChild(node)
    
    这样一段代码是很重复的。我们把它抽出来放在useDOMCreate.ts中


#### 8-7 Message组件改进为函数调用形式
现在我们的组件都是嵌套在组件树中进行展示的，但是Message组件使用这种方式会感觉比较奇怪
它应该是像一个函数一样进行工作的 比如 createMessage('hello','error')

#### 8-8 
上一次提交完成了函数式调用的改造。看起来已经比较完美了，但真的是这样嘛？
如果你再去审视对应的代码，发现其实这个通过createApp创建出来的组件实例对象是 App<Element>类型
createApp返回的是一个App类型，是一个对应的应用实例。在之前，我们只在main.ts见过它
我们createMessage.ts的目的只是为了创建一个组件，但却创建了一个对应的应用实例
这其实有点杀鸡用牛刀的感觉

那有没有其他优化方案呢。有。

首先要理解Vnode以及vue的简单工作原理
VitrulalDOM：一种虚拟的，保存在内存中的数据结构，用来代表UI的表现，和真实DOM节点保持同步。VirtualDOM是由一系列的Vnode组成的。

模拟一个简单的Vnode
const vnode = {
    type:'div',
    props:{
        id:'hello'
    },
    children:[
        /* more vondes */
    ]
}

h 和 createVnode都可以创建vnode，h是hyperscript的缩写，意思就是“JavaScript that produces HTML”
很多virtualDOM的实现都使用这个函数名称。

两个函数的用法几乎一样，看看h的
const vnode = h(
    'div',
    {id:'foo',class:'bar'}, // 属性  
    [   // 第三个参数有很多表现形式
        /* children */
    ]
)

#### 8-9
##### 声明 Render Function：
当使用 组合API的时候，在setup中直接返回一个对象，代表着给模板使用数据，当要使用render function的时候，可以直接返回一个函数,然后在函数当中就可以返回一系列节点
比如
setup(props){
    const count = ref(1)
    return () => [h('h1',props.msg),h('div',count.value)] 
    // 没有对应的属性可以直接写children，多个Vnode则用数组的形式
}

👉理解： h函数是用来创建Vnode的，而render函数是用来将templete模板转换成一个个的Vnode从而形成一个虚拟DOM树，从而h函数应该被render函数包裹。进而因为h函数不利于书写，所以我们换成jsx的这种方式来在render函数中创建Vnode节点。

我们发现如果一直用h这样的写法，简单的时候还可以，当你有非常多非常多的节点的时候，这时候有可能会非常繁琐
并且难以读懂，那么有没有更容易让人读懂的格式呢，这时候JSX就出现了

##### 使用JSX：
JSX是一种类似XML的语法，如果学过React对它应该特别熟悉。他就是h函数的一种语法糖。可以将这种类似HTML的语法转换成h函数的写法。

// 创建vnode
const vnode = <div>hello</div>
// 使用变量
const vnode = <div id={dynamicId}>hello,{userName}</div>

添加JSX支持
vue add babel

使用这种语法需要改文件后缀名，如果是JS则改成JSX，如果是ts，则改成tsx
示例：
export default defineComponent({
    name:'asdasd'
    props:{. .. . . .}
    setup(props){
        const count = ref(1)
        return () => {
            <div>
                <h1>{props.msg}</h1>
                <p>{count.value}
            </div>
        }
    }
})

总结：一般情况下，使用template写法能满足大部分需求，但是有可能有一小部分组件有可能需要使用h render function的写法，因为它呢是一个JS的原生写法，要比template更强大一些，所以选择不同的写法要按照不同的需求来看


#### 8-10 使用h函数改造Message组件
之前说过利用createApp创建对应的组件实例是一个App类型的实例，这个东西太重了，杀鸡用牛刀的感觉
我们可以改造成8-8 8-9 中提到过的vnode

#### 9-1 上传组件分析
在项目中的真实场景是怎样的呢
一开始要有一个区域是可以点击上传的，点击之后和这个input type = file 一样会弹出一个原生的对话框让你选择哪个文件或者哪个图片，点击之后显示 “正在上传中”
上传之后会显示对应的缩略图
可以点击删除，删除已经上传的图片

从这个流程，我抽象出一个典型的上传组件的基本需求，而不是从逻辑上简单的完成这个功能即可

有一个 概念非常重要，就是这整个流程，因为上传是非常考究流程的过程
他像Vue组件一样有一个完整的生命周期，所以我们这个组件应该暴露出来对应的事件对应上传的不同流程
比如 一开始我们是有能力让用户去检查文件的格式或者大小的，所以提供一个属性叫 beforeUpload他是一个function，让用户去选一些具体需求
通过这个function以后呢，又触发了uploading这个事件
上传成功之后，触发fileUploaded
上传失败，uploaddeError

简单分析之后，得出这个组件应该有一个
action：代表发送到哪
beforeUpload：完成上传前的校验
@uploading、@fileUploaded、@uploadedError

#### 9-2 上传文件的两种实现方式
文件上传的原理。
在使用一个web应用的时候，或多或少会遇到一个文件上传的例子。
那么这个文件上传的需求的基本流程是什么呢？

先从最基本的form提交谈起。
既然要上传文件，就要选择文件，可以使用 input type = file 这时候就会渲染出一个选择文件的对话框
当文件选择完毕之后呢，有两种方法来上传
① 是利用传统的form 表单提交的方式
② 使用js发送异步ajax请求的方式

先看看form的基本例子。
当我们选择文件，点击submit的时候，就会运行form的默认行为。
带着input的数据，发送一个httprequest请求到action属性中的地址
服务端接到对应的请求会做对应的处理并返回结果。这是典型的client到server的形式
这里需要注意的是，我们发送的文件，文件是二进制格式，所以我们需要在form中设置一个属性
叫 enctype="multipart/form-data"
表单默认的格式是 application/x-www-form-urlencoded

有了这些基础知识，我们就能使用js来发送异步的上传文件的post请求了
提交form其实也就是发送http请求，而使用js发送异步当然有更好的体验

#### 9-3
上次我们测试了axios异步上传的过程
这次我们把它弄到Uploader组件中

#### 9-4 9-5
上次提交完成了上传组件最基本的一些流程。
这次将之前提到的功能慢慢丰富进去。
第一大功能就是在不同的阶段暴露出一系列不同的事件,对于用户想在不同阶段进行一些自定义操作的话非常有用
第二个是自定义模板。用户可以根据需求渲染自己需要的界面

#### 9-6 改进路由验证系统

#### 9-7 在创建文章界面添加 Uploader组件

#### 9-8 创建文章最后流程
1. 添加文件上传验证
    之前完成了类似的代码，比如自定义的beforeupload方法。但在这里，我们把它抽象成通用的函数
    验证的关键在于验证文件的格式和大小,自然要创建两个通用参数把这两个做为条件。创建了一个helper.ts
    里面放一些通用的参数
2. 发送异步请求创建文章

#### 9-9 完成文章详情页
1. 创建对应的页面pages 和 路由Router
2. 创建跳转链接ColumnDetail页面
3. 发送获取单独文章的请求(Store 和 pages)
4. 分析返回数据结构和需求


