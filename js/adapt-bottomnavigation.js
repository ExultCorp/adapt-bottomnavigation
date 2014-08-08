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
		hidden: true
	};

	var bottomnavigation = {
		//PUBLIC VARIABLES
		$el: $('<div>').addClass("bottomnavigation").appendTo($("body")),
		model: null,
		view: null,

		//EVENTS
		onResize: function() {
			//capture height
			visibility.height = parseInt(this.$el.css("height"));

			//set width to window width (to align with restricted aspect ratios)
			this.$el.css({width: $(window).width()});
		},

		initialize: function() {

			this.model = new Backbone.Model(Adapt.course.get("_bottomnavigation"));

			if (typeof this.model.get("_duration") == "undefined") this.model.set("_duration", { 
				show:100,
				 hide:100 
			});

			if (typeof this.model.get("_showMobile") == "undefined") this.model.set("_showMobile", false);

			if (this.model.get("_showMobile")) $("html").addClass("bottomnavigation-hidden-mobile");

			//capture height
			visibility.height = parseInt(this.$el.css("height"));

			Adapt.trigger("bottomnavigation:initialized");
		},

		//DRAWING
		setCustomView: function(view) {

			view.undelegateEvents();

			this.view = view;

			this.$el.html("").append(this.view.$el);

			view.delegateEvents();

			Adapt.trigger("bottomnavigation:setCustomView", view);
		},

		render: function() {
			if (typeof this.view.preRender == "function") this.view.preRender();
			if (typeof this.view.render == "function") this.view.render();
			if (typeof this.view.postRender == "function") this.view.postRender();
		},

		//MAIN
		showMobile: function(bool) {
			this.model.set("_showMobile", (bool == true) );

			if (bool) $("html").removeClass("bottomnavigation-hidden-mobile");
			else $("html").addClass("bottomnavigation-hidden-mobile");
		},

		show: function(duration) {
			if (!visibility.hidden) return;

			Adapt.trigger("popup:opened");

			this.render();

			if (typeof duration == "undefined") duration = this.model.get("_duration").show;

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
				this.$el.animate({ 
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

			if (typeof duration == "undefined") duration = this.model.get("_duration").hide;

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
				this.$el.animate({ 
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
	};

	Adapt.on("bottomnavigation:open", function() {
		bottomnavigation.show();
	});
	
	Adapt.on("bottomnavigation:close", function() {
		bottomnavigation.hide();
	});

	Adapt.once("app:dataReady", function() {
		bottomnavigation.initialize();
	});

	//device resize and navigation drawn
	Adapt.on("device:resize", function() { 
		bottomnavigation.onResize();
	});

	Adapt.on("navigationView:postRender", function() { 
		bottomnavigation.onResize(); 
	});
	
	Adapt.bottomnavigation = bottomnavigation;
});