(function(win, doc, $) {
	window.setAccordion = function()
	{
		var data = {
			elements : {
				root : 'accordion',
				item : 'accordion-item',
				content: 'accordion-item-content',
				content_wrapper : 'accordion-item-content-wrapper',
				toggle: 'accordion-item-toggle'
			},
			states : {
				ready : '__accordion--ready',
				item_ready : '__accordion-item--ready',
				item_active : '__accordion-item--active'
			},
			attributes : {
				start_at : 'accordion-start-at',
				multiple : 'accordion-multiple'
			}
		}

		var accordions = $('.' + data.elements.root).not('.' + data.states.ready);

		if(accordions.length === 0)
		{
			return;
		}

		doc.on({
			'tipi.accordion.toggle' : function(event, accordion, index, options) {
				toggleAccordionItem(accordion, index, data, options);
			},
			'tipi.accordion.open' : function(event, accordion, index, options) {
				openAccordionItem(accordion, index, data, options);
			},
			'tipi.accordion.close' : function(event, accordion, index, options) {
				closeAccordionItem(accordion, index, data, options);
			}
		});

		accordions.each(function(i) {
			var accordion = $(this);
			var accordion_item = getAccordionElement(accordion, 'item', data);
			var accordion_item_toggle = getAccordionElement(accordion, 'toggle', data);

			if(accordion_item.length === 0 || accordion_item_toggle.length === 0)
			{
				return;
			}

			//Set the options for each accordion
			var options = getAccordionOptions(accordion, data);

			accordion_item_toggle.on({
				click : function(event)
				{
					var toggle = $(this);
					var accordion = getAccordionElement(toggle, 'root', data);

					//Don't proceed if the accordion is not ready
					if(!accordion.hasClass(data.states.ready))
					{
						return;
					}

					event.preventDefault();
					var index = toggle.parents('.' + data.elements.item).first().index();

					doc.trigger('tipi.accordion.toggle', [accordion, index, options]);
					doc.trigger('tipi.accordion.resize', [accordion]);
				}
			});

			for (var i = 0; i < options.start_at.length; i++) {
				if(options.start_at[i] >= 0) {
					doc.trigger('tipi.accordion.open', [accordion, options.start_at[i], options]);
				}
			}

			//Add the ready classes
			accordion_item.addClass(data.states.item_ready);
			accordion.addClass(data.states.ready);
		});
	}

	function toggleAccordionItem(accordion, index, data, options)
	{
		var item = getAccordionElement(accordion, 'item', data);

		if(item.length === 0)
		{
			return;
		}

		if(options.multiple === false) {
			item.eq(index).siblings().removeClass(data.states.item_active);
		}

		item.eq(index).toggleClass(data.states.item_active);
	}

	function openAccordionItem(accordion, index, data, options)
	{
		var item = getAccordionElement(accordion, 'item', data).eq(index);

		if(item.length === 0)
		{
			return;
		}

		item.addClass(data.states.item_active);
	}

	function closeAccordionItem(accordion, index, data, options)
	{
		var item = getAccordionElement(accordion, 'item', data).eq(index);

		if(item.length === 0)
		{
			return;
		}

		item.removeClass(data.states.item_active);
	}

	function getAccordionOptions(accordion, data)
	{
		var options = {
			multiple : false,
			start_at : [-1]
		}

		if(typeof accordion.data(data.attributes.multiple) != 'undefined')
		{
			options.multiple = true;
		}

		//Set the starting index on the accordion
		if(typeof accordion.data(data.attributes.start_at) != 'undefined')
		{
			//Store the starting indexes
			var indexes = String(accordion.data(data.attributes.start_at));
			indexes = indexes.replace(' ', '');
			indexes = indexes.split(',');

			var values = [];

			//Loop trough all indexes
			for (var i = 0; i < indexes.length; i++) {
				var index = parseInt(indexes[i]);
				if(index === NaN) {
					break;
				}

				values.push(index);
			}


			if(values.length > 0)
			{
				options.start_at = values;
			}
		}

		return options;
	}

	function getAccordionElement(origin, type, data)
	{
		if(typeof origin == 'undefined' || typeof data.elements == 'undefined')
		{
			return;
		}

		var element = $();

		switch(type) {
			case 'root' :
				element = origin.parents('.' + data.elements.root).first();
				break;
			case 'item' :
				element = origin.find('.' + data.elements.item).first().siblings().addBack();
				break;
			case 'content' :
				element = origin.find('.' + data.elements.content).first();
				break;
			case 'wrapper' :
				element = origin.find('.' + data.elements.content_wrapper).first();
				break;
			case 'toggle' :
				var toggles = origin.find('.' + data.elements.toggle);

				//Loop through all toggles so we can filter out the nested ones
				toggles.each(function() {
					var toggle = $(this);
					var accordion = toggle.parents('.' + data.elements.root).first();

					//If the traversed accordion is the same as our origin (accordion)
					if(!accordion.is(origin))
					{
						return;
					}

					element = element.add(toggle);
				});

				break;
			default:
		}

		return element;
	}

})( window.jQuery(window), window.jQuery(document), window.jQuery);