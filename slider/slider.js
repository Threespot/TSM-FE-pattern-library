// Slider-UI View Controller
// -------------------------
function SliderView(options) {
	var self = this;
	this.$el = $(options.el);
	this.$el.on('mousedown touchstart', function(evt) { self.touch(evt); });
	this.initialize();
}

SliderView.prototype = {
	_value: null,
	_input: false,
	
	options: {
		tick: 0.1, // Tick: snap percentage interval across the range. Use 0 to disable.
		precision: 3, // Float precision to maintain for decimal values.
		integer: true, // Maintain value as an integer.
		formatter: null // Optional value formatter function.
	},
	
	$: function(selector) {
		return this.$el.find(selector);
	},
	
	initialize: function() {
		// Elements:
		this.$input = this.$("input");
		this.$handle = this.$(".handle");
		this.$range = this.$(".range");
		this.$value = this.$(".range-value");
		
		// Display metrics:
		this.lower = this.$el.is(".range-bottom");
		this.min = parseFloat(this.$el.attr("data-min"));
		this.max = parseFloat(this.$el.attr("data-max"));
		this.range = this.max - this.min;
		this.pad = Math.round(this.$handle.width() / 2);
		this.limit = this.$el.width() - (this.pad * 2);
		
		// Set initial value to render:
		this.value(this.$input.val());
	},
	
	render: function() {
		var perc = this.perc();
		var range = this.lower ? perc : 1-perc;
		this.$handle.css("left", this.limit * perc);
		this.$range.width(this.limit * range + this.pad);
		this.$input.val(this._value);
		this.$value.text(this.prettyValue());
		
		// Trigger change in response to manual input events:
		if (this._input) {
			this.$input.trigger("change");
		}
	},
	
	// Gets the pretty formatted value, per optional formatter function:
	prettyValue: function() {
		var formatter = this.options.formatter;
		if (formatter && formatter.call) {
			return formatter(this._value);
		}
		return this._value;
	},
	
	// Gets/sets the slider value:
	value: function(val) {
		if (val) {
			if (typeof val != "number") {
				val = parseFloat(val);
			}
			
			// Restrict value range:
			val = Math.max(this.min, Math.min(val, this.max));
			
			// Snap to ticks, if enabled:
			if (this.options.tick) {
				var tick = this.range * this.options.tick;
				val -= this.min;
				val = this.min + tick * Math.round(val / tick);
			}
			
			// Parse as integer, if enabled:
			if (this.options.integer) {
				val = parseInt(val, 10);
			} else {
				var precis = Math.pow(10, this.options.precision);
				val = Math.round(val * precis) / precis;
			}
			
			// Rerender when value changes:
			if (val !== this._value) {
				this._value = val;
				this.render();
			}
		}
		return this._value;
	},
	
	// Gets/sets the slider's percentage value:
	perc: function(perc) {
		if (perc) {
			// Restrict percentage range:
			perc = Math.max(0, Math.min(perc, 1));
			
			// Set new value:
			this.value(this.min + (this.range * perc));
		}
		return (this._value - this.min) / this.range;
	},
	
	// Event delegations:
	events: {
		"mousedown": "touch",
		"touchstart": "touch"
	},
	
	// Touch start / move / end behaviors:
	touch: function(evt) {
		var self = this;
		var moveEvent = "mousemove";
		var endEvent = "mouseup";
		
		if (evt.type == "touchstart") {
			moveEvent = "touchmove";
			endEvent = "touchend";
		}

		moveEvent = moveEvent + ".slider";
		endEvent = endEvent + ".slider";
		
		// Gets the page-X coordinate from an event:
		var getX = function(evt) {
			var original = evt.originalEvent;
			evt.preventDefault();

			if (original && original.touches) {
				original.preventDefault && original.preventDefault();
				return original.touches[0].pageX;
			}
			return evt.pageX || original.pageX || 0;
		};
		
		// Apply end/move behaviors:
		$(document)
			.on(endEvent, function(evt) {
				$(document).off(endEvent +" "+ moveEvent);
				self.capture(getX(evt));
				self._input = false;
			})
			.on(moveEvent, function(evt) {
				self.capture(getX(evt));
			});
		
		// Capture initial input:
		this._input = true;
		this.capture(getX(evt));
	},
	
	// Input capture handler:
	capture: function(x) {
		this.perc((x - (this.$el.offset().left + this.pad)) / this.limit);
	}
};