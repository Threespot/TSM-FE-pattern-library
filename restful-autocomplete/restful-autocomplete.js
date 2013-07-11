// RESTful AutoCompleter:
// Builds off Backbone for RESTful syncronizing. Includes:

// 1) AutoCompleter model (manages the loading and storage of queried data).
// 2) AutoCompleter view (manages rendering and behavior of the picker input/options list).

// NOTE: AutoCompleter View is agnostic toward the context in which it is displayed.
// All external view behaviors (tooltip/menu behaviors) should be applied separately.

// Usage:
// var ac = new AutoCompleter({el:'#dom-id'});
// ac.on('select', function(model) {
//     console.log( model.get('dataProp') );
// });
// ac.open();

var AutoCompleter = (function() {
	
	// Selections Picker Model:
	// ------------------------
	var AutoCompleterModel = Backbone.Collection.extend({
		// API endpoint:
		// - Should accept a query GET param.
		// - Should return a JSON array of matching object records.
		url: "api.php",
	
		query: "",
		status: "",
		skipped: 0,
	
		// Backbone override.
		// Fetches data for the collection using customized parameters:
		fetch: function() {
			this.skipped = 0;
		
			// Format GET vars for API request:
			Backbone.Collection.prototype.fetch.call(this, {reset:true, data:{
				format: 'json',
				q: this.query // << The query param to send.
			}});
		},
	
		// Backbone override.
		// Parses out received data before resetting it into the collection:
		parse: function( response ) {
			// Pull returned options list from the response data:
			//var options = response.objects; // << Tastypie return format.
			var options = response;
		
			// OPTIONAL: filter down returned results here. Example:
			// _.filter(options, function(item) { return ...keep item?... ; });
		
			this.status = options.length ? "" : "No matching results.";
			return options;
		},
	
		// Submit a new search query:
		// Requires a query length of N characters. Rules as follow:
		// - If query length has fewer than N characters, clear the results.
		// - If query WAS too short but now fulfills N, fetch data immediately.
		// - Throttle the rate of fetching new queries by debouncing input.
		// - Override debounce every few characters to keep results in sync with query.
		runQuery: function( query ) {
			var n = 3;
			var prev = this.query;
			this.query = query;
			this.status = "";
		
			// Clear any debounced queries:
			clearTimeout( this.throttle );
		
			if ( query.length < n ) {
				// Empty in response to invalid queries:
				this.clear();
			}
			else if ( prev.length < n && query.length >= n || this.skipped >= n ) {
				// Immedaitely fetch when length threshold is crossed,
				// or when skipped key presses are lagging:
				this.fetch();
			}
			else {
				// Rate-limit fetch:
				this.throttle = setTimeout(_.bind(this.fetch, this), 700);
				this.skipped++;
			}
		},
	
		// Clear model state:
		clear: function() {
			this.query = "";
			this.status = "Start entering a school name...";
			this.reset();
		}
	});


	// Selections Picker View:
	// -----------------------
	var AutoCompleterView = Backbone.View.extend({
		// ID of the selected item.
		selectionId: "",

		// Init:
		initialize: function() {
			this.model = new AutoCompleterModel();
			this.$query = this.$('input[type="text"]');
			this.$options = this.$(".js-options");
			this.$status = this.$( ".js-status" );
			this.listenTo(this.model, "reset", this.render);
			this.render();
			this.close();
		},
	
		// Renderer:
		render: function() {
			var html = "";

			if ( this.model.length ) {
				// Populate models:
				this.model.each(function( model ) {
					html += '<li data-id="'+ model.get('id') +'">'+ model.get('name') +'</li>';
				}, this);
			
				// Apply bold tags to matched query strings:
				html = html.replace(new RegExp("("+this.model.query+")", "gi"), "<b>$1</b>");

				// Show options list, hide status:
				this.$options.html(html).show();
				this.$status.hide();
			
				// Set selection:
				if (!this.model.get(this.selectionId)) {
					// Default to selecting first item in the collection:
					this.selectionId = this.model.at(0).get("id");
				}
			
				// Render selection:
				var item = this.$options.find('[data-id="'+this.selectionId+'"]').addClass( "selected" );
				this.showSelection( item );
			
			} else {
				// Hide options, show status:
				this.$status.text(this.model.status).show();
				this.$options.hide();
				this.selectionId = "";
			}
			return this;
		},
	
		// Detaches the picker from its bound item slot.
		reset: function() {
			// Hide and clear view:
			this.$query.val("");
			this.selectionId = "";
			this.model.clear();
			this.enterKey( false );
		},
	
		// Attaches the picker to an item slot.
		open: function() {
			this.reset();
			this.$el.show();
			this.$query.focus();
			this.enterKey( true );
		},
	
		close: function() {
			this.reset();
			this.$el.hide();
		},
	
		// IE9+ BUG FIX:
		// Delegates enter key behaviors to the window object.
		// Apparently IE no longer captures the enter key locally within text inputs...?
		enterKey: function( enable ) {
			var self = this;
			var win = $(window);
			var trigger = "keyup.picker";
		
			// Kill any existing trigger:
			win.off(trigger);
		
			// Enable a new window trigger:
			if ( enable ) {
				win.on(trigger, function(evt) {
					if ( evt.which == 13 ) {
						win.off(trigger);
					
						if (self.$el.is(":visible")) {
							self.commitSelection();
							evt.preventDefault();
						}
					}
				});
			}
		},
	
		events: {
			"keyup input": "onKeyPress",
			"mousedown li": "onSoftSelect",
			"click li": "onHardSelect",
			"click .js-close": "close"
		},
	
		// Called upon touching a list option:
		// sets selection state without comitting.
		onSoftSelect: function( evt ) {
			// Clear current selection:
			this.$options
				.find( ".selected" )
				.removeClass( "selected" );
		
			// Find and set new selection:
			this.selectionId = $( evt.target )
				.closest( "li" )
				.addClass( "selected" )
				.attr( "data-id" );
		},
	
		// Called upon clicking a list option:
		// sets and commits selection state.
		onHardSelect: function( evt ) {
			this.onSoftSelect( evt );
			this.commitSelection();
		},
	
		// Called upon key strokes within the input field:
		onKeyPress: function( evt ) {
			// Test for down, up, and enter keys for special handling:
			switch ( evt.which ) {
				case 40: // Down
					this.shiftSelection( 1 );
					evt.preventDefault();
					return false;
				
				case 38: // Up
					this.shiftSelection( -1 );
					evt.preventDefault();
					return false;
				
				case 13: // Enter (now delegates enter key to window to accomodate IE9).
					//this.commitSelection();
					return;
			}

			// Submit search query:
			this.model.runQuery( this.$query.val() );
		},
	
		// Shifts the current selection up and down within the list.
		shiftSelection: function( dir ) {
			var current = this.$options.find( ".selected" );
			var next = dir > 0 ? current.next() : current.prev();
		
			if ( next.length ) {
				current.removeClass( "selected" );
				this.selectionId = next.addClass( "selected" ).attr( "data-id" );
				this.showSelection( next, dir );
			}
		},
	
		// Shows the selection within the visible range.
		showSelection: function( view, dir ) {
			dir = dir || -1;
			var scroll = this.$options.scrollTop();
			var top = view.position().top + scroll;
			var to;
		
			if ( dir < 0 ) {
				to = Math.min( scroll, top );
			} else if (dir > 0) {
				to = Math.max( scroll, top + view.outerHeight() - this.$options.height() );
			}

			this.$options.scrollTop( to );
		},
	
		// Commits the picker's selection to the main application selection state.
		commitSelection: function() {
			if (this.selectionId) {
				var item = this.model.get(this.selectionId);
				this.trigger("select", item);
			}
		}
	});
	
	return AutoCompleterView;
}());