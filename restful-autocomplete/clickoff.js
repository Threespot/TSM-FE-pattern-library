// Toggleable Panel Control:

function Toggle(selector, options) {
	var self = this;
	options = options || {};
	
	// Transfer options onto instance:
	for (var i in options) this[i] = options[i];
	
	// Select and bind to element:
	this.$el && this.$el.on('click.toggle mousedown.toggle touchstart.toggle', function(evt) {
		self.trigger(evt);
	});
}

Toggle.prototype = {
	closed: false,
	$el: null,
	$panel: null,
	
	// Opens the bound panel:
	open: function() {
		this.$panel && this.$panel.show();
	},
	
	// Closes the bound panel:
	close: function() {
		this.$panel && this.$panel.hide();
	},
	
	// Triggers in response to bound events:
	trigger: function(evt) {
		if ((evt.type == 'mousedown' || evt.type == 'touchstart') && this.$panel.is(':visible')) {
			// Event was down/start, and panel is visible:
			this.closed = true;
			return this.close();
			
		} else if (!this.closed) {
			var self = this;
			
			// Event was click, and panel did not just close with last action:
			this.open();
			
			TapOff.bind(this.$panel, function() {
				self.close();
			});
		}
		
		this.closed = false;
	},
	
	// Destroys the component architecture:
	destroy: function() {
		this.$el.off('.toggle');
		this.$el = null;
	}
};


// Tap-off behavior for closing elements:
var TapOff = (function() {
	var $doc = $(document);
	var events = "mousedown.nix touchstart.nix resize.nix";
	var closeMethod = null;
	
	function callClose() {
		if (closeMethod && closeMethod.call) {
			closeMethod();
			closeMethod = null;
		}
	}
	
	return {
		bind: function($el, handler) {
			callClose();
			closeMethod = handler;
			
			// Configure nixable behavior:
			$doc.off(events).on(events, function(evt) {
				var $target = $(evt.target);
				if (!$target.closest($el).length || $target.is('.close')) {
					$doc.off(events);
					callClose();
				}
			});
		}
	};
}());