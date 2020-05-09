# swriperGatewayWebApp
一个可通过一组轮播按钮切换背景的自适应门户网站，轮播按钮组和切换效果都是原生Javascript实现

# 具体实现效果如下
![](https://raw.githubusercontent.com/qtpalmtop/swriperGatewayWebApp/master/images/demo-gif.gif)

# 实现思路
轮播按钮组：需要达到连续滚动的效果，因此中间5个按钮左右其实分别还有两个按钮，按钮组容器通过overflow控制按钮隐藏，如果左右两边隐藏按钮方式是display:none来控制，则无法达到滚动的效果；
