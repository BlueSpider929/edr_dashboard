

import {BaseDonut} from './gauge';

var Doughnut, makeFontString,
slice = [].slice,
hasProp = {}.hasOwnProperty,
extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

makeFontString = function(fontWeight, fontSize, fontFamily) {
    return fontWeight + " " + fontSize + "px " + fontFamily;
}

Doughnut = (function(superClass) {

    extend(Doughnut, superClass);
    
    Doughnut.prototype.options.colorMiddle = "#ffffff";
    Doughnut.prototype.options.colorScale = "#ffffff";

    Doughnut.prototype.options.showTitle = false;
    Doughnut.prototype.options.title = "Application";
    Doughnut.prototype.options.titleColor = "#4172AC";
    Doughnut.prototype.options.titleFontFamily = "Arial";
    Doughnut.prototype.options.titleFontSize = 24;
    Doughnut.prototype.options.titleFontWeight = 400;

    Doughnut.prototype.options.valueColor = "#114587";
    Doughnut.prototype.options.valueFontFamily = "bold Arial";
    Doughnut.prototype.options.valueFontSize = 36;
    Doughnut.prototype.options.valueFontWeight = 500;

    Doughnut.prototype.options.unitType = "%";
    Doughnut.prototype.options.unitColor = "#114587";
    Doughnut.prototype.options.unitFontFamily = "bold Arial";
    Doughnut.prototype.options.unitFontSize = 36;
    Doughnut.prototype.options.unitFontWeight = 500;

    Doughnut.prototype.options.showBall = false;
    Doughnut.prototype.options.ballRadius = 15;
    Doughnut.prototype.options.ballStartColor = "#151A5A";
    Doughnut.prototype.options.ballStopColor = "#2B64A5";
    Doughnut.prototype.options.ballImage = "./assets/hs.png";
    Doughnut.prototype.options.ballBorderScale = 0.3;

    function Doughnut(canvas, options) {
        Doughnut.__super__.constructor.apply(this, arguments);
        this.setOptions(options);
        this.canvas.height = (this.radius + this.options.ballRadius) * 2;
    }

    Doughnut.prototype.getAngle = function(value) {
        var dispAngle = (2 - this.options.angle) * Math.PI + ((value - this.minValue) / (this.maxValue - this.minValue)) * (1 + 2 * this.options.angle) * Math.PI;
        if (dispAngle > 2 * Math.PI)
            dispAngle -= 2 * Math.PI;
        return dispAngle;
    };

    Doughnut.prototype.strokeGradient = function(w, h, start, stop) {
        var grd;
        grd = this.ctx.createLinearGradient(0, 0, 0, w + h);
        grd.addColorStop(0, this.options.shadowColor);
        grd.addColorStop(0.5, this.options.shadowColor);
        grd.addColorStop(1, this.options.shadowColor);
        return grd;
    };

    Doughnut.prototype.radialStrokeGradient = function(w, h, start, stop) {
        var grd;
        grd = this.ctx.createRadialGradient(w, h, start, w, h, stop);
        grd.addColorStop(0, this.options.shadowColor);
        grd.addColorStop(0.32, this.options.colorScale);
        grd.addColorStop(0.88, this.options.colorScale);
        grd.addColorStop(1, this.options.shadowColor);
        return grd;
      };

    Doughnut.prototype.setOptions = function(options) {
        var h, start, stop, w;
        if (options == null) {
            options = null;
        }
        Doughnut.__super__.setOptions.call(this, options);
        w = this.canvas.width / 2;
        h = this.canvas.height / 2;
        start = this.radius - this.lineWidth / 2;
        stop = this.radius + this.lineWidth / 2;
        this.options._orgStrokeColor = this.options.strokeColor;
        this.options.strokeColor = this.strokeGradient(w, h, start, stop);
        this.radius = h - this.options.ballRadius;
        return this;
    };

    Doughnut.prototype.addColorToGradient = function(grad, inverse = false) {
		if(inverse){
			grad.addColorStop(1, this.options.colorStart);
			grad.addColorStop(0.5, this.options.colorMiddle);
			grad.addColorStop(0, this.options.colorStop);	
		}else{
			grad.addColorStop(0, this.options.colorStart);
			grad.addColorStop(0.5, this.options.colorMiddle);
			grad.addColorStop(1, this.options.colorStop);
		}		
	};

    Doughnut.prototype.render = function() {
        var displayedAngle, grdFill, h, start, stop, w, cur_x, cur_y;
        displayedAngle = this.getAngle(this.displayedValue);
        w = this.canvas.width / 2;
        h = this.canvas.height / 2;
        cur_x = w + Math.cos(displayedAngle) * this.radius;
        cur_y = h + Math.sin(displayedAngle) * this.radius;

        if (this.textField) {
          this.textField.render(this);
        }

        grdFill = this.ctx.createLinearGradient(0, 0, 0, h * (1 + this.options.angle * 2) * Math.PI * (this.displayedValue - this.minValue) / (this.maxValue - this.minValue));
        grdFill.addColorStop(0, this.options.colorStart);
        grdFill.addColorStop(0.2, this.options.colorMiddle);
        grdFill.addColorStop(1, this.options.colorStop);
        start = this.radius - this.lineWidth / 2;
        stop = this.radius + this.lineWidth / 2;
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.radialStrokeGradient(w,h,start,stop);
        this.ctx.arc(w, h, this.radius, (2 - this.options.angle) * Math.PI, (1 + this.options.angle) * Math.PI, false);
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = "round";
        this.ctx.stroke();

        // Display the current value circle        
		var r = this.radius;
		var pos_x = w;
		var pos_y_top = h - r;
		var pos_y_bottom = h + r;

		if(displayedAngle <= Math.PI / 2){
			this.grad = this.ctx.createLinearGradient(pos_x, pos_y_top, pos_x, cur_y);
			this.addColorToGradient(this.grad);
			
		}else{
            var beta = displayedAngle - Math.PI / 2;
			var yy = (1 - Math.cos(beta)) * r;

			var y2 = pos_y_bottom + yy;
			this.grad = this.ctx.createLinearGradient(pos_x, pos_y_top, pos_x, y2);
			this.addColorToGradient(this.grad);

			var y1 = 2 * r + pos_y_bottom;
			var y2 = pos_y_bottom - yy;
			this.grad1 = this.ctx.createLinearGradient(pos_x, y1, pos_x, y2);
			this.addColorToGradient(this.grad1);
		}
        
        if (displayedAngle <= Math.PI / 2){
			this.ctx.beginPath();		
			this.ctx.arc(w, h, this.radius, -Math.PI / 2, displayedAngle);
			this.ctx.strokeStyle = this.grad;
			this.ctx.lineWidth = this.lineWidth;
			this.ctx.stroke();
		} else if (displayedAngle >= Math.PI * 3 / 2){
			this.ctx.beginPath();		
			this.ctx.arc(w, h, this.radius, Math.PI * 3 / 2, displayedAngle);
			this.ctx.strokeStyle = this.grad;
			this.ctx.lineWidth = this.lineWidth;
			this.ctx.stroke();
		}else{
			this.ctx.beginPath();		
			this.ctx.arc(w, h, this.radius, -Math.PI / 2, Math.PI / 2);
			this.ctx.strokeStyle = this.grad;
			this.ctx.lineWidth = this.lineWidth;
			this.ctx.stroke();

			this.ctx.beginPath();		
			this.ctx.arc(w, h, this.radius, Math.PI / 2, displayedAngle);
			this.ctx.strokeStyle = this.grad1;
			this.ctx.lineWidth = this.lineWidth;
			this.ctx.stroke();
		} 

        if (this.options.showTitle) {
            // Display the title
            this.ctx.font = makeFontString(this.options.titleFontWeight, this.options.titleFontSize, this.options.titleFontFamily);
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillStyle = this.options.titleColor;
            this.ctx.fillText(this.options.title, w, h - this.options.titleFontSize / 2 - 5);
        }

        // Measure the text width
        this.ctx.font = makeFontString(this.options.valueFontWeight, this.options.valueFontSize, this.options.valueFontFamily);
        var valueTextLength = this.ctx.measureText(Math.ceil(this.displayedValue)).width;
        this.ctx.font = makeFontString(this.options.unitFontWeight, this.options.unitFontSize, this.options.unitFontFamily);
        var unitTextLength = this.ctx.measureText(this.options.unitType).width;

        // Display the current value
        this.ctx.font = makeFontString(this.options.valueFontWeight, this.options.valueFontSize, this.options.valueFontFamily);
        this.ctx.textAlign = "center"; 
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = this.options.valueColor;
        if (this.options.showTitle) {
            this.ctx.fillText(Math.ceil(this.displayedValue), w - unitTextLength / 2, h + this.options.valueFontSize / 2 + 5);
        } else {
            this.ctx.fillText(Math.ceil(this.displayedValue), w - unitTextLength / 2, h+15);
        }

        console.log(this.options.unitColor);
        // Display the value unit
        this.ctx.font = makeFontString(this.options.unitFontWeight, this.options.unitFontSize, this.options.unitFontFamily);
        this.ctx.textAlign = "left"; 
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = this.options.unitColor;
        if (this.options.showTitle) {
            this.ctx.fillText(this.options.unitType, w + valueTextLength / 2, h + this.options.valueFontSize / 2 + 5);
        } else {
            this.ctx.fillText(this.options.unitType, w + valueTextLength / 2, h+7);
        }

        if (this.options.showBall) {
            // Display the ball pointer
            if (this.options.ballImage !== "") {
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.arc(cur_x, cur_y, this.options.ballRadius, 0, 2 * Math.PI, false);
                this.ctx.closePath();
                this.ctx.clip();
                var img = new Image;
                img.src = this.options.ballImage;
                this.ctx.drawImage(img, cur_x - this.options.ballRadius, cur_y - this.options.ballRadius);
                this.ctx.restore();
            } else {
                this.ctx.beginPath();
                this.ctx.arc(cur_x, cur_y, this.options.ballRadius, 0, 2 * Math.PI, false);
                var ballFillGrad = this.ctx.createLinearGradient(cur_x - this.options.ballRadius, cur_y - this.options.ballRadius, 
                    cur_x + this.options.ballRadius, cur_y - this.options.ballRadius);
                ballFillGrad.addColorStop(0, this.options.ballStartColor);
                ballFillGrad.addColorStop(1, this.options.ballStopColor);
                this.ctx.fillStyle = ballFillGrad;
                this.ctx.fill();
                this.ctx.lineWidth = this.options.ballRadius * this.options.ballBorderScale;
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.stroke();
            }
        }
      };

    return Doughnut;

})(BaseDonut);

export {
    Doughnut
}