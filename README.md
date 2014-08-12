adapt-bottomnavigation
================

Bottom navigation bar  

Responds to events:  

	bottomnavigation:open
	bottomnavigation:close

Adapt.bottomnavigation public interface:  

	setCustomView(view) : Sets contents to Backbone.View  
	render() : Renders/rerenders custom Backbone.View  
	showMobile(bool) : Show in mobile size true/false  
	show(duration) : Show with millisecond slide-up animation  
	hide(duration) : Hide with millisecond slide-down animation  
	$el : jQuery element

Adapt.bottomnavigation.model: 

```
	"_bottomnavigation": {
	    "_duration": {
	        "show": 200,
	        "hide": 200
	    },
	    "_showOnMobile": false
	}
```

Compatible with (adapt-ratioRestrict)[http://github.com/cgkineo/adapt-ratioRestrict]:  
	Uses $(window).width() to calculate width  