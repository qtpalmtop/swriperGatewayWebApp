// 浮动标签构造函数
function FloatTags() {
	this.radius = 240;
	this.dtr = Math.PI/180;
	this.d=500;
	this.mcList = [];
	this.active = false;
	this.lasta = 1;
	this.lastb = 1;
	this.distr = true;
	this.tspeed=10;
	this.size=250;
	// x轴横向拉伸倍率
	this.xExpandLevel = 1.5;
	// y轴纵向拉伸倍率
	this.yExpandLevel = 0.5;

	this.mouseX=0;
	this.mouseY=0;

	this.howElliptical=2;

	// 单个元素项DOM
	this.aA=null;
	this.oDiv=null;

	this.sa = 0;
	this.ca = 0;
	this.sb = 0;
	this.cb = 0;
	this.sc = 0;
	this.cc = 0;

	// 初始化方法
	this.init = () => {

		var i=0;
		var oTag=null;
		
		this.oDiv = document.getElementById('tagsList');
		
		this.aA = this.oDiv.getElementsByTagName('a');
		
		for(i=0;i<this.aA.length;i++) {
			oTag={};
			
			oTag.offsetWidth=this.aA[i].offsetWidth;
			oTag.offsetHeight=this.aA[i].offsetHeight;
			
			this.mcList.push(oTag);
		}
		
		this.sineCosine( 0,0,0 );
		
		this.positionAll();
		
		this.oDiv.onmouseover= () => {
			this.active=true;
		};
		
		this.oDiv.onmouseout= () => {
			this.active=false;
		};
		
		this.oDiv.onmousemove= (ev) => {
			var oEvent=window.event || ev;
			
			this.mouseX=oEvent.clientX-(this.oDiv.offsetLeft + this.oDiv.offsetWidth/2);
			this.mouseY=oEvent.clientY-(this.oDiv.offsetTop + this.oDiv.offsetHeight/2);
			
			this.mouseX/=5;
			this.mouseY/=5;
		};
	
		setInterval(this.update, 30);
	
	};

	this.sineCosine = (a, b, c) => {
		this.sa = Math.sin(a * this.dtr);
		this.ca = Math.cos(a * this.dtr);
		this.sb = Math.sin(b * this.dtr);
		this.cb = Math.cos(b * this.dtr);
		this.sc = Math.sin(c * this.dtr);
		this.cc = Math.cos(c * this.dtr);
	};

	this.update = () => {
		var a;
		var b;
		
		if(this.active) {
			a = (-Math.min( Math.max( -this.mouseY, -this.size ), this.size ) / this.radius ) * this.tspeed;
			b = (Math.min( Math.max( -this.mouseX, -this.size ), this.size ) / this.radius ) * this.tspeed;
		}
		else {
			a = this.lasta * 0.98;
			b = this.lastb * 0.98;
		}
		
		this.lasta=a;
		this.lastb=b;
		
		if(Math.abs(a)<=0.01 && Math.abs(b)<=0.01) {
			return;
		}
		
		var c=0;
		this.sineCosine(a,b,c);

		for(var j=0;j<this.mcList.length;j++) {
			var rx1=this.mcList[j].cx;
			var ry1=this.mcList[j].cy*this.ca+this.mcList[j].cz*(-this.sa);
			var rz1=this.mcList[j].cy*this.sa+this.mcList[j].cz*this.ca;
			
			var rx2=rx1*this.cb+rz1*this.sb;
			var ry2=ry1;
			var rz2=rx1*(-this.sb)+rz1*this.cb;
			
			var rx3=rx2*this.cc+ry2*(-this.sc);
			var ry3=rx2*this.sc+ry2*this.cc;
			var rz3=rz2;
			
			this.mcList[j].cx=rx3;
			this.mcList[j].cy=ry3;
			this.mcList[j].cz=rz3;
			
			var per=this.d/(this.d+rz3);
			
			this.mcList[j].x=(this.howElliptical*rx3*per)-(this.howElliptical*2);
			this.mcList[j].y=ry3*per;
			this.mcList[j].scale=per;
			this.mcList[j].alpha=per;
			
			this.mcList[j].alpha=(this.mcList[j].alpha-0.6)*(10/6);
		}
		
		this.doPosition();
		this.depthSort();
	};

	this.depthSort = () => {
		var i=0;
		var aTmp=[];
		
		for(i=0;i<this.aA.length;i++)
		{
			aTmp.push(this.aA[i]);
		}
		
		aTmp.sort
		(
			function (vItem1, vItem2)
			{
				if(vItem1.cz>vItem2.cz)
				{
					return -1;
				}
				else if(vItem1.cz<vItem2.cz)
				{
					return 1;
				}
				else
				{
					return 0;
				}
			}
		);
		
		for(i=0;i<aTmp.length;i++)
		{
			aTmp[i].style.zIndex=i;
		}
	};

	/**
	 * 清除连接线
	 * @param {HTMLElement} parentDOM
	 * @param {string} lineId line-0,line-1,……
	 */
	this.removeLine = (parentDOM, lineId) => {

		var lineEl = document.getElementById(lineId);

		if (lineEl) {
			parentDOM.removeChild(lineEl);
		}

	};

	this.doPosition = () => {
		var l=this.oDiv.offsetWidth/2;
		var t=this.oDiv.offsetHeight/2;
		var i;
    var tempSortConfig = [0, 10,9,8,4,3,2,5,6,7,5,9,11,2,1];

		// 移除所有连接线
		for(i=0;i<this.mcList.length;i++)
		{
			if (i < this.mcList.length) {
				this.removeLine(this.oDiv, 'line-' + i);
			}
		}

		for(i=0;i<this.mcList.length;i++)
		{
			this.aA[i].style.left=this.mcList[i].cx+l-this.mcList[i].offsetWidth/2+'px';
			this.aA[i].style.top=this.mcList[i].cy+t-this.mcList[i].offsetHeight/2+'px';
			
			this.aA[i].style.fontSize=Math.ceil(12*this.mcList[i].scale/2)+8+'px';
			
			this.aA[i].style.filter="alpha(opacity="+100*this.mcList[i].alpha+")";
			this.aA[i].style.opacity=this.mcList[i].alpha;

      if (i < this.mcList.length) {
        this.drawLine(this.oDiv, this.aA[tempSortConfig[i]], this.aA[tempSortConfig[i + 1]], 2, '#00E4FF', 'line-' + i);
			}

		}
	};

	/**
	 * 画两点间的直线
	 * @param {HTMLElement} parentDOM 父容器元素
	 * @param {HTMLElement} startDOM 开始元素
	 * @param {HTMLElement} endDOM 结束元素
	 * @param {number} height 2
	 * @param {string} backgroundColor '#ccc'
	 * @param {string} lineId line-0,line-1,……
	 */
	this.drawLine = (parentDOM, startDOM, endDOM, height, backgroundColor, lineId) => {
        var lineDivEl = document.createElement('div');
        var y_start =  Number(startDOM.style.top.replace("px", "") || 0) + startDOM.offsetHeight / 2;
        var x_start =  Number(startDOM.style.left.replace("px","") || 0) + startDOM.offsetWidth / 2;
        var y_end =  Number(endDOM.style.top.replace("px","") || 0) + endDOM.offsetHeight / 2;
        var x_end =  Number(endDOM.style.left.replace("px","") || 0) + endDOM.offsetWidth / 2;;
        var deg = 0; 

        if (y_start == y_end) // 画横线
        {
            if (x_start > x_end) {
                var t = x_start;
                x_start = x_end;
                x_end = t
                deg = 180;
            }
            length = Math.abs(x_end - x_start);    
        } else if (x_start == x_end) // 画竖线
        {
            deg = 90;
            if (y_start > y_end) {
                var t = y_start;
                y_start = y_end;
                y_end = t
                deg = 270;
            }
            length = Math.abs(y_end - y_start);
        } else {// 画线旋转角度
            var lx = x_end - x_start;
            var ly = y_end - y_start;
            var length = Math.sqrt(lx * lx + ly * ly); //计算连线长度
            var c = 360 * Math.atan2(ly, lx) / (2 * Math.PI); //弧度值转换为角度值
            c = c <= -90 ? (360 + c) : c;  //负角转换为正角
            deg = c;
        }
	
			lineDivEl.setAttribute('id', lineId);
			lineDivEl.style.position = 'absolute';
			lineDivEl.style.top = y_start + 'px';
			lineDivEl.style.left = x_start + 'px';
			lineDivEl.style.backgroundColor = backgroundColor;
			lineDivEl.style.height = height + 'px';
			lineDivEl.style.width = length + 'px';
			lineDivEl.style.transform = 'rotate(' + deg + 'deg)';
			lineDivEl.style.opacity = '0.6';
			lineDivEl.style.transformOrigin = 'left bottom';
	
			lineDivEl.classList.add('line');
	
			parentDOM.appendChild(lineDivEl);
	};

	this.positionAll = () => {
		var phi=0;
		var theta=0;
		var max=this.mcList.length;
		var i=0;
		
		var aTmp=[];
		var oFragment=document.createDocumentFragment();
		
		//�������
		for(i=0;i<this.aA.length;i++) {
			aTmp.push(this.aA[i]);
		}
		
		aTmp.sort(
			function ()
			{
				return Math.random()<0.5?1:-1;
			}
		);
		
		for(i=0;i<aTmp.length;i++) {
			oFragment.appendChild(aTmp[i]);
		}
		
		this.oDiv.appendChild(oFragment);
		
		for( var i=1; i<max+1; i++){
			if( this.distr ) {
				phi = Math.acos(-1+(2*i-1)/max);
				theta = Math.sqrt(max*Math.PI)*phi;
			}
			else {
				phi = Math.random()*(Math.PI);
				theta = Math.random()*(2*Math.PI);
			}
			
			//����任
			this.mcList[i-1].cx = this.radius * Math.cos(theta)*Math.sin(phi) * this.xExpandLevel;
			this.mcList[i-1].cy = this.radius * Math.sin(theta)*Math.sin(phi) * this.yExpandLevel;
			this.mcList[i-1].cz = this.radius * Math.cos(phi);
			
			this.aA[i-1].style.left=this.mcList[i-1].cx+this.oDiv.offsetWidth/2-this.mcList[i-1].offsetWidth/2+'px';
			this.aA[i-1].style.top=this.mcList[i-1].cy+this.oDiv.offsetHeight/2-this.mcList[i-1].offsetHeight/2+'px';
		}
	}
}
