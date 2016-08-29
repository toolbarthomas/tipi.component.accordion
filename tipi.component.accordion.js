function setAccordion() {
	var accordionElements = {
		root : 'accordion',
		item : 'accordion-item',
		header: 'accordion-item-header',
		headerWrapper : 'accordion-item-header-wrapper',
		content : 'accordion-item-content',
		contentWrapper: 'accordion-item-content-wrapper',
		toggle: 'accordion-item-toggle',
	}

	var accordionStates = {
		ready : '__accordion--ready',
		itemReady : '__accordion-item--ready',
		itemActive : '__accordion-item--active',
		toggleReady : '__accordion-item-toggle--ready'
	}

	var accordionDataAttributes = {
		startAt : 'accordion-start-at',
		multiple : 'accordion-multiple'
	}

	var accordionOptions = {
		startAt : false,
		multiple : false,
		timeout: 250
	};

	var accordion = $('.' + accordionElements.root).not('.' + accordionStates.ready);
	if(accordion.length > 0) {

		accordion.on({
			'tipi.accordion.toggle' : function(event, accordion, index) {

				if(typeof accordion != 'undefined') {
					if(accordion.length > 0) {
						toggleAccordionItem(accordion, index, accordionElements, accordionStates, accordionOptions);
					}
				}
			},
			'tipi.accordion.open' : function(event, accordion, index) {
				if(typeof accordion != 'undefined') {
					if(accordion.length > 0) {
						openAccordionItem(accordion, index, accordionElements, accordionStates, accordionOptions);
					}
				}
			},
			'tipi.accordion.close' : function(event, accordion, index) {
				if(typeof accordion != 'undefined') {
					if(accordion.length > 0) {
						closeAccordionItem(accordion, index, accordionElements, accordionStates, accordionOptions);
					}
				}
			},
			'tipi.accordion.resize' : function(event, accordion, index) {
				if(typeof accordion != 'undefined') {
					if(accordion.length > 0) {
						resizeAccordionItem(accordion, index, accordionElements, accordionStates, accordionOptions);
					}
				}
			}
		});

		accordion.each(function() {
			var accordionEach = $(this);
			var accordionItem = getAccordionElement(accordionEach, 'item', accordionElements);

			if(accordionItem.length > 1) {
				accordionEach.addClass(accordionStates.ready);
				accordionItem.addClass(accordionStates.itemReady);

				// var accordionOptions = {
				// 	startAt : false,
				// 	multiple : false,
				// 	timeout: 250
				// };

				//@startAt: Set an active state on a single or multiple accordion items
				var isStartat = accordionEach.data(accordionDataAttributes.startAt);
				if(typeof isStartat != 'undefined') {
					if(parseInt(isStartat) != 'NaN') {
						accordionOptions.startAt = isStartat;
					}
				}

				//@multiple: Open multiple accordion items within a single accordion.
				var isMultiple = accordionEach.data(accordionDataAttributes.startAt);
				if(typeof isMultiple === 'boolean') {
					accordionOptions.multiple = isMultiple;
				}

				var accordionItemToggle = getAccordionElement(accordionEach, 'toggle', accordionElements).not('.' + accordionStates.toggleReady);
				accordionItemToggle.addClass(accordionStates.toggleReady);

				if (typeof accordionItemToggle != 'undefined') {
					accordionItemToggle.on({
						click : function(event) {
							var toggle = $(this);

							//Check if the toggle is within an active accordion
							if(accordion.hasClass(accordionStates.ready)) {
								event.preventDefault();

								var index = toggle.parents('.' + accordionElements.item).first().index();

								accordion.trigger('tipi.accordion.toggle', [getAccordionElement(toggle, 'root', accordionElements), index]);
								accordion.trigger('tipi.accordion.resize', [getAccordionElement(toggle, 'root', accordionElements), index]);
							}
						}
					});
				}

				var accordionEvent;
				$(window).on({
					resize : function() {
						clearTimeout(accordionEvent);
						accordionEvent = setTimeout(function() {
							accordion.trigger('tipi.accordion.resize', [accordion])
						}, 100);
					}
				});

				if(accordionOptions.startAt !== false) {
					accordion.trigger('tipi.accordion.resize', [accordion]);

					accordion.trigger('tipi.accordion.open', [accordion, accordionOptions.startAt]);
					accordion.trigger('tipi.accordion.resize', [accordion, accordionOptions.startAt]);
				} else {
					accordion.trigger('tipi.accordion.resize', [accordion])
				}
			}
		});
	}
}

function toggleAccordionItem(accordion, index, accordionElements, accordionStates, accordionOptions) {
	var accordionItem = getAccordionElement(accordion, 'item', accordionElements);

	if(typeof accordionItem != 'undefined') {
		if(accordionItem.length > 0) {
			if(typeof accordionOptions.multiple != 'undefined') {
				if(accordionOptions.multiple === true) {
					accordionItem.eq(index).siblings().removeClass(accordionStates.itemActive);
				}
			}

			accordionItem.eq(index).toggleClass(accordionStates.itemActive);
		}
	}
}

function closeAccordionItem(accordion, index, accordionElements, accordionStates) {
	var accordionItem = getAccordionElement(accordion, 'item', accordionElements);
	accordionItem = filterAccordionItem(accordionItem, index);

	//Loop trough all accordionItems and add the active class to them
	accordionItem.each(function() {
		$(this).removeClass(accordionStates.itemActive);
	});
}

function openAccordionItem(accordion, index, accordionElements, accordionStates) {
	var accordionItem = getAccordionElement(accordion, 'item', accordionElements);
	accordionItem = filterAccordionItem(accordionItem, index);

	//Loop trough all accordionItems and add the active class to them
	accordionItem.each(function() {
		$(this).addClass(accordionStates.itemActive);
	});
}

function resizeAccordionItem(accordion, index, accordionElements, accordionStates, accordionOptions) {
	var accordionItem = getAccordionElement(accordion, 'item', accordionElements);
	accordionItem = filterAccordionItem(accordionItem, index);

	//Loop trough all accordionItems.
	accordionItem.each(function() {
		var accordionItem = $(this);
		var accordionContent = getAccordionElement(accordionItem, 'content', accordionElements);
		var accordionContentWrapper = getAccordionElement(accordionItem, 'contentWrapper', accordionElements);

		//Check the current accordionItem has a parentItem
		var accordionItemParent = accordionItem.parents('.' + accordionElements.item).first();
		if(accordionItemParent.length > 0) {
			var accordionItemParentContent = getAccordionElement(accordionItemParent, 'content', accordionElements);
			var height = accordionItemParentContent.outerHeight();

			if(height > 0) {
				accordionItemParentContent.css({
					'height' : 'auto',
					'min-height' : height
				});
			}
		}

		if(accordionItem.hasClass(accordionStates.itemActive)) {
			accordionContent.css({
				'height' : accordionContentWrapper.outerHeight()
			});
		} else {
			accordionContent.css({
				'height' : 0
			});
		}

		// resizeAccordionItemParent(accordion, accordionItem, accordionContent, accordionContentWrapper, accordionElements);
	});
}

function resizeAccordionItemParent(accordion, accordionItem, accordionContent, accordionContentWrapper, accordionElements) {
	accordionItem.each(function() {
		var resizeInterval;
		var check = 0;

		resizeInterval = setInterval(function() {
			if(accordionContent.outerHeight() != 0 && accordionContentWrapper.outerHeight() != accordionContent.outerHeight()) {
				clearInterval(resizeInterval);

				var accordionParent = getAccordionElement(accordion, 'root', accordionElements);
				if(typeof accordionParent != 'undefined') {
					accordion.trigger('tipi.accordion.resize', [accordionParent]);

					console.log('aa');
				}
			}
		}, 25);
	});
}

function getAccordionElement(origin, type, accordionElements) {
	if(typeof origin != 'undefined' && typeof type != 'undefined') {
		var element;

		switch(type) {
			case 'root' :
				element = origin.parents('.' + accordionElements.root).first();
				break;
			case 'item' :
				element = origin.find('.' + accordionElements.item).first().siblings().addBack();
				break;
			case 'header' :
				element = origin.find('.' + accordionElements.header).first();
				break;
			case 'headerWrapper' :
				element = origin.find('.' + accordionElements.headerWrapper).first();
				break;
			case 'content' :
				element = origin.find('.' + accordionElements.content).first();
				break;
			case 'contentWrapper' :
				element = origin.find('.' + accordionElements.contentWrapper).first();
				break;
			case 'toggle' :
				element = origin.find('.' + accordionElements.toggle);
				break;
		}

		return element;
	}
}

function filterAccordionItem(accordionItem, index) {
	//Select all accordion items if we have defined a certain index.
	if(typeof index != 'undefined') {
		//Convert the index to a string so we can always convert it to an array.
		if (typeof index != 'string') {
			index = index.toString();
		}

		//Splite the index values at the comma so we can loop trough them
		index = index.replace(', ', ',');
		index = index.split(',');
		if(index.length > 0) {
			var item = $([]);
			for (var i = 0; i <= index.length - 1; i++) {
				item.push(accordionItem.eq(index[i]));
			}
		}
	} else {
		item = accordionItem;
	}

	return item;
}