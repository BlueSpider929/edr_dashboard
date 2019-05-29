
class DoughnutGauge{
	constructor(div_id, config_options = null){
		
		this.initConfigOptons(config_options);

		this.canvas = document.createElement('canvas');		
	    this.canvas.width = this.config.canvasWidth;
        this.canvas.height = this.config.canvasHeight;
        this.canvas.style.zIndex = 100;
        this.canvas.style.position = 'absolute';

        this.canvas_value = document.createElement('canvas');		
	    this.canvas_value.width = this.config.canvasWidth;
        this.canvas_value.height = this.config.canvasHeight;
        this.canvas_value.style.zIndex = 200;
        this.canvas_value.style.position = 'absolute';

        this.canvas_ball = document.createElement('canvas');		
	    this.canvas_ball.width = this.config.canvasWidth;
        this.canvas_ball.height = this.config.canvasHeight;
        this.canvas_ball.style.zIndex = 300;
        this.canvas_ball.style.position = 'absolute';


        var div = document.getElementById(div_id);
        div.style.width = String(this.canvas.width) + 'px';
        div.style.height = String(this.canvas.height) + 'px';
        

        div.appendChild(this.canvas);
        div.appendChild(this.canvas_value);
        div.appendChild(this.canvas_ball);

		this.ctx = this.canvas.getContext("2d");
		this.ctx_value = this.canvas_value.getContext("2d");
		this.ctx_ball = this.canvas_ball.getContext("2d");

		this.centerX = this.canvas.width / 2;
		this.centerY = this.canvas.height / 2;

		this.outerCircleRadius = this.config.circleRadius;
		this.innerCircleRadius = this.config.circleRadius * this.config.circleSLRadiusRatio;
		this.midleCircleRadius = (this.config.circleRadius + this.innerCircleRadius) / 2;

		this.ballRadius = this.outerCircleRadius * this.config.ballRadiusRatio;
	}

	initConfigOptons(config_options){

		this.config = {
			canvasWidth	: 300,
			canvasHeight	: 300,

			circleRadius	: 130, //out-radius of the circle on which ball rotates
			circleSLRadiusRatio : 0.9, //ratio of the in-radius by out-radius of the circle
			circleColor	: ['#1f4181', '#2765a6', '#151858'], //start, middle, end color of circle
			circleImg : 'img/circle.png',


			ballRadiusRatio : 132 / 769.0, //ratio of the radus of ball by the out-radius of the circle
			ballImg : 'img/ball.png',

			maxValue	: 100, //max value
			valueUnit	: '%', //value unit			
			valueFontColor : '#224b8b',
			valueFont : '20px Arial',

			titleFontColor : '#225a9f',
			titleFont : '14px Arail',

			ballMovementMethod : 0, //0 - Normal Movement, 1 - EaseIn, 2 - EaseOut
			ballMovementTimePeriod : 800, //miliseconds in which ball moves to the destination
			ballMovementTimeInterval : 20 //timer interval
		}

		if(config_options == null)
			return;

		for (var prop in config_options) 
	        this.config[prop] = config_options[prop];
	}

	addColorToGradient(grad, inverse = false){
		if(inverse){
			grad.addColorStop(1, this.config.circleColor[0]);
			grad.addColorStop(0.5, this.config.circleColor[1]);
			grad.addColorStop(0, this.config.circleColor[2]);	
		}else{
			grad.addColorStop(0, this.config.circleColor[0]);
			grad.addColorStop(0.5, this.config.circleColor[1]);
			grad.addColorStop(1, this.config.circleColor[2]);	
		}		
	}

	drawWithBall(value, title){
		if(value > this.config.maxValue){
			console.log('ERROR - value is larger than maximum value!');
			return;
		}

		this.value = value;
		this.title = title;
		this.clearRect();
		this.drawCircle();

		this.angle = Math.PI * 2 * this.value / this.config.maxValue - Math.PI / 2;

		var r = this.midleCircleRadius;
		var pos_x = this.centerX;
		var pos_y_top = this.centerY - r;
		var pos_y_bottom = this.centerY + r;

		var cur_y = this.centerY + r * Math.sin(this.angle);

		if(this.angle <= Math.PI / 2){
			this.grad = this.ctx.createLinearGradient(pos_x, pos_y_top, pos_x, cur_y);
			this.addColorToGradient(this.grad);
			
		}else{
			var beta = this.angle - Math.PI / 2;
			var yy = (1 - Math.cos(beta)) * r;
			console.log('yy=', yy);

			var y2 = pos_y_bottom + yy;
			this.grad = this.ctx.createLinearGradient(pos_x, pos_y_top, pos_x, y2);
			this.addColorToGradient(this.grad);

			var y1 = 2 * r + pos_y_bottom;
			var y2 = pos_y_bottom - yy;
			this.grad1 = this.ctx.createLinearGradient(pos_x, y1, pos_x, y2);
			this.addColorToGradient(this.grad1);
		}

		if(this.ball){
			this.moveBall();	
		}else{
			this.ball = new Image();

			var DOUGHNUT = this;
			this.ball.onload = function() {
	    		DOUGHNUT.moveBall();
	   		}; 
	       	this.ball.src = this.config.ballImg;
		}
		
	}

	clearRect(ctx = null){
		if(ctx == null){
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx_value.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx_ball.clearRect(0, 0, this.canvas.width, this.canvas.height);
			return;
		}
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);		
	}
	
	getEaseValue(count, value){
		var c = count + 1;
		var v = value + 1;
		var x = 2;
		var iteration = 10000;
		for(var i = 0; i < iteration; i ++)
			x = x - (Math.pow(x, c) - x * v + v - 1) / (c * Math.pow(x, c - 1) - v);
		return x;
	}

	nextSpeed(v){
		if(this.incValue)
			return this.speed;
		else
			return  this.speed * this.powerValue;
	}
	moveBall(){
		//this.drawBall(this.angle, 60);
		var count = this.config.ballMovementTimePeriod / this.config.ballMovementTimeInterval;
		this.cc = 0;
		this.currentValue = 0;

		if(this.config.ballMovementMethod == 0){ //Normal			
			this.incValue = this.value / count;				
			this.speed = this.incValue;
		}
		else if(this.config.ballMovementMethod == 1){ //EaseIn
			var v = this.getEaseValue(count, this.value);
			console.log('v = ', v, 'count=', count, 'value=', this.value);
			this.speed = 1;			
			this.powerValue = v;

		} else if(this.config.ballMovementMethod == 2){ //EaseOut
			var v = this.getEaseValue(count, this.value);
			console.log('v = ', v, 'count=', count, 'value=', this.value);

			this.speed = Math.pow(v, count + 1);
			this.powerValue = 1 / v;
		}
		
		console.log('inc value=', this.incValue, 'powerValue=', this.powerValue, 'currentValue=', this.currentValue, 'timer interval=', this.config.ballMovementTimeInterval);
		this.timer = setInterval(this.drawBallTimer, this.config.ballMovementTimeInterval, this);
		//setInterval(this.logTimer, this.config.ballMovementTimeInterval);
	}
	logTimer(){
		console.log(1);
	}

	drawBallTimer(that){
		//console.log('cc=', that.cc);
		//that.cc++;
		that.clearRect(that.ctx_value);
		that.clearRect(that.ctx_ball);		
		that.speed = that.nextSpeed(that.currentValue);
		that.currentValue += that.speed;
		//console.log('current=', that.currentValue, 'value=', that.value, 'speed=', that.speed);

		if(that.currentValue >= that.value){
			clearInterval(that.timer);
			that.currentValue = that.value;
		}
		var angle = (that.currentValue / that.config.maxValue) * Math.PI * 2 - Math.PI / 2;
		that.drawBall(angle, that.currentValue);		
		
	}
	drawBall(angle, value){

		this.ctx_value.save();

		this.ctx_value.beginPath();		
		this.ctx_value.arc(this.centerX, this.centerY - this.midleCircleRadius, (this.outerCircleRadius - this.innerCircleRadius) / 2, 0, Math.PI * 2);
		this.ctx_value.fillStyle = this.config.circleColor[0];		
		this.ctx_value.fill();

		if(angle <= Math.PI / 2){
			this.ctx_value.beginPath();		
			this.ctx_value.arc(this.centerX, this.centerY, this.midleCircleRadius, -Math.PI / 2, angle);
			this.ctx_value.strokeStyle = this.grad;
			this.ctx_value.lineWidth = this.outerCircleRadius - this.innerCircleRadius;
			this.ctx_value.stroke();
		} else{
			this.ctx_value.beginPath();		
			this.ctx_value.arc(this.centerX, this.centerY, this.midleCircleRadius, -Math.PI / 2, Math.PI / 2);
			this.ctx_value.strokeStyle = this.grad;
			this.ctx_value.lineWidth = this.outerCircleRadius - this.innerCircleRadius;
			this.ctx_value.stroke();

			this.ctx_value.beginPath();		
			this.ctx_value.arc(this.centerX, this.centerY, this.midleCircleRadius, Math.PI / 2, angle);
			this.ctx_value.strokeStyle = this.grad1;
			this.ctx_value.lineWidth = this.outerCircleRadius - this.innerCircleRadius;
			this.ctx_value.stroke();
		}
		
		var posx = this.centerX + this.midleCircleRadius * Math.cos(angle);
		var posy = this.centerY + this.midleCircleRadius * Math.sin(angle);		
		this.ctx_value.restore();

		this.ctx_ball.save();

		this.ctx_ball.drawImage(this.ball, posx - this.ballRadius, posy - this.ballRadius, this.ballRadius * 2, this.ballRadius * 2);
		

		this.ctx_ball.font = this.config.valueFont;
        this.ctx_ball.fillStyle = this.config.valueFontColor;
		this.ctx_ball.textBaseline = 'top';
		this.ctx_ball.textAlign = 'center';
		this.ctx_ball.fillText(String(parseInt(value)) + this.config.valueUnit, this.centerX, this.centerY);

		this.ctx_ball.restore();
	}

	drawCircle(){

		this.circle = new Image();
		var DOUGHNUT = this;
	    this.circle.onload = function() {
	    	DOUGHNUT.ctx.save();
	    	var x = DOUGHNUT.canvas.width / 2 - DOUGHNUT.config.circleRadius;
	    	var y = DOUGHNUT.canvas.height / 2 - DOUGHNUT.config.circleRadius;
            DOUGHNUT.ctx.drawImage(DOUGHNUT.circle, x, y, DOUGHNUT.config.circleRadius * 2, DOUGHNUT.config.circleRadius * 2);

            DOUGHNUT.ctx.font = DOUGHNUT.config.titleFont;
            DOUGHNUT.ctx.fillStyle = DOUGHNUT.config.titleFontColor;
			DOUGHNUT.ctx.textBaseline = 'bottom';
			DOUGHNUT.ctx.textAlign = 'center';
			DOUGHNUT.ctx.fillText(DOUGHNUT.title, DOUGHNUT.centerX, DOUGHNUT.centerY - 3);

            DOUGHNUT.ctx.restore();
	   	}; 
	      
	    this.circle.src = this.config.circleImg;

	}



}
