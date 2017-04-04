function popup(settings) {
	var pop = this;
	var popup;

	this.show = function() {
		$('.custom-popup-container').addClass('active');
		setTimeout(function(){
			popup.addClass('active');
		},100);
	}
	this.hide = function() {
		popup.removeClass('active');
		setTimeout(function(){
			$('.custom-popup-container').removeClass('active');
		},300);
	}
	this.loading = function(isShow) {
		if(isShow) {
			// popup.find('.popup_body').append('<div id="formLoading"><i class="fa fa-circle-o-notch" aria-hidden="true"></i></div>');
			popup.find('.popup_body').append('<div id="formLoading"><img src="css/rolling.gif"></div>');
		} else {
			popup.find('.popup_body #formLoading').remove();
		}		
	}
	this.selectNav = function(n) {
		popup.find('.popup_nav .nav:eq( '+n+' )').click();
	}
	this.showBody = function(n) {
		popup.find('.popup_body .popupBodyContent:eq( '+n+' )').addClass('active');
	}
	this.destroy = function(){
		$('.custom-popup-container').remove();	
	}
	this.unbindEventsHandler = function(){
		popup.find('.popup_nav .nav').unbind('click');
		popup.find('.popup_close_button .nav').unbind('click');
	}
	this.initializeEventsHandler = function() {
		pop.unbindEventsHandler();

		popup.find('.popup_nav .nav').click(function() {
			popup.find('.popup_nav .nav').removeClass('active');
			$(this).addClass('active');

			popup.find('.popup_body .popupBodyContent').removeClass('active');
			popup.find('.popup_body .popupBodyContent:eq( '+$(this).index()+' )').addClass('active');
		});

		popup.find('.popup_close_button .fa').click(function() {
			pop.hide();
			setTimeout(function(){
				pop.destroy();
			},400);
		});
	}
	this.initializeFooterEventsButtonHandler = function(functions) {
		popup.find('.popup_footer .button').unbind('click');

		popup.find('.popup_footer .button').click(function() {
			var index = $(this).index();
			eval(functions[index]);
		});
	}
	this.renderStyle = function(){
		popup.attr('style', settings['style']);
		
		if ( 'height' in settings ) {
			popup.css( 'height' , settings.height );
		}

		if ( 'width' in settings ) { 
			popup.css( 'width' , settings.width );
		}	

		if(settings['nav'] == false || settings['footer'] == false || !( 'footer' in settings ) || !( 'nav' in settings )){
			popup.find('.popup_body').css('height', 'calc(100% - 130px)');
		}
		if(settings.footer != false){
			var width = settings.footer.buttons.length * 210;
			popup.find('.popup_footer').css('width', width);
		}
	}
	this.createPopup = function() {
		var popupHtml = '<div class="custom-popup-container">\
							<form class="custom-popup-form" name="myform">\
								<div class="popup_close_button"><i class="fa fa-times" aria-hidden="true"></i></div>\
								<div class="popup_header">\
								</div>\
								<div class="popup_nav">\
								</div>\
								<div class="popup_body">\
								</div>\
								<div class="popup_footer">\
								</div>\
							</form>\
						</div>';
		$('body').append(popupHtml);
		// var myEl = angular.element( document.querySelector( 'body' ) );
		// myEl.append(popupHtml);

		popup = $('.custom-popup-form');

		popup.find('.popup_header').hide();
		popup.find('.popup_nav').hide();
		popup.find('.popup_body').hide();
		popup.find('.popup_footer').hide();

		if(settings.header != false) {
			popup.find('.popup_header').html(settings.header.content).show();
		}

		if(settings.nav != false) {
			$.each(settings.nav, function(index, nav) {
				popup.find('.popup_nav').append('<div class="nav">'+nav+'</div>');
			});
			popup.find('.popup_nav').show();
		}

		if(settings.body != false){
			$.each(settings.body.content, function(index, body) {
				popup.find('.popup_body').append('<div class="popupBodyContent">'+body+'</div>');
			});
			popup.find('.popup_body').show();
		}

		if(settings.footer != false){
			// popup.find('.popup_footer').append(settings['footer']);
			if( 'buttons' in settings.footer){
				var footerButtonsEventHandler = [];
				$.each(settings.footer.buttons, function(index, button) {
					popup.find('.popup_footer').append('<div id="'+button.id+'" class="button">'+button.text+'</div>');
					footerButtonsEventHandler[index] = button.onclick;
				});
				pop.initializeFooterEventsButtonHandler(footerButtonsEventHandler);
			}	
			popup.find('.popup_footer').show();
		}

		pop.renderStyle();
	}
	

	pop.createPopup();
	
	pop.initializeEventsHandler();
	
	pop.selectNav(0);
	pop.showBody(0);
}
