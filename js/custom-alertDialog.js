function alertDialog(logo,message,callback) {
	//declaration of variables
	var dialogElem, dialog;

	dialog = this;

	this.hide = function(){
		$('.custom-alertDialog-popup').removeClass('active');
		$('body').css('pointer-events','auto');
	}
	this.show = function(){
		// $('#pop_up_Container').addClass('active');
		setTimeout(function(){
			$('.custom-alertDialog-popup').addClass('active');
			$('body').css('pointer-events','none');
			$('.custom-alertDialog-popup').css('pointer-events','auto');
		},100);
		
	}
	this.destroy = function() {
		dialogElem.remove();
	}
	this.initializeEventsHandler = function() {
		dialogElem.find("#button").unbind('click');

		dialogElem.find("#button").on("click", function() {
			dialog.hide();
			setTimeout(function(){
				dialog.destroy();
				callback();
			},400);		
		});
	}
	this.createAlertDialog = function(){
		var dialogHTML = '<div class="custom-alertDialog-popup">\
							<div id="logo"></div>\
							<div id="text"><span></span></div>\
							<div id="button">OK</div>\
						</div>';
		$('body').append(dialogHTML);
		dialogElem = $('.custom-alertDialog-popup');

		dialogElem.find('#logo').html(logo);
		dialogElem.find('#text span').html(message);
	}
	//initializing variables

	dialog.createAlertDialog();
	dialog.initializeEventsHandler();
	dialog.show();
}