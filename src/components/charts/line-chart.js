import {Chart} from 'chart.js';

Chart.types.Line.extend({
    name: "LineAlt",
    initialize: function(data){
        Chart.types.Line.prototype.initialize.apply(this, arguments);
        this.eachPoints(function(point, index){
            Chart.helpers.extend(point, {
                x: this.scale.calculateX(0),
                y: this.scale.calculateY(point.value)
            });
            point.save();
        }, this);       
    }
});