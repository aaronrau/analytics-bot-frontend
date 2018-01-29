/*
The MIT License (MIT)
Copyright (c) 2018 Aaron Rau

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define(function(req_require, req_exports, req_module) {
	//https://stackoverflow.com/questions/10599933/convert-long-number-into-abbreviated-string-in-javascript-with-a-special-shortn	
	function abbreviateNumber(value) {
	    var newValue = value;
	    if (value >= 1000) {
	        var suffixes = ["", "k", "m", "b","t"];
	        var suffixNum = Math.floor( (""+value).length/3 );
	        var shortValue = '';
	        for (var precision = 2; precision >= 1; precision--) {
	            shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
	            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
	            if (dotLessShortValue.length <= 2) { break; }
	        }
	        if (shortValue % 1 != 0)  shortNum = shortValue.toFixed(1);
	        newValue = shortValue+suffixes[suffixNum];
	    }
	    return newValue;
	}
	//https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
	const numberWithCommas = (x) => {
  		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

return function(params){
	"use strict";
	var _this = {},
		_params = params;

	//private variables
	var _CLASS = "visual visual-kpi";

	//DOM elements / templates here
	var _elm = cELM('div',_CLASS),
		_container = cELM('div','vcontainer'),
		_chart = null;


	//core framework methods 
	_this.handle = function(type,value,reference){


		if(type == "onupdate")
		{
			if(_params.type == "total")
			{
				var t = 0;
				for(var i = 0; i < value.data.length; i++)
				{
					t += value.data[i][_params.value];
				}

				_container.innerHTML = numberWithCommas(t)+' <span class="label">'+_params.label+'</span>';//abbreviateNumber(t);
			}
			else if(_params.type == "avg")
			{
				var t = 0,
					cnt = value.data.length;

				var avg = 0

				for(var i = 0; i < value.data.length; i++)
				{
					
					if(_params.count)
					{
						t += (value.data[i][_params.value] * value.data[i][_params.count]);
				
						cnt += value.data[i][_params.count];
					}
					else
					{
						t += value.data[i][_params.value];
					}
				}

				t = parseInt((parseFloat(t / cnt))*100)/100;

				_container.innerHTML = t+' <span class="label">'+_params.label+'</span>';//abbreviateNumber(t);
			}
			else
			{
				_container.innerHTML = "N/A";
			}
	
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
