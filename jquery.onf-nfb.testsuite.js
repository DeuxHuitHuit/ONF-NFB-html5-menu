/**
 * ONF-NFB Menu Ad Hoc Test Suite jQuery script
 * 
 * @author: DeuxHuitHuit
 * 
**/

;(function ($, undefined) {
	
	function log() {
		var input = '{' + this + '} ', i;
		for (i in arguments) {
			input += arguments[i] + ', ';
		}
		console.log(input);
	};
	
	/** Test methods **/
	function testDefaultImpl() {
		console.log('[test] defaultImpl');
		
		// top menu
		$.onf_nfb.menu.top();
		
		// bottom menu
		$.onf_nfb.menu.bot();
	};
	
	function testCustomLinks() {	
		console.log('[test] customLinks');
		// top menu
		$.onf_nfb.menu.top({
			links: [
					{title: function() { return 'test-link';},	//{fr:'Explorer', en:'Explore'}, 
					    url: {fr:'http://www.onf.ca/explorer-tous-les-films/', en:'http://www.nfb.ca/explore-all-films/'},
					    callback: log, preventDefault:false, target: null, cssClass: null, tag: 'test-top'
					 }
			       ]
		});
		
		// bottom menu
		$.onf_nfb.menu.bot({
			links: [
					{title: 'test-link-bot',
					    url:null,
					    callback: log, preventDefault:false, target: null, cssClass: null, tag: 'test-bot'
					 }
			       ]
		});
	};
	
	function testCustomLinksRecursive() {	
		console.log('[test] customLinksRecursive');
		// top menu
		$.onf_nfb.menu.top({
			recursive: true, // allow deep merge of arrays and objects
			links: [
					{title: function() { return 'test-link';},	//{fr:'Explorer', en:'Explore'}, 
					    url: {fr:'http://www.onf.ca/explorer-tous-les-films/', en:'http://www.nfb.ca/explore-all-films/'},
					    callback: log, preventDefault:false, target: null, cssClass: null, tag: 'test-top'
					 }
			       ]
		});
		
		// bottom menu
		$.onf_nfb.menu.bot({
			recursive: true, 
			links: [
					{title: 'test-link-bot',
					    url:null,
					    callback: log, preventDefault:false, target: null, cssClass: null, tag: 'test-bot'
					 }
			       ]
		});
	};
	
	function testNoLinks() {	
		console.log('[test] no Links');
		// top menu
		$.onf_nfb.menu.top({
			links: null,
			search: null,
			translate: null,
			help: null
		});
		
		// bottom menu
		$.onf_nfb.menu.bot({
			links: null,
			share: null,
			fulscreen: null,
			vol: null
		});
	};
	
	function testNoHover() {
		console.log('[test] noHover');
		// top menu
		$.onf_nfb.menu.top({
			opacity: 1, opacityHover: 1
		});
		
		// bottom menu
		$.onf_nfb.menu.bot({
			opacity: 0, opacityHover: 0 // works since we use a diff and opacity will revert to only css
		});
	};
	
	function testCustomTranslation() {
		console.log('[test] translations');
		// top menu
		$.onf_nfb.menu.top({
			search: {
				title: 'Search-test',
				callback: log
			},
			help: {title: function (lg) { return 'help-'+lg;}, 
				url: {fr:'http://www.onf.ca/a-propos/faq/', en:'http://www.nfb.ca/about/faq/'}, 
				callback: log, preventDefault:false, target: '_blank', cssClass: null, tag: 'help'
			},
			translate: [
		       {
		    	title: 'Français',
		    	url: 'http://interactif.onf.ca/', callback: null, preventDefault:false, target: null, cssClass: null, 
		    	tag: 'lang-fr' // tag code is really important here, to prevent the current lang from showing up
		       },
		       {
		    	title: 'Espanol',
		    	url: 'http://interactive.nfb.ca/es/', callback: null, preventDefault:false, target: null, cssClass: null, 
		    	tag: 'lang-es'
		       },
		       {
		    	title: 'English',
		    	url: 'http://interactive.nfb.ca/', callback: null, preventDefault:false, target: null, cssClass: null, 
		    	tag: 'lang-en'
		       }
			]
		});
		
		// bottom menu
		$.onf_nfb.menu.bot({
			share: {
				title: 'share-test',
				links: {
					facebook: 'http://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(document.location),
					twitter: 'http://www.twitter.com/intent/tweet?text=%23ONFi ' + encodeURIComponent(document.title) + ' ' + encodeURIComponent(document.location),
					stumpleupon: 'http://www.stumbleupon.com/submit?url='+ encodeURIComponent(document.location) + '&title=' + encodeURIComponent(document.title)
				},
				callback: log
			},
			volume: {
				title:'vol-test',
				callback: log
			},
			fullscreen: {
				title: 'fullscreen-test',
				callback: log
			}
		});
	};
	
	function testAddNewLogger() {
		console.log('[test] add new logger');
		// adding a simple logger
		$.onf_nfb.stats.add({
			name: 'test logger',
			log: function (cat, action, label, value) {
				console.log(this.name + ': ' + cat + ', ' + action + ', ' + label + ', ' + value);
			}
		});
	};
	
	function testCustomEvent() {
		console.log('[test] custom events');
		
		$(document).on($.onf_nfb.events.namespace, log); // all events
		
		$(document).on($.onf_nfb.events.fullscreen, log);
		
		$('#onf-top').on($.onf_nfb.events.topclick, log);
		
		$('#onf-bot').on($.onf_nfb.events.botclick, log);
	};
	
	
	/** Global object **/
	$.onf_nfb = $.extend(true, $.onf_nfb, {
		tests: {
			"default": testDefaultImpl,
			customLinks: testCustomLinks,
			customLinksRecursive: testCustomLinksRecursive,
			noLinks: testNoLinks,
			noHover: testNoHover,
			translation: testCustomTranslation,
			customEvent: testCustomEvent,
			addNewLogger: testAddNewLogger
		}
	});
	
	
})(jQuery);