(function (angular) {
    "use strict";

    angular.module('hpmModule')
        .directive('hpmSign', hmsSignDirective);

    function hmsSignDirective() {
        // 背景canvas
        var global = {
            canvas: '',
            context: '',
            point: {x: 0, y: 0},// 当前位置
            nextPoint: {x: 0, y: 0},// 下一个位置
            cut: 0
        };
        // 签名节点
        var signNode;
        var config = {
            bgColor: '', // 设置画布的背景颜色
            brushSize: 3,//设置画笔的粗细
            brushColor: '',//设置画笔的颜色
            width: 0,//获取画布的宽度
            height: 0//获取画布的高度
        };

        function setPoint(x, y) {
            var newPoint = {};
            newPoint.x = x;
            newPoint.y = y;
            return newPoint;
        }

        function updatePoint(point) {
            if (!global.nextPoint) {
                global.nextPoint = setPoint(0, 0);
            } else {
                global.nextPoint = setPoint(point.x, point.y);
            }
        }

        function loopPoint(e) {
            updatePoint(global.point);
        }


        //触摸滑动事件
        function touchMove() {
            var e = event.touches[0];
            console.log('touchMove');
            global.point = setPoint(e.clientX, e.clientY);
            //$pos_display.innerHTML = '你上一点鼠标的位置为(' + point.x + ',' + point.x + ').<br/>你当前鼠标的位置为(' + next_point.x + ',' + next_point.x + ')';//更新当前鼠标点击的位置
            draw(global.context);
            global.cut++;
        }

        //触摸开始事件
        function touchStart() {
            console.log('touchStart.config'+angular.toJson(config, true));
            var canvas = document.createElement('canvas');
            signNode.appendChild(canvas);
            canvas.width = config.width;
            canvas.height = config.height;
            canvas.addEventListener('touchstart', touchStart, false);
            canvas.addEventListener('touchmove', touchMove, false);
            canvas.addEventListener('touchend', touchEnd, false);

            global.canvas = canvas;
            global.context = canvas.getContext('2d');
            draw(global.context);
            global.cut = 1;
        }

        //触摸结束时间
        function touchEnd() {
            console.log('touchEnd');
            global.context.save();
        }
        function draw(context) {
            if (global.cut > 1) {
                console.log('draw');
                //context.save;//保存当前绘画状态
                context.fillStyle = config.brushColor;//设置填充的背景颜色
                context.lineWidth = config.brushSize;//设置画笔的大小
                context.lineCap = 'round';//设置线条，让线条更加的圆润
                context.beginPath();

                context.moveTo(global.point.x, global.point.y);
                console.log('('+global.point.x+','+global.point.y+')');
                context.lineTo(global.nextPoint.x, global.nextPoint.y);
                console.log('('+global.nextPoint.x+','+global.nextPoint.y+')');
                console.log('画笔:' + global.cut);
                context.stroke();

                /****
                 *context.arc(x, y, radius, startAngle, endAngle, anticlockwise)
                 *参数 x,y表示圆心
                 *radius半径
                 *startAngle起始弧度
                 *endAngle终止弧度
                 *anticlockwise是否为逆时针方向
                 ***/
                context.restore();//回复绘画状态
            }
        }

        // 编译函数
        var compileFn = function (elem, attrs, transclude) {
            var node = elem[0];
            // 初始化配置信息
            global.canvas = node.getElementsByClassName('hms-sign-cav-bg')[0];
            signNode = node.getElementsByClassName('hms-sign-cav')[0];
            global.context = global.canvas.getContext('2d');//获取画布上下文
            config.bgColor = attrs.bgColor || '#FFFFFF'; // 设置画布的背景颜色
            config.brushSize = attrs.brushSize || 3;//设置画笔的粗细
            config.brushColor = attrs.brushColor || '#000000';//设置画笔的颜色
            config.width = global.canvas.width = window.innerWidth;//获取画布的宽度
            config.height = global.canvas.height = window.innerHeight;//获取画布的高度

            return {
                // 编译前
                pre: function preLink(scope, elem, attrs, controller) {
                    //设置背景填充颜色
                    global.context.fillStyle = config.bgColor;
                    //设置画布背景
                    global.context.fillRect(0, 0, config.width, config.height);
                    // 背景画布添加监听
                    global.canvas.addEventListener('touchstart', touchStart, false);
                    global.canvas.addEventListener('touchmove', touchMove, false);
                    global.canvas.addEventListener('touchend', touchEnd, false);

                    /*
                     位置记录
                     setInterval 每隔一定时间调用一次这个方法
                     clearInterval方法：清除对setInterval的调用
                     */
                    setInterval(loopPoint, 10);

                },
                // 编译后
                post: function postLink(scope, elem, attrs, controller) {

                }
            };
        };
        return {
            restrict: "E",
            replace: true,
            templateUrl:'./hand-ionic-plugin-sign.html',
            compile: compileFn
        };

    }


})(angular);