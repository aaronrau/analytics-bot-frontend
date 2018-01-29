/*
The MIT License (MIT)
Copyright (c) 2018 Aaron Rau

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

define(function(req_require, req_exports, req_module) {

var _buildVisuals = function(configs){
		var visuals = [];

		for(var i = 0; i < configs.length; i++)
		{
			var vcfg = configs[i];
			visuals.push(new app.Mod('visualizations')[vcfg.type](vcfg.config));
		}

		return visuals;
	},
	_buildControls= function(configs){
		var controls = [];

		for(var i = 0; i < configs.length; i++)
		{
			var ccfg = configs[i],
				dElm = ccfg.elm;

			if(!dElm && ccfg.text && ccfg.css){
				controls.push(cELM('div',ccfg.css,ccfg.text));
			}
			else if(ccfg.text && ccfg.css){
				controls.push(ccfg.elm);
			}
		}

		return controls;
	}

return function(params){
	"use strict";
	var _this = {},
		_params = params;

	//private variables
	var _CLASS = "mtpanel";

	//DOM elements / templates here
	var _elm = cELM('div',_CLASS),
		_elmTitleArea = cELM('div','mp-title-area'),
		_controlArea = cELM('div','mp-controls-area'),
		_title = cELM('div','mp-title'),
		_content = cELM('div','mp-content');


	var _visuals = [],
		_controls = [];
	
	if(params.components)
		_visuals = _buildVisuals(params.components);

	if(params.id)
		_this.id = params.id;

	if(params.title){
		_title.textContent = _params.title;
	}

	//core framework methods 
	_this.handle = function(type,value,reference){

		for(var i = 0; i < _visuals.length; i++)
		{
			_visuals[i].handle(type,value,reference);
		}
	}

	_this.getELM = function()
	{ //just returns the main element
		return _elm;
	},
	_this.getHTML = function()
	{ //build / render html elements here

		_elm.className = _CLASS;

		_elm.addELM(_elmTitleArea);
		_elmTitleArea.addELM(_title);
		_elmTitleArea.addELM(_controlArea);

		_elm.addELM(_content);

		for(var i = 0; i < _visuals.length; i++)
		{
			_content.addELM(_visuals[i]);
		}

		for(var i = 0; i < _controls.length; i++)
		{
			_controlArea.addELM(_controls[i]);
		}


		return _elm;
	}

	return _this;

};});
