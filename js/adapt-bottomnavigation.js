/*
* adapt-bottomnavigation
* License - http://github.com/adaptlearning/adapt_framework/LICENSE
* Maintainers - Oliver Foster <oliver.foster@kineo.com>
*/

define(function(require) {

	var Adapt = require('coreJS/adapt');
	var Backbone = require('backbone');
	
	//PRIVATE VARIABLES
	var visibility = {
		height: 0,
		hidden: true,
		customView: null
	};

	var bottomnavigation = new (Backbone.View.extend({

		//DRAWING
		setCustomView: function(view) {

			view.undelegateEvents();

			bottomnavigation.model.set("_customView", view);

			bottomnavigation.$el.html("").append( view.$el );

			view.delegateEvents();

			Adapt.trigger("bottomnavigation:setCustomView", view);
		},

		render: function() {

			if (typeof bottomnavigation.model.get("_customView").render == "function") bottomnavigation.model.get("_customView").render();
			
		},

		//MAIN
		showMobile: function(bool) {
			bottomnavigation.model.set("_showOnMobile", (bool == true) );

			if (bool) $("html").removeClass("bottomnavigation-hidden-mobile");
			else $("html").addClass("bottomnavigation-hidden-mobile");
		},

		show: function(duration) {
			if (!visibility.hidden) return;

			Adapt.trigger("popup:opened");

			bottomnavigation.render();

			if (typeof duration == "undefined") duration = bottomnavigation.model.get("_duration").show;

			function start() {
				$("html").addClass("has-bottomnavigation");
				bottomnavigation.$el.css({
					"height": "0px", 
					"display": "block", 
					width: $(window).width()
				});
			}
			
			function complete() {
				visibility.hidden = false;
				bottomnavigation.$el.css({
					height: "",
					display: "block"
				});
				Adapt.trigger("bottomnavigation:opened");
			}

			if (duration > 0 ) {
				bottomnavigation.$el.animate({ 
					height: visibility.height + "px" 
				}, {
					duration: duration, 
					start: start,
					complete: complete 
				});
			} else {
				start();
				complete();
			}
		},

		hide: function(duration) {
			if (visibility.hidden) return;

			if (typeof duration == "undefined") duration = bottomnavigation.model.get("_duration").hide;

			function start() {
				$("html").removeClass("has-bottomnavigation");
			}
			
			function complete() {
				visibility.hidden = true;
				Adapt.trigger("popup:closed");
				Adapt.trigger("bottomnavigation:closed");
				bottomnavigation.$el.hide();
				bottomnavigation.$el.css("height", "");
			}
			
			if (duration > 0) {
				bottomnavigation.$el.animate({ 
					height: "0px" 
				}, {
					duration:duration,
					start: start, 
					complete: complete
				});
			} else {
				start();
				complete();
			}
		}
	}))();

	bottomnavigation.$el = $('<div>').addClass("bottomnavigation").appendTo($("body"));

	Adapt.on("bottomnavigation:open", function() {
		bottomnavigation.show();
	});
	
	Adapt.on("bottomnavigation:close", function() {
		bottomnavigation.hide();
	});

	Adapt.once("app:dataReady", function() {
		bottomnavigation.model = new Backbone.Model(Adapt.course.get("_bottomnavigation"));

		if (typeof bottomnavigation.model.get("_duration") == "undefined") bottomnavigation.model.set("_duration", { 
			show:100,
			hide:100 
		});

		if (typeof bottomnavigation.model.get("_showOnMobile") == "undefined") bottomnavigation.model.set("_showOnMobile", false);

		if (bottomnavigation.model.get("_showOnMobile")) $("html").addClass("bottomnavigation-hidden-mobile");

		//capture height
		visibility.height = parseInt(bottomnavigation.$el.css("height"));

		Adapt.trigger("bottomnavigation:initialized");
	});

	//device resize and navigation drawn
	Adapt.on("device:resize navigationView:postRender", function() { 
		//capture height
		visibility.height = parseInt(bottomnavigation.$el.css("height"));

		//set width to window width (to align with restricted aspect ratios)
		bottomnavigation.$el.css({width: $(window).width()});
	});
	
	Adapt.bottomnavigation = bottomnavigation;
});