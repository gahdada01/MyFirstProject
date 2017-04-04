//declaring global variables
var accountApplicationCounter = 0;
var placeCounter = 0;
var now = new Date();
var nowMonth = now.getMonth() + 1;
var nowDate = now.getDate();

if(nowMonth < 10 &&  nowMonth > 0) {
	var newNowMonth = "0" + nowMonth;
} else {
	var newNowMonth = nowMonth;
}

if(nowDate < 10 && nowDate > 0) {
	var newNowDate = "0" + nowDate;
} else {
	var newNowDate = nowDate;
}

var NowDate = now.getFullYear() + "-" + newNowMonth + "-" + newNowDate;

$(document).ready(function() {
	init();

	$('#leftPanelWrapper .items').click(function(){
		if(!$(this).hasClass('active')){
			var nav = this.id;

			$('#leftPanelWrapper .items').removeClass('active');	

			if(nav == "account"){
				showAccountPage();
			}else if(nav == "application"){
				showApplicationPage();
			}
		}
	});

	$('#addAccountButton').click(function(){;
		var popupBodyContent1 = '<div class="startAndEndPeriodAccount">\ START DATE: <input type="text" name="startDateA" value="'+NowDate+'" id="startPeriodAddId" class="startPeriodAddAccount"/>\ END DATE: <input type="text" name="endDateA" value="'+NowDate+'" id="endPeriodAddId" class="endPeriodAddAccount"/>\ </div>\
								<div class="inputField">\
									<div class="inputLabel">CLIENT NAME</div>\
									<div class="inputBox">\
										<input id="clientNameInputField" type="text"></input>\
									</div>\
									<div class="inputError"></div>\
								</div>\
								<div class="inputField">\
									<div class="inputLabel">EMAIL ADDRESS</div>\
									<div class="inputBox">\
										<input id="emailInputField" type="email"></input>\
									</div>\
									<div class="inputError"></div>\
								</div>\
								<div class="inputField">\
									<div class="inputLabel">TELEPHONE</div>\
									<div class="inputBox">\
										<input id="telephoneInputField" type="text"</input>\
									</div>\
									<div class="inputError"></div>\
								</div>\
								<div class="inputField">\
									<div class="inputLabel">ACCOUNT NAME</div>\
									<div class="inputBox">\
										<input id="accountNameInputField" type="text"></input>\
									</div>\
									<div class="inputError"></div>\
								</div>\
								<div class="inputField">\
									<div class="inputLabel">ACCOUNT PASSWORD</div>\
									<div class="inputBox">\
										<input id="accountPasswordInputField" type="password"></input>\
									</div>\
									<div class="inputError"></div>\
								</div>';
		var popupBodyContent2 = '<div id="accountAppList">\
								<div id="displayAddPlaceForm"></div>\
									<div id="addAccountApplicationButton" onclick="addPlaceForm()");">\
										<i class="fa fa-plus" aria-hidden="true"></i>\
										Add Place\
									</div>\
								</div>';
		var pop = new popup({
								header : {content: 'Account Register Form'},
								nav : ['PROFILE','PLACE'],
								body : {content:[popupBodyContent1,popupBodyContent2]},
								footer : { buttons : [
												{	
													id : 'popup_savebutton',
													text : 'SAVE',
													onclick : 'addAccountToDatabase()'
												}
											]
										},
								height : '690px'
							});
		pop.show();
		reInitializedInstance();
	});
	$('#addApplicationButton').click(function(){
		var popupBodyContent1 = '<div class="inputField">\
									<div class="inputLabel">APPLICATION NAME</div>\
									<div class="inputBox">\
										<input id="appNameInputField" type="text"></input>\
									</div>\
									<div class="inputError"></div>\
								</div>\
								<div class="inputField">\
									<div class="inputLabel">APPLICATION ID</div>\
									<div class="inputBox">\
										<input id="appIDInputField" type="text"></input>\
									</div>\
									<div class="inputError"></div>\
								</div>\
								<div class="inputField">\
									<div class="inputLabel">WEBSYSTEM URL</div>\
									<div class="inputBox">\
										<input id="webURLInputField" type="text"></input>\
									</div>\
									<div class="inputError"></div>\
								</div>\
								<div class="inputField">\
									<div class="inputLabel">MANUAL URL</div>\
									<div class="inputBox">\
										<input id="manualURLInputField" type="text"></input>\
									</div>\
									<div class="inputError"></div>\
								</div>';
		var pop = new popup({
								header : {content: 'Application Register Form'},
								nav : false,
								body : {content:[popupBodyContent1]},
								footer : { buttons : [
												{	
													id : 'popup_savebutton',
													text : 'SAVE',
													onclick : 'saveNewApplication()'
												}
											]
										},
								height : '530px'
							});
		pop.show();
	});

	$('#applicationListPopup #applicationListPopupCloseButton').click(function(){
		hideApplicationListPopup();
		hidePopup();
	});
});
function init(){
	showAccountPage();
}
function showAccountPage(){
	$('#leftPanelWrapper #account').addClass('active');

	$('#accountContent').addClass('active');
	$('#applicationContent').removeClass('active');

	showValidAccounts();
}
function showApplicationPage(){
	$('#leftPanelWrapper #application').addClass('active');

	$('#accountContent').removeClass('active');
	$('#applicationContent').addClass('active');

	showApplicationsFromDatabase();
}
function removeAccountApplication(application){
	$('#'+application).remove();
}

//Richard
//Add Place Form in Add Account
function addPlaceForm(){

	$('#applicationListPopup').css('z-index', '1');
	form = $('#applicationListPopup #appList');
	makeElementUnclickable('.active');

	$('#applicationListPopup #appList').html('<div id="formLoading"><i class="fa fa-circle-o-notch" aria-hidden="true"></i></div>');
	$('#applicationListPopup #appList').html('<div id="popup_close_button"> <i class="fa fa-times" aria-hidden="true"></i></div>');
	$('#applicationListPopup #appList').html('<p id="addPlaceTitle"> Add Place</p>');
	$('#applicationListPopup #appList').append('<form method="post" class="addPlaceForm">\ <div id="addPlaceLabel">Place Name</div><div class="inputBox"><input type="text" id="PnameForm"></div>\ <div class="inputErrorP" id="errorPlaceName"></div>\ <div id="addPlaceLabel">Tel</div> <div class="inputBox"><input type="text" id="telForm"></div>\ <div class="inputErrorT"></div>\ <div id="addPlaceLabel">Address</div> <div class="inputBox"><input type="text" id="addForm"></div>\ <div class="inputErrorA"></div>\ <input type="button" id="popup_registerbuttonForm" class="buttonAddPlaceForm" value="REGISTER">\ </form>');
	
	showAddplace();

	$('#applicationListPopup #popup_registerbuttonForm').click(function(){
		verifyAddPlaceForm(function(result) {
			if(result == 'valid') {
				closeAddRegisterButton();
			}
		});
	});
}

function addAccountApplication(){
	$('#applicationListPopup #appList').html('<div id="formLoading"><i class="fa fa-circle-o-notch" aria-hidden="true"></i></div>');
	getAllApplications(function(applications){
		$('#applicationListPopup #appList').html('');
		if(applications != 'NONE'){
			$.each(JSON.parse(applications), function(index, application) {
				var appConflict = 0;
				//check if app already exist
				$('.custom-popup-form').find('.apps').each(function(index, el) {
					var appId = $(el).find('#appId').val();
					if(appId == application.id){
						appConflict++;
					}
				});

				if(appConflict > 0){//if app exist
					$('#applicationListPopup #appList').append('<div class="app disable" onclick="putApplicationToAccount(\''+application.id+'\',\''+application.name+'\')"><span>'+application.name+'</span></div>'); 
				}
				else{//if app didnt exist
					$('#applicationListPopup #appList').append('<div class="app" onclick="putApplicationToAccount(\''+application.id+'\',\''+application.name+'\')"><span>'+application.name+'</span></div>');
				}
			});
			
		}else{
			$('#applicationListPopup #appList').html('<div style="position:relative;width:100%;height:100%;"><div style="position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;text-align:center;height: 20px;font-size: 20px;color: gainsboro;">NO APPLICATIONS</div></div>');
		}
		reInitializedInstance();
	});
	showApplicationPopUp();
}


function reInitializedInstance(){

	//Richard
	$('.startPeriodAddAccount').datepicker({ 
		minDate: 0,
		dateFormat: 'yy-mm-dd' 
	});

	$('.endPeriodAddAccount').datepicker({ 
		minDate: 0,
		dateFormat: 'yy-mm-dd' 
	});

	//Richard
	//Update Place in Account List Add Place button
	$('.buttonAddPlace').click(function(e){   
			var accountID = $(this).data('account-addplaceid');
			var PnameAdd = $('#PnameUpdate').val();
			var telAdd = $('#telUpdate').val();
			var addAdd = $('#addUpdate').val();
			$.ajax ({
				type: "Post",
				url: "php/postAddPlace.php",
				data: "PnameAdd=" +PnameAdd+ "&telAdd=" +telAdd+ "&addAdd=" +addAdd+ "&accountID=" +accountID,
				success: function(result){
					// do something
				},
				error: function(result){
					// do something
				}
			});
	});

	//Richard
	//Post date value in account_start
	$('.startPeriodDisplay').datepicker({ 
		minDate: 0,
		dateFormat: 'yy-mm-dd',  
		onSelect: function(date, instance){

			var displayStart;
			var accountID = $(this).data('account-id1');
			var startPeriodElem = $(this);
			var end = $('.account .endDate ').find('.expire'+accountID).val();
			var start = $('.account').find('.startS'+accountID).val();

			$(this).hide();
			$(this).after('<div id="loading"><i class="fa fa-circle-o-notch" aria-hidden="true"></i>&nbspSAVING</div>');

			if (start >= end) {
				getAccountsFromDatabase(function(data) {
	
				accounts = JSON.parse(data);

				 	$.each(accounts, function(index, account) {

				 		if(account.Lid == accountID) {
				 			displayStart = account.Lstart;
				 			$('.account').find('.startS'+accountID).val(displayStart);
				 		}
				 	});

				});

		 		$('.startPeriod #loading').remove();
		 		startPeriodElem.effect("shake", { times:3 }, 300);
			}

			else {
			
				$.ajax ({
					type: "Post",
					url: "php/updateStartDate.php",
					data: "startDate=" +date+ "&accountID=" +accountID,
					success: function(result){
						// do something
						if(result == "Success"){
							startPeriodElem.show();
		 					$('.startPeriod #loading').remove();
						}
					},
					error: function(result){
						// do something
					}
				});
			}
			
		}
	});

	//Richard
	//Post date value in account_start
	$('.startPeriodDisplayV').datepicker({ 
		minDate: 0,
		dateFormat: 'yy-mm-dd',  
		onSelect: function(date, instance){
			
			var displayStart;
			var accountID = $(this).data('account-id1');
			var startPeriodElem = $(this);
			var start = $('.account').find('.startV'+accountID).val();
			var end = $('.account .endDateV').find('.expire'+accountID).val();
			
			$(this).hide();
			$(this).after('<div id="loading"><i class="fa fa-circle-o-notch" aria-hidden="true"></i>&nbspSAVING</div>');

			if (start >= end) {
				getAccountsFromDatabase(function(data) {
	
				accounts = JSON.parse(data);

				 	$.each(accounts, function(index, account) {

				 		if(account.Lid == accountID) {
				 			displayStart = account.Lstart;
				 			$('.account').find('.startV'+accountID).val(displayStart);
				 		}
				 	});

				});

		 		$('.startPeriodV #loading').remove();
		 		startPeriodElem.effect("shake", { times:3 }, 300);
				
			}
			else {
				$.ajax ({
					type: "Post",
					url: "php/updateStartDate.php",
					data: "startDate=" +date+ "&accountID=" +accountID,
					success: function(result){
						// do something
						if(result == "Success"){
							startPeriodElem.show();
		 					$('.startPeriodV #loading').remove();
						}
					},
					error: function(result){
						// do something
					}
				});
			}
			
		}
	});

	//Richard
	//Post date value in account_end
	$('.periodDisplay').datepicker({ 
		minDate: 0,
		dateFormat: 'yy-mm-dd',  
		onSelect: function(date, instance){
			$('#acc_'+selId+' select option:selected').removeAttr('selected');
			var accountID = $(this).data('account-id2');
			var selId = $(this).data('account-id22');
			var endPeriodElem = $(this);
			var selval = $('#acc_'+selId+' select option:selected').val();
			var end = $('.account').find('.expire'+accountID).val();
			var sel;

			$(this).hide();
			$(this).after('<div id="loading"><i class="fa fa-circle-o-notch" aria-hidden="true"></i>&nbspSAVING</div>');

			$.ajax ({
				type: "Post",
				url: "php/updateEndDate.php",
				data: "endDate=" +date+ "&accountID=" +accountID,
				success: function(result){
					if(result == "Success"){
						endPeriodElem.show();
	 					$('.endDate #loading').remove();

	 					if (end == NowDate) {		
	 						$('#acc_'+selId+' select').find('option[value="Stop"]').attr("selected",true);	
							$('#acc_'+selId+' select').hide();
							$('#acc_'+selId+' .statusWrapper').append('<div id="loading"><i class="fa fa-circle-o-notch" aria-hidden="true"></i>&nbspSAVING</div>');
	 						if(selval == 'Valid'){
								sel = 0;
							}else{
								sel = 0;
							}
							$.post( "php/changeAccountStatus.php", { accId: accountID , selectedOption: sel }).done(function( result ) {
								$('#acc_'+selId+' select').show();
								$('#acc_'+selId+' .fa-rolling').hide();
								$('#acc_'+selId+' .statusWrapper #loading').remove();
							});
							
	 					}// if (end == NowDate)

					}
				},
				error: function(result){
					// do something
				}
			});
		}
	});

	//Richard
	//Post date value in account_end
	$('.periodDisplayV').datepicker({ 
		minDate: 0,
		dateFormat: 'yy-mm-dd',  
		onSelect: function(date, instance){

			var accountID = $(this).data('account-id3');
			var selId = $(this).data('account-id3a');
			var endPeriodElem = $(this);
			var selval = $('#acc_'+selId+' select option:selected').val();
			var end = $('.account').find('.expire'+accountID).val();
			var sel;

			$(this).hide();
			$(this).after('<div id="loading"><i class="fa fa-circle-o-notch" aria-hidden="true"></i>&nbspSAVING</div>');

			$.ajax ({
				type: "Post",
				url: "php/updateEndDate.php",
				data: "endDate=" +date+ "&accountID=" +accountID,
				success: function(result){
					if(result == "Success"){
						endPeriodElem.show();
	 					$('.endDateV #loading').remove();

	 					if (end == NowDate) {		
	 						$('#acc_'+selId+' select').find('option[value="Stop"]').attr("selected",true);	
							$('#acc_'+selId+' select').hide();
							$('#acc_'+selId+' .statusWrapper').append('<div id="loading"><i class="fa fa-circle-o-notch" aria-hidden="true"></i>&nbspSAVING</div>');
	 						if(selval == 'Valid'){
								sel = 0;
							}
							$.post( "php/changeAccountStatus.php", { accId: accountID , selectedOption: sel }).done(function( result ) {
								$('#acc_'+selId+' select').show();
								$('#acc_'+selId+' .fa-rolling').hide();
								$('#acc_'+selId+' .statusWrapper #loading').remove();
								showValidAccounts();
							});
	 					}// if (end == NowDate)
					}
				},
				error: function(result){
					// do something
				}
			});
		}
	});

	$('.applicationSelect').selectmenu();
}


function makeElementUnclickable(elem){
	$(elem).addClass('unclickable');
}
function makeElementClickable(elem){
	$(elem).removeClass('unclickable');
}

//Richard
//Close Add Place in Account Register Add Place Form
function closeAddRegisterButton(){

	placeCounter ++;
	makeElementClickable('.active');

	var form = $('.custom-popup-form #accountAppList #displayAddPlaceForm');
	var Pname = $('#applicationListPopup').find('#PnameForm').val();
	var tel = $('#applicationListPopup').find('#telForm').val();
	var add = $('#applicationListPopup').find('#addForm').val();
	
	form.append('<div id="PlaceInfo' +placeCounter+ '"></div>');
	$('.custom-popup-form #PlaceInfo'+placeCounter).addClass('PlaceInfo');
	$('.custom-popup-form #PlaceInfo'+placeCounter).append('<i id="PageInfoCloseButton" class="fa fa-times" aria-hidden="true"></i>');
	$('.custom-popup-form #PlaceInfo'+placeCounter).append('<div class="placename"> <div id="labelplace"> PLACE NAME: </div><div id="nameVal">' +Pname+ '</div></div>');
	$('.custom-popup-form #PlaceInfo'+placeCounter).append('<div class="placetel"><span>Tel: </span> <div id="telVal">' +tel+ '</div></div>');
	$('.custom-popup-form #PlaceInfo'+placeCounter).append('<div class="placeAdd"><span>Address: </span> <div id="addVal">' +add+ '</div></div>');


	$('#applicationListPopup').append('<div id="formLoading"><img src="css/rolling.gif"></div>');
	$('#applicationListPopup').removeClass('active');
	$('#addPlaceBG').removeClass('addPlaceBG');
	$('#applicationListPopup').css('box-shadow', '1px 10px 50px grey');
	$('#applicationListPopup').find('#formLoading').remove();
	$('#applicationListPopup').css('z-index', '-1');


	$('.custom-popup-form #accountAppList #displayAddPlaceForm .PlaceInfo #PageInfoCloseButton').click(function(){
		$(this).parent().remove();
	});
}

//Richard
//Close Add Place in Top Page
function closeButton(){

	makeElementClickable('.active');

	$('#applicationListPopup').append('<div id="formLoading"><img src="css/rolling.gif"></div>');
	$('#applicationListPopup').removeClass('active');
	$('#applicationListPopup').find('#formLoading').remove();
	$('#addPlaceBG').removeClass('addPlaceBG');
	$('#applicationListPopup').css('box-shadow', '1px 10px 50px grey');
	$('#applicationListPopup').css('z-index', '-1');
	//document.getElementById('applicationListPopup').style.display = "none";
}

//Richard
//Hide Popup
function hidePopup(){

	makeElementClickable('.active');

	$('#applicationListPopup').removeClass('active');
	$('#addPlaceBG').removeClass('addPlaceBG');
	$('#applicationListPopup').css('box-shadow', '1px 10px 50px grey');
	$('#applicationListPopup').css('z-index', '-1');

}

//Richard
//Disable click Popup background
function showAddplaceFunction () {
	// makeElementClickable('.active');
	$('#applicationListPopup').addClass('active');
}

function hideApplicationListPopup(){

	makeElementClickable('.custom-popup-form');
	$('#applicationListPopup').removeClass('active');
	$('#applicationListPopup').css('z-index', '-1');

}

function showApplicationListPopup(){
	makeElementUnclickable('.custom-popup-form');
	$('#applicationListPopup').addClass('active');
}

function minMaxAppBodyList(application){
	var app = $('#'+application);

	if(!app.find('.pepperBodyIDList').hasClass('show')){
		app.find('.minMaxApp .fa').attr('class','fa fa-caret-up');
		app.find('.pepperBodyIDList').addClass('show');
	}
	else{
		app.find('.minMaxApp .fa').attr('class','fa fa-caret-down');
		app.find('.pepperBodyIDList').removeClass('show');
	}
}
function Clear(elem){
	elem.html('');
}
function showConfirmDialog(){
	$('#pop_up_Container').addClass('active');
	setTimeout(function(){
		$('#confirmation_popup').addClass('active');
	},100);
	// $('#confirmation_popup').addClass('active');
}
function hideConfirmDialog(){
	$('#confirmation_popup').removeClass('active');
	setTimeout(function(){
		$('#pop_up_Container').removeClass('active');
	},300);
}
function showAlertDialog(){
	$('#pop_up_Container').addClass('active');
	setTimeout(function(){
		$('#alertDialog_popup').addClass('active');
	},100);
}
function hideAlertDialog(){
	$('#alertDialog_popup').removeClass('active');
}

//Richard
//get all information in the account_tb
function getAccountsFromDatabase(callback) {
	$.get( "php/LgetAccounts.php", function( data, textStatus, xhr ) {
		callback(data);
	});
}
