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
