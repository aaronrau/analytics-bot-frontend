/*
The MIT License (MIT)
Copyright (c) 2018 Aaron Rau

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define(['highcharts'],function(Highcharts) {

var _ConvertJSONDataToHighChartPieSeries = function(array,property,value,include,exclude)
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

		if(!seriesHash[r[property]])
			seriesHash[r[property]] = 0;

		seriesHash[r[property]] += r[value];		
	}

	for(var n in seriesHash)
	{
		series.push({
			name:n,
			y:seriesHash[n]
		})
	}

	return series;
}


return function(params){
	"use strict";
	var _this = {},
		_params = params;

	//private variables
	var _CLASS = "visual visual-pie";

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
				chart: {
			        plotBackgroundColor: null,
			        plotBorderWidth: null,
			        plotShadow: false,
			        type: 'pie'
			    },
			    tooltip: {
			        pointFormat: '{point.y:.0f} <b>({point.percentage:.1f}%) </b>'
			    },
			    plotOptions: {
			        pie: {
			            allowPointSelect: true,
			            cursor: 'pointer',
			            dataLabels: {
			                enabled: true,
			                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
			                style: {
			                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
			                }
			            }
			        }
			    },
				title:{text:_params.title},
				series:[{name:"",colorByPoint:true,data:_ConvertJSONDataToHighChartPieSeries(value.data,_params.property,_params.value,_params.include,_params.exclude)}]
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
