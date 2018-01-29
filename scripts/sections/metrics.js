
/*
The MIT License (MIT)
Copyright (c) 2015 Aaron Rau

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function () {
	"use strict";



	//private variables
	var _SECTION = 'metrics',
		_container = null, //parent container for the section
		_hasRender = false; //flag used to determine if the section has already been rendered on the screen;

	//default controllers
	var _CTRL = function(){
		return app.Mod(_SECTION).Controller;
	}


	var _elm = cELM('div',_SECTION),
		_header = null,
		_lastMetric = null,
		_lastFilters = {},
		_objMetricPanels = {},
		_objFilterControls = {};

	var _renderPanels = function(){
			
			if(_objFilterControls["Metrics"])
			{

				var selectedMetric = _objFilterControls["Metrics"].getData().selected;

				//Check to see if the metric has changed, only redraw if metric changed.
				if(_lastMetric != selectedMetric)
				{
					_objMetricPanels = {}
					//render panels
					_elm.innerHTML = "";

					_lastMetric = selectedMetric;

					var panels = _CTRL().getPanels(selectedMetric);

					for(var i = 0; i < panels.length; i++)
					{
						var panel = panels[i];
						_objMetricPanels[panel.id] = panel; //store for reference later
						_elm.addELM(panel);
					}	
				}

			}


		},
		_fetchData = function(){
			var filters = {};
			for(var name in _objFilterControls){
				filters[name] = _objFilterControls[name].getData();
			}
			
			//Only fetch the data if the filter changed
			if(JSON.stringify(filters) != JSON.stringify(_lastFilters))
			{
				_lastFilters = filters;

				_CTRL().getData(filters);

				return true;
			}

			return false;
		}
	
//---------------------------

	var _this = {
	    //init is used to initialize the various parameters need to render the call
	    init:function(currentUser,container){

	    	_container = container;

	    	//handle filter events 
	    	_CTRL().addEventListener("onfilter",function(filter){

				_renderPanels();

				var didFetchData = _fetchData();
				for(var id in _objMetricPanels){
					_objMetricPanels[id].handle("onfilter",filter,didFetchData)
				}


			});

	    	//handle update events 
			_CTRL().addEventListener("onupdate",function(metricData){

				if(metricData.isOffline)
					app.Controller.setNotification('Warning the metric api is offline.');
				else
					app.Controller.clearNotification();	

				//pass data to all the components;
				for(var id in _objMetricPanels){
					_objMetricPanels[id].handle("onupdate",metricData)
				}
				for(var name in _objFilterControls){
					_CTRL().updateFilterControl(_objFilterControls[name],metricData);
				}
			});

	    },
	    clear:function()
	    {
	    	if(_container)
	    	{
	    		_container.removeChild(_elm);
	    	}
	    },
	    render:function()
	    {

	    	//prevent page from rendering again
	    	if(_hasRender)
	    		return;
	    	else
	    		_hasRender = true;

	    	//init container
	    	_container.addELM(_elm);

	    	app.Controller.setNotification('Connecting....');
			//init metric panels
			_CTRL().init({},function(filterControls){
				
				//render header filters and controls
		    	_header = document.getElementById('controls_header');
		    	if(_header)
		    	{
		    		_header.innerHTML = "";

		    	
		    		for(var i = 0; i < filterControls.length; i ++)
		    		{
		    			var filter = filterControls[i];
		    			_objFilterControls[filter.getData().name] = filter;
		    			_header.addELM(filter);
		    		}	
		    	}

		    	_renderPanels();
		    	_fetchData();

				
			});


	    }
	 }


     
	//Main module definition.
	define(_this);
}());
