/*
The MIT License (MIT)
Copyright (c) 2018 Aaron Rau

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define(['highcharts'],function(Highcharts) {

Highcharts.setOptions({
  global: {
    useUTC: false
  }
});

//https://blog.emilecantin.com/web/highcharts/2014/10/26/highcharts-datetime-series.html

var _ConvertJSONDataToHighChartSeries = function(array,property,value,include,exclude)
{
	//AR: Map backend data to Highchart Series Data

	var seriesHash = {},
		series = [];

	for(var i = 0; i < array.length; i++)
	{
		var r = array[i];

		if(include)
		{
			if(!include[r[property]])
				continue;			
		}
		if(exclude)
		{
			if(exclude[r[property]])
				continue;			
		}

		if(!seriesHash[r[property]]){
			seriesHash[r[property]] = []
			seriesHash[r[property]].push([new Date(r.Date).getTime(),r[value]]);
		}

		if(seriesHash[r[property]][seriesHash[r[property]].length - 1][0] == new Date(r.Date).getTime())
		{
			seriesHash[r[property]][seriesHash[r[property]].length - 1][1] += r[value];
		}
		else
		{
			seriesHash[r[property]].push([new Date(r.Date).getTime(),r[value]]);
		}

	}

	for(var n in seriesHash)
	{
		series.push({
			name:n,
			data:seriesHash[n]
		})
	}

	return series;
}

return function(params){
	"use strict";
	var _this = {},
		_params = params;

	//private variables
	var _CLASS = "visual visual-graph";

	//DOM elements / templates here
	var _elm = cELM('div',_CLASS),
		_container = cELM('div','vcontainer'),
		_chart = null;

	if(params.id)
		_elm.id = params.id;




	//core framework methods 
	_this.handle = function(type,value,reference){


		if(type == "onupdate")
		{
			var options = {
				title:{text:_params.title},
				xAxis: {
					lineWidth: 0,
					minorGridLineWidth: 0,
					lineColor: 'transparent',
					gridLineColor: 'transparent',
					minorTickLength: 0,
					tickLength: 0,
					minTickInterval:1000*60*60*24, //day
			        type: 'datetime',
			        dateTimeLabelFormats: { // don't display the dummy year
			            month: '%e. %b',
			            year: '%b'
			        },
			        title: {
			            text: 'Date'
			        }
		        },
		        yAxis: {
			        title: {
			            text:_params.label
			        }
			    },
				series:_ConvertJSONDataToHighChartSeries(value.data,_params.property,_params.value,_params.include,_params.exclude),
				tooltip: {
			        pointFormat: "Value: {point.y:.2f}"
			    }
			}

			if(_params.isLogarithmic)
			{
				options.yAxis.type = 'logarithmic';
			}

			if(value.query.timeframe == 'today')
			{
		        options.chart = {
		        	type:"column"
		        }
		        options.xAxis.title.text = "Today";
			}
			else if(_params.plot == 'stacked')
			{
				options.plotOptions = {
		            series: {
		                stacking: 'normal'
		            }
		        }

		        options.chart = {
		        	type:"column"
		        }
			}
			else if(_params.plot == 'column')
			{

		        options.chart = {
		        	type:"column"
		        }

				// options.yAxis.type =  'logarithmic';
				// options.yAxis.minorTickInterval =  0.1;
				
		  //       options.plotOptions =  {
		  //       	column:{
		  //               pointWidth:15,
		  //           }	
				// }
			}
			else
			{
				options.chart = {
					type:"line"
				}	
				
				options.yAxis.type =  'logarithmic';
				options.yAxis.minorTickInterval =  0.1;
				

			}

			_chart = new Highcharts.chart(_container,options);
		}
		else if(type == "onfilter" && reference)
		{
			_container.innerHTML = "";
		}

	}

	_this.getELM = function()
	{ //just returns the main element
		return _elm;
	},
	_this.getHTML = function()
	{ //build / render html elements here

		_elm.className = _CLASS;
		_elm.addELM(_container);

		return _elm;
	}

	return _this;

};});
