import { ValueUpdater, BaseDonut, BaseGauge, AnimationUpdater, cutHex, formatNumber, mergeObjects } from './gauge';

/***
 * 
 */
function format2DigitNumber(num) {
    return num>9?num:'0'+num;
}
var Doughnut, NewGaugePointer, NewGauge, makeFontString, roundRect,
    slice = [].slice,
    hasProp = {}.hasOwnProperty,
    extend = function(child, parent) {
        for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; }

        function ctor() { this.constructor = child; }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    };

makeFontString = function(fontWeight, fontSize, fontFamily) {
    return fontWeight + " " + fontSize + "px " + fontFamily;
}

roundRect = function(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
        var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }

}

NewGaugePointer = (function(_super) {
    extend(NewGaugePointer, _super);

    NewGaugePointer.prototype.displayedValue = 0;

    NewGaugePointer.prototype.value = 0;

    NewGaugePointer.prototype.options = {
        strokeWidth: 0.035,
        length: 0.1,
        color: "#000000",
        shadowColor: '#333333',
        shadowOffset: 3,
        iconPath: null,
        iconScale: 1.0,
        iconAngle: 0,
    };

    NewGaugePointer.prototype.img = null;

    function NewGaugePointer(_at_gauge) {
        this.gauge = _at_gauge;
        if (this.gauge === void 0) {
            throw new Error('The element isn\'t defined.');
        }
        this.ctx = this.gauge.ctx;
        this.canvas = this.gauge.canvas;
        NewGaugePointer.__super__.constructor.call(this, false, false);
        this.setOptions();
    }

    NewGaugePointer.prototype.setOptions = function(options) {
        this.displayedValue = this.displayedValue / this.maxValue * (options ? options.maxValue : this.gauge.maxValue);
        if (options == null) {
            options = null;
        }
        this.options = mergeObjects(this.options, options);
        this.length = 2 * this.gauge.radius * this.gauge.options.radiusScale * this.options.length;
        this.strokeWidth = this.canvas.height * this.options.strokeWidth;
        this.maxValue = this.gauge.maxValue;
        this.minValue = this.gauge.minValue;
        this.animationSpeed = this.gauge.options.animationSpeed;
        this.options.angle = this.gauge.options.angle;
        if (this.options.iconPath) {
            this.img = new Image();
            return this.img.src = this.options.iconPath;
        }
    };

    NewGaugePointer.prototype.render = function() {
        var angle, endX, endY, imgX, imgY, startX, startY, x, y, shadowX, shadowY, offsetY = this.canvas.height / 10;
        angle = this.gauge.getAngle.call(this, this.displayedValue);
        x = Math.round(this.length * Math.cos(angle));
        y = Math.round(this.length * Math.sin(angle));
        startX = Math.round(this.strokeWidth * Math.cos(angle - Math.PI / 2));
        startY = Math.round(this.strokeWidth * Math.sin(angle - Math.PI / 2));
        endX = Math.round(this.strokeWidth * Math.cos(angle + Math.PI / 2));
        endY = Math.round(this.strokeWidth * Math.sin(angle + Math.PI / 2));
        //shadowX = Math.round(this.options.shadowOffset * Math.cos(angle + Math.PI));
        //shadowY = Math.round(this.options.shadowOffset * Math.sin(angle + Math.PI));
        shadowX = 0;
        shadowY = 1;
        this.ctx.beginPath();
        this.ctx.fillStyle = this.options.shadowColor;
        this.ctx.arc(shadowX, shadowY - offsetY, this.strokeWidth, 0, Math.PI * 2, false);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.fillStyle = this.options.color;
        this.ctx.arc(0, -offsetY, this.strokeWidth, 0, Math.PI * 2, false);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY - offsetY);
        this.ctx.lineTo(x, y);
        this.ctx.lineTo(endX, endY - offsetY);
        this.ctx.fill();
        if (this.img) {
            imgX = Math.round(this.img.width * this.options.iconScale);
            imgY = Math.round(this.img.height * this.options.iconScale);
            this.ctx.save();
            this.ctx.translate(x, y - offsetY);
            this.ctx.rotate(angle + Math.PI / 180.0 * (90 + this.options.iconAngle));
            this.ctx.drawImage(this.img, -imgX / 2, -imgY / 2, imgX, imgY);
            return this.ctx.restore();
        }
    };

    return NewGaugePointer;

})(ValueUpdater);

NewGauge = (function(_superClass) {
    extend(NewGauge, _superClass);

    NewGauge.prototype.elem = null;

    NewGauge.prototype.value = [20];

    NewGauge.prototype.maxValue = 80;

    NewGauge.prototype.minValue = 0;

    NewGauge.prototype.displayedAngle = 0;

    NewGauge.prototype.displayedValue = 0;

    NewGauge.prototype.lineWidth = 40;

    NewGauge.prototype.paddingTop = 0.1;

    NewGauge.prototype.paddingBottom = 0.3;

    NewGauge.prototype.percentColors = null;

    NewGauge.prototype.options = {
        colorStart: "#6fadcf",
        colorStop: void 0,
        gradientType: 0,
        strokeColor: "#e0e0e0",
        pointer: {
            length: 0.8,
            strokeWidth: 0.035,
            iconScale: 1.0
        },
        angle: 0.15,
        animationSpeed: 1,
        lineWidth: 0.44,
        radiusScale: 1.0,
        fontSize: 40,
        limitMax: false,
        limitMin: false,
        valueColor: '#3333cc',
        valueFontFamily: "Poppins",
        valueFontSize: 24,
        valueFontWeight: 'normal',
        unitColor: '#dededf',
        unitFontFamily: "Poppins",
        unitFontSize: 24,
        unitFontWeight: 'bolder',
        containerStrokeColor: '#ff0000',
        containerRadius: 3,
        containerWidth: 1,
    };

    function NewGauge(_at_canvas) {
        var h, w;
        this.canvas = _at_canvas;
        NewGauge.__super__.constructor.call(this);
        this.percentColors = null;
        if (typeof G_vmlCanvasManager !== 'undefined') {
            this.canvas = window.G_vmlCanvasManager.initElement(this.canvas);
        }
        this.ctx = this.canvas.getContext('2d');
        h = this.canvas.clientHeight;
        w = this.canvas.clientWidth;
        this.canvas.height = h;
        this.canvas.width = w;
        this.gp = [new NewGaugePointer(this)];
        this.setOptions();
    }

    NewGauge.prototype.setOptions = function(options) {
        var gauge, phi, _i, _len, _ref;
        if (options == null) {
            options = null;
        }
        NewGauge.__super__.setOptions.call(this, options);
        this.configPercentColors();
        this.extraPadding = 0;
        if (this.options.angle < 0) {
            phi = Math.PI * (1 + this.options.angle);
            this.extraPadding = Math.sin(phi);
        }
        this.availableHeight = this.canvas.height * (1 - this.paddingTop - this.paddingBottom);
        this.lineWidth = this.availableHeight * this.options.lineWidth;
        this.radius = (this.availableHeight - this.lineWidth / 2) / (1.0 + this.extraPadding);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        _ref = this.gp;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            gauge = _ref[_i];
            gauge.setOptions(this.options.pointer);
            gauge.render();
        }
        this.render();
        return this;
    };

    NewGauge.prototype.configPercentColors = function() {
        var bval, gval, i, rval, _i, _ref, _results;
        this.percentColors = null;
        if (this.options.percentColors !== void 0) {
            this.percentColors = new Array();
            _results = [];
            for (i = _i = 0, _ref = this.options.percentColors.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
                rval = parseInt((cutHex(this.options.percentColors[i][1])).substring(0, 2), 16);
                gval = parseInt((cutHex(this.options.percentColors[i][1])).substring(2, 4), 16);
                bval = parseInt((cutHex(this.options.percentColors[i][1])).substring(4, 6), 16);
                _results.push(this.percentColors[i] = {
                    pct: this.options.percentColors[i][0],
                    color: {
                        r: rval,
                        g: gval,
                        b: bval
                    }
                });
            }
            return _results;
        }
    };

    NewGauge.prototype.set = function(value) {
        var gp, i, val, _i, _j, _k, _len, _ref, _ref1;
        if (!(value instanceof Array)) {
            value = [value];
        }
        for (i = _i = 0, _ref = value.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            value[i] = this.parseValue(value[i]);
        }
        if (value.length > this.gp.length) {
            for (i = _j = 0, _ref1 = value.length - this.gp.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
                gp = new NewGaugePointer(this);
                gp.setOptions(this.options.pointer);
                this.gp.push(gp);
            }
        } else if (value.length < this.gp.length) {
            this.gp = this.gp.slice(this.gp.length - value.length);
        }
        i = 0;
        for (_k = 0, _len = value.length; _k < _len; _k++) {
            val = value[_k];
            if (val > this.maxValue) {
                if (this.options.limitMax) {
                    val = this.maxValue;
                } else {
                    this.maxValue = val + 1;
                }
            } else if (val < this.minValue) {
                if (this.options.limitMin) {
                    val = this.minValue;
                } else {
                    this.minValue = val - 1;
                }
            }
            this.gp[i].value = val;
            this.gp[i++].setOptions({
                minValue: this.minValue,
                maxValue: this.maxValue,
                angle: this.options.angle
            });
        }
        this.value = Math.max(Math.min(value[value.length - 1], this.maxValue), this.minValue);
        AnimationUpdater.run(this.forceUpdate);
        return this.forceUpdate = false;
    };

    NewGauge.prototype.getAngle = function(value) {
        return (1 + this.options.angle) * Math.PI + ((value - this.minValue) / (this.maxValue - this.minValue)) * (1 - this.options.angle * 2) * Math.PI;
    };

    NewGauge.prototype.getColorForPercentage = function(pct, grad) {
        var color, endColor, i, rangePct, startColor, _i, _ref;
        if (pct === 0) {
            color = this.percentColors[0].color;
        } else {
            color = this.percentColors[this.percentColors.length - 1].color;
            for (i = _i = 0, _ref = this.percentColors.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
                if (pct <= this.percentColors[i].pct) {
                    if (grad === true) {
                        startColor = this.percentColors[i - 1] || this.percentColors[0];
                        endColor = this.percentColors[i];
                        rangePct = (pct - startColor.pct) / (endColor.pct - startColor.pct);
                        color = {
                            r: Math.floor(startColor.color.r * (1 - rangePct) + endColor.color.r * rangePct),
                            g: Math.floor(startColor.color.g * (1 - rangePct) + endColor.color.g * rangePct),
                            b: Math.floor(startColor.color.b * (1 - rangePct) + endColor.color.b * rangePct)
                        };
                    } else {
                        color = this.percentColors[i].color;
                    }
                    break;
                }
            }
        }
        return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
    };

    NewGauge.prototype.getColorForValue = function(val, grad) {
        var pct;
        pct = (val - this.minValue) / (this.maxValue - this.minValue);
        return this.getColorForPercentage(pct, grad);
    };

    NewGauge.prototype.renderStaticLabels = function(staticLabels, w, h, radius) {
        var font, fontsize, match, re, rest, rotationAngle, value, _i, _len, _ref;
        this.ctx.save();
        this.ctx.translate(w, h);
        font = staticLabels.font || "10px Times";
        re = /\d+\.?\d?/;
        match = font.match(re)[0];
        rest = font.slice(match.length);
        fontsize = parseFloat(match) * this.displayScale;
        this.ctx.font = fontsize + rest;
        this.ctx.fillStyle = staticLabels.color || "#000000";
        this.ctx.textBaseline = "bottom";
        this.ctx.textAlign = "center";
        _ref = staticLabels.labels;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            value = _ref[_i];
            if (value.label !== void 0) {
                if ((!this.options.limitMin || value >= this.minValue) && (!this.options.limitMax || value <= this.maxValue)) {
                    font = value.font || staticLabels.font;
                    match = font.match(re)[0];
                    rest = font.slice(match.length);
                    fontsize = parseFloat(match) * this.displayScale;
                    this.ctx.font = fontsize + rest;
                    rotationAngle = this.getAngle(value.label) - 3 * Math.PI / 2;
                    this.ctx.rotate(rotationAngle);
                    this.ctx.fillText(formatNumber(value.label, staticLabels.fractionDigits), 0, -radius - this.lineWidth / 2);
                    this.ctx.rotate(-rotationAngle);
                }
            } else {
                if ((!this.options.limitMin || value >= this.minValue) && (!this.options.limitMax || value <= this.maxValue)) {
                    rotationAngle = this.getAngle(value) - 3 * Math.PI / 2;
                    this.ctx.rotate(rotationAngle);
                    this.ctx.fillText(formatNumber(value, staticLabels.fractionDigits), 0, -radius - this.lineWidth / 2);
                    this.ctx.rotate(-rotationAngle);
                }
            }
        }
        return this.ctx.restore();
    };

    NewGauge.prototype.renderTicks = function(ticksOptions, w, h, radius) {
        var currentDivision, currentSubDivision, divColor, divLength, divWidth, divisionCount, lineWidth, range, rangeDivisions, scaleMutate, st, subColor, subDivisions, subLength, subWidth, subdivisionCount, t, tmpRadius, _i, _ref, _results;
        if (ticksOptions !== {}) {
            divisionCount = ticksOptions.divisions || 0;
            subdivisionCount = ticksOptions.subDivisions || 0;
            divColor = ticksOptions.divColor || '#fff';
            subColor = ticksOptions.subColor || '#fff';
            divLength = ticksOptions.divLength || 0.7;
            subLength = ticksOptions.subLength || 0.2;
            range = parseFloat(this.maxValue) - parseFloat(this.minValue);
            rangeDivisions = parseFloat(range) / parseFloat(ticksOptions.divisions);
            subDivisions = parseFloat(rangeDivisions) / parseFloat(ticksOptions.subDivisions);
            currentDivision = parseFloat(this.minValue) + rangeDivisions / 2;
            currentSubDivision = 0.0 + subDivisions;
            lineWidth = range / 400;
            divWidth = lineWidth * (ticksOptions.divWidth || 1);
            subWidth = lineWidth * (ticksOptions.subWidth || 1);
            _results = [];
            for (t = _i = 0, _ref = divisionCount; _i < _ref; t = _i += 1) {
                this.ctx.lineWidth = this.lineWidth * divLength;
                scaleMutate = (this.lineWidth / 2) * (1 - divLength);

                tmpRadius = (this.radius * this.options.radiusScale) + scaleMutate - (0.1 * this.canvas.width); // to add offset
                // console.log(this.options, ticksOptions);
                this.ctx.strokeStyle = divColor;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, tmpRadius, this.getAngle(currentDivision - divWidth), this.getAngle(currentDivision + divWidth), false);
                this.ctx.stroke();
                currentSubDivision = currentDivision + subDivisions;
                currentDivision += rangeDivisions;
                if (t !== ticksOptions.divisions && subdivisionCount > 0) {
                    _results.push((function() {
                        var _j, _ref1, _results1;
                        _results1 = [];
                        for (st = _j = 0, _ref1 = subdivisionCount - 1; _j < _ref1; st = _j += 1) {
                            this.ctx.lineWidth = this.lineWidth * subLength;
                            scaleMutate = (this.lineWidth / 2) * (1 - subLength);
                            tmpRadius = (this.radius * this.options.radiusScale) + scaleMutate;
                            this.ctx.strokeStyle = subColor;
                            this.ctx.beginPath();
                            this.ctx.arc(0, 0, tmpRadius, this.getAngle(currentSubDivision - subWidth), this.getAngle(currentSubDivision + subWidth), false);
                            this.ctx.stroke();
                            _results1.push(currentSubDivision += subDivisions);
                        }
                        return _results1;
                    }).call(this));
                } else {
                    _results.push(void 0);
                }
            }
            return _results;
        }
    };

    NewGauge.prototype.render = function() {
        var displayedAngle, fillStyle, gauge, h, max, min, radius, scaleMutate, tmpRadius, w, zone, _i, _j, _len, _len1, _ref, _ref1;

        w = this.canvas.width / 2;
        h = (this.canvas.height * this.paddingTop + this.availableHeight) - ((this.radius + this.lineWidth / 2) * this.extraPadding);

        displayedAngle = this.getAngle(this.displayedValue);

        this.ctx.lineCap = "butt";
        radius = this.radius * this.options.radiusScale;
        if (this.options.staticLabels) {
            this.renderStaticLabels(this.options.staticLabels, w, h, radius);
        }
        if (this.options.staticZones) {
            this.ctx.save();
            this.ctx.translate(w, h);
            this.ctx.lineWidth = this.lineWidth;
            _ref = this.options.staticZones;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                zone = _ref[_i];
                min = zone.min;
                // if (this.options.limitMin && min < this.minValue) {
                //     min = this.minValue;
                // }
                max = zone.max;
                // if (this.options.limitMax && max > this.maxValue) {
                //     max = this.maxValue;
                // }
                tmpRadius = this.radius * this.options.radiusScale;
                if (zone.height) {
                    this.ctx.lineWidth = this.lineWidth * zone.height;
                    scaleMutate = (this.lineWidth / 2) * (zone.offset || 1 - zone.height);
                    tmpRadius = (this.radius * this.options.radiusScale) + scaleMutate;
                }
                this.ctx.strokeStyle = zone.strokeStyle;
                this.ctx.beginPath();
                // Percentage based color zones
                let start = (min / 100) * this.maxValue;
                let end = (max / 100) * this.maxValue;
                // My changes
                this.ctx.arc(0, 0, tmpRadius, this.getAngle(start), this.getAngle(end), false);
                this.ctx.stroke();
            }
        } else {
            if (this.options.customFillStyle !== void 0) {
                fillStyle = this.options.customFillStyle(this);
            } else if (this.percentColors !== null) {
                fillStyle = this.getColorForValue(this.displayedValue, this.options.generateGradient);
            } else if (this.options.colorStop !== void 0) {
                if (this.options.gradientType === 0) {
                    fillStyle = this.ctx.createRadialGradient(w, h, 9, w, h, 70);
                } else {
                    fillStyle = this.ctx.createLinearGradient(0, 0, w, 0);
                }
                fillStyle.addColorStop(0, this.options.colorStart);
                fillStyle.addColorStop(1, this.options.colorStop);
            } else {
                fillStyle = this.options.colorStart;
            }
            this.ctx.strokeStyle = fillStyle;
            this.ctx.beginPath();
            this.ctx.arc(w, h, radius, (1 + this.options.angle) * Math.PI, displayedAngle, false);
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.stroke();
            this.ctx.strokeStyle = this.options.strokeColor;
            this.ctx.beginPath();
            this.ctx.arc(w, h, radius, displayedAngle, (2 - this.options.angle) * Math.PI, false);
            this.ctx.stroke();
            this.ctx.save();
            this.ctx.translate(w, h);
        }
        if (this.options.renderTicks) {
            this.renderTicks(this.options.renderTicks, w, h, radius);
        }
        this.ctx.restore();
        this.ctx.translate(w, h);
        _ref1 = this.gp;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            gauge = _ref1[_j];
            gauge.update(true);
        }

        var valueString, unitString, curValue;
        curValue = Math.ceil(this.displayedValue);
        if (this.maxValue >= 60) {
            unitString = 'hrs';
            var hour = Math.floor(curValue / 60);
            var minute = curValue % 60;
            var maxValue = format2DigitNumber(Math.ceil(this.maxValue / 60));
            valueString = (hour < 10 ? "0" + hour : hour) + ":" + (minute < 10 ? "0" + minute : minute) + "/" + maxValue;
        } else {
            unitString = 'mins';
            valueString = curValue + "/" + this.maxValue<10?'0'+this.maxValue.toString() : this.maxValue;
        }
        if (this.options.showValueContainer) {
            // Render the value container
            this.ctx.strokeStyle = this.options.containerStrokeColor;
            this.ctx.lineWidth = this.options.containerWidth;

            var containerX = -this.radius * 1.1;
            var containerY = 10;
            var containerWidth = 2.2 * this.radius;
            var containerHeight = this.paddingBottom * this.canvas.height * 0.7;
            roundRect(this.ctx, containerX, containerY, containerWidth, containerHeight, this.options.containerRadius, false, true);

           // Measure the text width
           var valueTextLength, unitTextLength;
           do {
               this.ctx.font = makeFontString(this.options.valueFontWeight, this.options.valueFontSize, this.options.valueFontFamily);
               valueTextLength = this.ctx.measureText(valueString).width;
               this.ctx.font = makeFontString(this.options.unitFontWeight, this.options.unitFontSize, this.options.unitFontFamily);
               unitTextLength = this.ctx.measureText(unitString).width;
               this.options.valueFontSize--;
               this.options.unitFontSize--;
           } while((valueTextLength + unitTextLength) > containerWidth);

            //Render Current Value
            var textY = containerY + containerHeight / 2 + 2;
            var space = 2;
            this.ctx.font = makeFontString(this.options.valueFontWeight, this.options.valueFontSize, this.options.valueFontFamily);
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillStyle = this.options.valueColor;
            this.ctx.fillText(valueString, -unitTextLength / 2 - space, textY);

            // Render unit
            this.ctx.font = makeFontString(this.options.unitFontWeight, this.options.unitFontSize, this.options.unitFontFamily);
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillStyle = this.options.unitColor;
            this.ctx.fillText(unitString, valueTextLength / 2 + space, textY);
        }
        return this.ctx.translate(-w, -h);
    };

    return NewGauge;

})(BaseGauge);

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

    function Doughnut() {
        Doughnut.__super__.constructor.apply(this, arguments);
        this.canvas.height = (this.radius + this.options.ballRadius) * 2;
        this.canvas.width = this.canvas.getBoundingClientRect().width;
        this.canvas.height = this.canvas.getBoundingClientRect().height;
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
        if (inverse) {
            grad.addColorStop(1, this.options.colorStart);
            grad.addColorStop(0.5, this.options.colorMiddle);
            grad.addColorStop(0, this.options.colorStop);
        } else {
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
        this.ctx.strokeStyle = this.radialStrokeGradient(w, h, start, stop);
        this.ctx.arc(w, h, this.radius, (2 - this.options.angle) * Math.PI, (1 + this.options.angle) * Math.PI, false);
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = "round";
        this.ctx.stroke();

        // Display the current value circle        
        var r = this.radius;
        var pos_x = w;
        var pos_y_top = h - r;
        var pos_y_bottom = h + r;

        if (displayedAngle <= Math.PI / 2) {
            this.grad = this.ctx.createLinearGradient(pos_x, pos_y_top, pos_x, cur_y);
            this.addColorToGradient(this.grad);

        } else {
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

        if (displayedAngle <= Math.PI / 2) {
            this.ctx.beginPath();
            this.ctx.arc(w, h, this.radius, -Math.PI / 2, displayedAngle);
            this.ctx.strokeStyle = this.grad;
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.stroke();
        } else if (displayedAngle >= Math.PI * 3 / 2) {
            this.ctx.beginPath();
            this.ctx.arc(w, h, this.radius, Math.PI * 3 / 2, displayedAngle);
            this.ctx.strokeStyle = this.grad;
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.stroke();
        } else {
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
            this.ctx.fillText(Math.ceil(this.displayedValue), w - unitTextLength / 2, h + 15);
        }

        // Display the value unit
        this.ctx.font = makeFontString(this.options.unitFontWeight, this.options.unitFontSize, this.options.unitFontFamily);
        this.ctx.textAlign = "left";
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = this.options.unitColor;
        if (this.options.showTitle) {
            this.ctx.fillText(this.options.unitType, w + valueTextLength / 2, h + this.options.valueFontSize / 2 + 5);
        } else {
            this.ctx.fillText(this.options.unitType, w + valueTextLength / 2, h + 7);
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
    Doughnut,
    NewGauge
}