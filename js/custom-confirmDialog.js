function confirmDialog(callback) {
	var dialog = this;
	var dialogElem;
	
	var ret = function(val){
		callback(val);
	}
	this.show =function() {
		setTimeout(function(){
			dialogElem.addClass('active');
			dialogElem.css('pointer-events','auto');
			$('body').css('pointer-events','none');			
		},100);
	}
	this.hide = function() {

		dialogElem.removeClass('active');

		setTimeout(function(){
			dialog.destroy();
		},400);		
		$('body').css('pointer-events','auto');
	}
	this.destroy = function() {
		dialogElem.remove();
	}
	this.initializeEventsHandler = function(){
		dialogElem.find("#btnYes").unbind( "click" );
		dialogElem.find( "#btnCancel").unbind( "click" );

		dialogElem.find("#btnYes").on("click", function() {
			dialog.hide();
			ret('yes');
			
		});
		dialogElem.find("#btnCancel").on("click", function() {
			dialog.hide();
			ret('no');
		});
	}
	this.createDialog = function(){
		var dialogHTML = '<div class="custom-confirmation-dialog">\
							<div id="logo"><i class="fa fa-exclamation" aria-hidden="true"></i></div>\
							<div id="text">Are you sure?</div>\
							<div id="button">\
								<div id="btnCancel">Cancel</div>\
								<div id="btnYes">Yes</div>\
							</div>\
						</div>';
		$('body').append(dialogHTML);
		
		dialogElem = $('.custom-confirmation-dialog');
	}
	dialog.createDialog();
	dialog.initializeEventsHandler();
	dialog.show();
}