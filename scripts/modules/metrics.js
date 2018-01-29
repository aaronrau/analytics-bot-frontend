/*
The MIT License (MIT)
Copyright (c) 2018 Aaron Rau

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function () {
	"use strict";

	var m = "./",
		ui_components = [
		m + "controls.js",
		m + "visualizations.js",
		m + "metrics.DAL.js",
		m + "metrics.panel.js"
	];

	var _DAL = function(){
		return app.Mod('metrics').DAL;
	}

	var	_eventListeners = {},
		_emitEvent = function(type,value,reference){

				if(_eventListeners[type])
				for(var f = 0; f < _eventListeners[type].length; f++)
				{
					_eventListeners[type][f](value,reference);
				}		
			};
	

	//AR: Component builders 
	var _buildFilterControls = function(configs){

			var filterControls = [];

			for(var i = 0; i < configs.length; i++)
			{
				var c = configs[i];
					c.onChange = function(type,value,reference){

						_emitEvent('onfilter',value,reference);
					};

				var pk = new app.Mod('controls').Picker(c);
				filterControls.push(pk);
				
			}

			return filterControls;
		},
		_buildPanels = function(configs){

			var panels = [];

			for(var i = 0; i < configs.length; i++)
			{
				var c = configs[i];

				panels.push(new app.Mod("metrics").Panel(c));
			}

			return panels;
		}

	//AR: Controller for handling custom metrics components in the system
	var _module = {
		Controller:{
			//Core framework functions
			clearEventListener:function(){
				_eventListeners = [];
			},
			addEventListener:function(type,callback){

				_eventListeners[type];
				if(!_eventListeners[type])
					_eventListeners[type] = [];

				_eventListeners[type].push(callback);

			},
			emitEvent:function(type,value){
		
				_emitEvent(type,value);	
			
			},
			updateFilterControl:function(control,metricData){

			},
			getPanels:function(metric){
				//AR: Hardcode this for now

				var panels = [];

				if(metric == 'intents')
				{

					panels = _buildPanels([
	    				{
			                "id":"1",
			                "title":"Total Messages",
			                "components":[
			                	{"type":"Kpi","config":{"type":"total","value":"NumMessages","label":"msgs"}},
			                	{"type":"Pie","config":{"property":"Category","value":"NumMessages"}}
			                ]
		            	},
		            	{
		            		"id":"2",
		            		"title":"Unique User Segments",
		            		"components":[
		            			{"type":"Graph","config":{"plot":"stacked","property":"BotChannel","value":"NumUniqUsers","title":"By Channel","label":"Unique Users"}},
		            			{"type":"Graph","config":{"plot":"stacked","property":"Category","value":"NumUniqUsers","title":"By Intents","label":"Unique Users"}}
		            		]
		            	}
    				]);
				}
				else if(metric == 'longest_intents')
				{

					panels = _buildPanels([
	    				{
			                "id":"3",
			                "title":"Total Users",
			                "components":[
			                	{"type":"Kpi","config":{"type":"total","value":"NumUniqUsers","label":"users"}},
			                	{"type":"Pie","config":{"property":"Category","value":"NumUniqUsers"}}
			                ]
		            	},
		            	{
		            		"id":"4",
		            		"title":"Avg Response Time Segments",
		            		"components":[
		            			{"type":"Graph","config":{"plot":"line","property":"BotChannel","value":"AvgResponseTime","title":"By Channel","label":"Avg. Response Time(s)"}},
		            			{"type":"Graph","config":{"plot":"line","property":"Category","value":"AvgResponseTime","title":"By Intents","label":"Avg. Response Time (s)"}}
		            		]
		            	}
    				]);
				}


	    		return panels;
			},
			//Custom functions
			init:function(params,onStart){

				//AR: Hard code this for now we can dynamically generated or update the options later
	    		var filterControls = _buildFilterControls([
								{
					                "layout" : "overview",
					                "name" : "Metrics",
					                "default" : "intents",
					                "data":{
					                		"selected":"intents",
					                		"values" : [ 
							                    "intents", 
							                    "longest_intents"
							                ],
							                "valueDescriptions" : {
							                	"intents":"All Intents",
							                	"longest_intents":"Respone times"
							                }}
				            	},
				            	{
					                "layout" : "overview",
					                "name" : "Timeframe",
					                "default" : "today",
					                "data":{
					                		"selected":"today",
					                		"values" : [ 
							                    "today", 
							                    "this_month", 
							                    "last_60_days"
							                ],
							                "valueDescriptions" : {
							                	"today":"Today",
							                	"this_month":"This Month",
							                	"last_60_days":"Last 60 Days"
							                }}
				            	}			            	
				            	]);


				onStart(filterControls);
			},
			//Data related functions
			getData:function(filters){
				//AR: get data and send it via "onupdate" event
		
				_DAL().getData(filters,function(metricData){

					_emitEvent('onupdate',metricData);

				},function(error){
					//Handle errors here
					app.Controller.setNotification('Error occured');
				});
			}
		}
	}

	define(ui_components,function() {
		app.Bind(_module,ui_components,arguments);
	    return _module;
	});


}());
