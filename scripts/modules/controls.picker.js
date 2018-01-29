/*
The MIT License (MIT)
Copyright (c) 2015 Aaron Rau

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define(function(req_require, req_exports, req_module) {
return function(params){
	"use strict";
	var _this = {}, // http://stackoverflow.com/questions/12180790/defining-methods-via-prototype-vs-using-this-in-the-constructor-really-a-perfo
		_selected = null,
		_data = params.data ? params.data : null ,
		_previousData = null,
		_params = params;


	var _selectedObjs = {};	

	//private variables
	var _CLASS = "tkcontrol tkpicker tkpicker-" + _params.name.toLowerCase().replace(/ /g,'-');

	//DOM elements / templates here
	var _elm = cELM('div',_CLASS),
		_elmHidden = cELM('div','tkpicker-hidden'), //used for spacing
		_elmName = cELM('div','tkcontrol-name'),
		_elmCurrentSelection = cELM('div','tkcontrol-selected-value tkpicker-current-selection'),
		_elmSelections = cELM('div','tkpicker-selections');


	_elm.toggle = function(on)
	{
		if(on)
		{
			_elmSelections.style.height = 'auto';
			_elmSelections.style.overflow = 'visible';

			_elmCurrentSelection.style.height = '0px';
			_elmCurrentSelection.style.overflow = 'hidden';
		}
		else
		{
			_elmSelections.style.height = '0px';
			_elmSelections.style.overflow = 'hidden';
			_elmCurrentSelection.style.height = 'auto';	
			_elmCurrentSelection.style.overflow = 'visible';	
		}		
	}

	_elm.onmouseenter = function(e){
		//_toggle(true)
	}
	_elm.onmouseleave = function(e){
		this.toggle(false)
	}

	_elm.onmouseup = function(e){
		if(_elmSelections.style.overflow == 'visible')
		{
			this.toggle(false);
		}
		else
		{
			this.toggle(true);
			if(_params.onChange)
			{
				_params.onChange('click',_selected,_this) //send tag to other controls
			}
		}
	}

	_elm.addELM(_elmName);
	_elm.addELM(_elmCurrentSelection);
	_elm.addELM(_elmSelections);
	_elm.addELM(_elmHidden); // used for spacing

	_elmName.textContent = _params.name;

	var _onSelect = function(e){

		
		if(_selected != this.value)
		{
			_previousData = JSON.parse(JSON.stringify(_this.getData()));

			for(var v in _selectedObjs)
			{
				_selectedObjs[v].className = 'tkpicker-selection';	
			}

			if(!IsEmpty(_data.valueDescriptions[this.value]))
			{
				_elmCurrentSelection.textContent = _data.valueDescriptions[this.value];
			}
			else
			{
				_elmCurrentSelection.textContent = this.value;
			}

			_elmCurrentSelection.className = 'tkcontrol-selected-value tkpicker-current-selection';
			_elm.className = _CLASS+' tkselected-'+encodeURIComponent(this.value.toLowerCase()).replace(/~/g,'%7E').replace(/!/g,'%21').replace(/\*/g,'%2A').replace(/\(/g,'%28').replace(/\)/g,'%29').replace(/\'/g,'%27')


			_selected = this.value;
			this.className = 'tkpicker-selection tkpicker-selected tkcontrol-selected-value';

			if(_params.onChange)
			{
				//_params.onChange('tkpicker-selection',_this) //notify changes
				_params.onChange('value',_selected,_this) //send tag to other controls
			}
		}
	}

	var _buildSelections = function(){
		_elmSelections.innerHTML = "";

		for(var i = 0; i < _data.values.length; i++)
		{
			var v = _data.values[i];
			var description = _data.valueDescriptions[v];

			var sel = cELM('div','tkpicker-selection');
			if(_selected)
			if(_selected == v)
			{
				sel.className = 'tkpicker-selection tkpicker-selected tkcontrol-selected-value';
			}
			sel.value = v;
			sel.desc = description;
			sel.onmouseup = _onSelect;

			_selectedObjs[v] = sel;

			if(!IsEmpty(description))
			{
				sel.textContent = description;
				_elmHidden.innerHTML += (description +'<br/>');				
			}
			else
			{
				sel.textContent = v;
				_elmHidden.innerHTML += (v +'<br/>');	
			}


			_elmSelections.addELM(sel);

		}

	}

	//core framework methods 
	_this.handle = function(type,value,reference)
	{
		//handle tag changes from various other components
		switch(type){
			case "oncontrolchange-values":
			
				_data.values = value.values;

				_buildSelections();

				break;	
			default:
				_handle(type,value,_this);
		}
	}
	_this.update = function(data){

		if(!data)
			return;

		var newSelect = null;
		if(data.selected)
		{
			newSelect = data.selected;
		}
		else if(data.default && _selected == null)
		{
			newSelect = data.default
		}
		else if(_selected)
		{
			newSelect = _selected;
		}
		else
		{
			newSelect = "unknown";
		}
		
		var didChange = false;

		if(!_data){
			_data = {};
			_data.valueDescriptions = data.valueDescriptions;
			_data.values = data.values

			didChange = true;
		}
		else
		{
			if(data.values.length != _data.values.length)
			{
				didChange = true;
			}

			if(newSelect != _selected && newSelect != null)
			{
				didChange = true;
			}
		
			//AR: performance issues
			// var nD = {
			// 	valueDescriptions:data.valueDescriptions,
			// 	values:data.values
			// }

			// var oD = {
			// 	valueDescriptions:_data.valueDescriptions,
			// 	values:_data.valueDescriptions
			// }

			// n = JSON.stringify(nD);
			// o = JSON.stringify(oD);
		}
		
		if(didChange)
		{
			_data.valueDescriptions = data.valueDescriptions;
			_data.values = data.values

			_selected = newSelect;

			if(!IsEmpty(_data.valueDescriptions[_selected]))
			{
				_elmCurrentSelection.textContent = _data.valueDescriptions[_selected];
			}
			else
			{
				_elmCurrentSelection.textContent = newSelect;
			}
			
			
			_elm.className = _CLASS+' tkselected-'+encodeURIComponent(newSelect.toLowerCase()).replace(/~/g,'%7E').replace(/!/g,'%21').replace(/\*/g,'%2A').replace(/\(/g,'%28').replace(/\)/g,'%29').replace(/\'/g,'%27')


			_buildSelections();

		}


		


	}

	_this.getPreviousData = function() // used to store previous value
	{
		if(!_previousData)
			_previousData = _this.getData() 

		return _previousData;
	}
	_this.getData = function(data){
		var r = {
			layout:_params.layout,
			name:_params.name,
			default:_data.default ? _data.default : _params.default,
			selected:_selected,
			values:_data.values,
			valueDescriptions:_data.valueDescriptions
		}

		return r;
	}
	_this.getELM = function()
	{ //just returns the main element
		return _elm;
	},
	_this.getHTML = function()
	{ //build / render html elements here

		//_elm.className = _CLASS;
		if(_data)
			_this.update(_data);
		else 
			_this.update(_params);

		_elm.toggle(false);


		return _elm;
	}

	return _this;

};});
