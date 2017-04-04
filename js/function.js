
var filterValid = 0;
var placeCounterTemp = 0;
var placeId = "";
var parent;
var placeIdX = "";
var PlaceIDarrayX = [];
var PlaceIDarray = [];


//Junry
//show all accounts from the database
function showAccounts() {

	//declaration of variables
	var accounts, accountCounter, accountDiv, accountList;
	//end of declaration

	//initializing variables
	accountCounter = 0;
	accountList = $('#accountList');

	updateExpiredAccounts();

	// accountList.html('<div style="position:relative;width:100%;height:100%"><div id="formLoading" style="color:gainsboro;font-size:50px;"><i class="fa fa-circle-o-notch" aria-hidden="true" style="width:50px;height:50px;top:-400px"></i></div></div>');
	$('#accountContent').append('<div id="formLoading"><img src="css/rolling.gif"></div>');

	getAccountsFromDatabase(function(data) {
		
		Clear(accountList);
		$('#accountContent').find('#formLoading').remove();
		
		accounts = JSON.parse(data);

		accountsLength = accounts.length;

		if(accounts.length > 0) {
		 	$.each(accounts, function(index, account) {
		 		accountCounter++;
		 		accountDiv = '<div id="acc_'+accountCounter+'" class="account">\
		 								<input type="hidden" id="regId" value="'+account.Lid+'"></input>\
										<div class="accountName">'+account.Lclient+'</div>\
										<div class="startPeriod">\ <input type="text" data-account-id1="'+account.Lid+'" name="startDate" value="'+account.Lstart+'" class="startPeriodDisplay startS'+account.Lid+' focus" readonly/></div>\
										<div class="endDate">\ <input type="text" data-account-id22="'+accountCounter+'" data-account-id2="'+account.Lid+'" name="endDate" value="'+account.Lend+'" class="periodDisplay expire'+account.Lid+' focus" readonly/></div>\
										<div class="addplaceButtonWrapper">\
											<i class="fa fa-plus" aria-hidden="true" onclick="addPlace(\''+account.Lid+'\')"></i>\
										</div>\
										<div class="viewButtonWrapper">\
											<i class="fa fa-eye" aria-hidden="true" onclick="viewAccount(\''+account.Lid+'\')"></i>\
										</div>\
										<div class="editButtonWrapper">\
											<i class="fa fa-pencil" aria-hidden="true" onclick="editAccount(\''+account.Lid+'\')"></i>\
										</div>\
										<div class="statusWrapper" id="status'+account.Lid+'">\
											<select onchange="changeAccountStatus(\'acc_'+accountCounter+'\')">\
												<option value="Valid">Valid</option>\
												<option value="Stop">Stop</option>\
											</select>\
										</div>\
									</div>';

				accountList.append(accountDiv);
				//select option
				$('#acc_'+accountCounter+' select option:selected').removeAttr('selected');

				if(account.Lvalid == 0) {
					$('#acc_'+accountCounter+' select').find('option[value="Stop"]').attr("selected",true);
				} 
				else if(account.Lvalid == 1) {
					$('#acc_'+accountCounter+' select').find('option[value="Valid"]').attr("selected",true);
				}		
		 	});
		} else {
			accountList.html('EMPTY');
		}
		reInitializedInstance();
		
	});

}

//Richard
//Add Place Button in Top Page
function addPlace(accountId){
	
	$('#applicationListPopup').css('z-index', '1');
	$('#addPlaceBG').addClass('addPlaceBG');
	makeElementUnclickable('.active');

	$('#applicationListPopup').css('box-shadow', '0 0 0');

	$('#applicationListPopup #appList').html('<div id="formLoading"><i class="fa fa-circle-o-notch" aria-hidden="true"></i></div>');
	$('#applicationListPopup #appList').html('<div id="popup_close_button"> <i class="fa fa-times" aria-hidden="true"></i></div>');
	$('#applicationListPopup #appList').html('<p id="addPlaceTitle"> Add Place</p>');
	$('#applicationListPopup #appList').append('<form method="post" class="addPlaceForm">\ <div id="addPlaceLabel">Place Name</div><div class="inputBox"><input type="text" id="PnameUpdate"></div>\ <div class="inputErrorTp"></div>\ <div id="addPlaceLabel">TEL</div> <div class="inputBox"><input type="text" id="telUpdate"></div>\ <div class="inputErrorTt"></div>\ <div id="addPlaceLabel">Address</div> <div class="inputBox"><input type="text" id="addUpdate"></div>\ <div class="inputErrorTa"></div>\ <input data-account-addplaceid="' + accountId + '" type="button" id="popup_registerbutton" class="buttonAddPlace" value="REGISTER">\ </form>');

	showAddplace();

	$('#applicationListPopup #popup_registerbutton').click(function(){

		var accountID = $(this).data('account-addplaceid');

		verifyAddPlaceTopPage(function(result) {
			if(result == 'valid') {
				
				var PnameAdd = $('#PnameUpdate').val();
				var telAdd = $('#telUpdate').val();
				var addAdd = $('#addUpdate').val();

				$.ajax ({
					type: "Post",
					url: "php/postAddPlace.php",
					data: "PnameAdd=" +PnameAdd+ "&telAdd=" +telAdd+ "&addAdd=" +addAdd+ "&accountID=" +accountID,

					success: function(result){
						alertDialog('<i class="fa fa-check" aria-hidden="true"></i>','Success',function(){
						form.find('.popup_close_button .fa').click(); //close the popup
						});
						// do something
					},
					error: function(result){
						// do something
					}
				});

				closeButton();
			}
		});
	});
}

// Richard 
// Radio Button in "Don't show stop accounts" click and unclick function
$("input:checked").on("click", function(e) {

  var inp = $(this);
  if (inp.is(".theone")) {
    inp.prop("checked", true).removeClass("theone");
    filterValid = 1;
    updateExpiredAccounts();
    showValidAccounts();

  } else {
    $("input:radio[name='" + inp.prop("name") + "'].theone").removeClass("theone");
    inp.prop("checked", false).removeClass("theone");
    inp.addClass("theone");
    filterValid = 0;
    updateExpiredAccounts();
    showAccounts();

  }
});


// end of Radio button function

//Richard
//Show Valid Status only and Hide Stop Status
function showValidAccounts() {

	//declaration of variables
	var accounts, accountCounter, accountDiv, accountList;
	//end of declaration

	//initializing variables
	accountCounter = 0;
	accountList = $('#accountList');

	updateExpiredAccounts();

	// accountList.html('<div style="position:relative;width:100%;height:100%"><div id="formLoading" style="color:gainsboro;font-size:50px;"><i class="fa fa-circle-o-notch" aria-hidden="true" style="width:50px;height:50px;top:-400px"></i></div></div>');
	$('#accountContent').append('<div id="formLoading"><img src="css/rolling.gif"></div>');
	getAccountsFromDatabase(function(data) {
		//updateExpiredAccounts();
		Clear(accountList);
		$('#accountContent').find('#formLoading').remove();
		
		accounts = JSON.parse(data);
		var LidCounter = 0;
		var temp = 0;
		if(accounts.length > 0) {
		 	$.each(accounts, function(index, account) {
		 		if (account.Lvalid == 0){
		 			LidCounter ++
		 			temp ++;
		 		}
		 		else{
			 		accountCounter++;
			 		accountDiv = '<div id="acc_'+accountCounter+'" class="account">\
			 								<input type="hidden" id="regId" value="'+account.Lid+'"></input>\
											<div class="accountName">'+account.Lclient+'</div>\
											<div class="startPeriodV">\ <input type="text" data-account-id1="'+account.Lid+'" name="startDate" value="'+account.Lstart+'" class="startPeriodDisplayV startV'+account.Lid+' focus" readonly/></div>\
											<div class="endDateV">\ <input type="text" data-account-id3a="'+accountCounter+'" data-account-id3="'+account.Lid+'" name="endDate" value="'+account.Lend+'" class="periodDisplayV expire'+account.Lid+' focus" readonly/></div>\
											<div class="addplaceButtonWrapper">\
												<i class="fa fa-plus" aria-hidden="true" onclick="addPlace(\''+account.Lid+'\')"></i>\
											</div>\
											<div class="viewButtonWrapper">\
												<i class="fa fa-eye" aria-hidden="true" onclick="viewAccount(\''+account.Lid+'\')"></i>\
											</div>\
											<div class="editButtonWrapper">\
												<i class="fa fa-pencil" aria-hidden="true" onclick="editAccount(\''+account.Lid+'\')"></i>\
											</div>\
											<div class="statusWrapper" id="status'+account.Lid+'">\
												<select onchange="changeAccountStatusHide(\'acc_'+accountCounter+'\')">\
													<option value="Valid">Valid</option>\
													<option value="Stop">Stop</option>\
												</select>\
											</div>\
										</div>';

					accountList.append(accountDiv);
					//select option
					$('#acc_'+accountCounter+' select option:selected').removeAttr('selected');

					if(account.Lvalid == 0) {
						$('#acc_'+accountCounter+' select').find('option[value="Stop"]').attr("selected",true);
					} 
					else if(account.Lvalid == 1) {
						$('#acc_'+accountCounter+' select').find('option[value="Valid"]').attr("selected",true);
					}
					LidCounter++;			
				}

		 	});

		 	accountsLength = accountCounter;

		 	if(temp == LidCounter){
					accountList.html('EMPTY');
				}

		} else {

			accountList.html('EMPTY');
		}

		reInitializedInstance();
		
	});
}

function showApplicationsFromDatabase() {
	
	//declaration of variables
	var appsList, html;
	//end of declaration

	//initializing variables
	appsList = $('#applicationContent .apps_list');

	$('#applicationContent').append('<div id="formLoading"><img src="css/rolling.gif"></div>');
	getAllApplications(function(apps) {
		Clear(appsList); //clear appsList
		$('#applicationContent').find('#formLoading').remove();
		$.each(JSON.parse(apps), function(index, app) {
			html = '<div id="app_'+app.id+'" class="app">\
								'+app.name+'\
								<div class="app_button_wrapper">\
									<div class="remove_app_button" onclick="deleteApp(\''+app.id+'\')"><i class="fa fa-trash" aria-hidden="true"></i></div>\
									<div class="edit_app_button" onclick="editApp(\''+app.id+'\')"><i class="fa fa-pencil" aria-hidden="true"></i></div>\
								</div>\
							</div>';
			appsList.append(html);
		});
	});
}

//Junry
//Change Account status
function changeAccountStatus(account) {

	//declaration of variables
	var sel, acc_regId;
	//end of declaration

	//initializing variables
	sel = $('#'+account+' select option:selected').val();
	acc_regId = $('#'+account+' #regId').val();

	$('#'+account+' select').hide();
	$('#'+account+' .statusWrapper').append('<div id="loading"><i class="fa fa-circle-o-notch" aria-hidden="true"></i>&nbspSAVING</div>');

	if(sel == 'Valid'){
		sel = 1;
		$('#'+account+' select').find('option[value="Stop"]').attr("selected",false);
		$('#'+account+' select').find('option[value="Valid"]').attr("selected",true);
	}else if(sel == 'Stop'){
		sel = 0;
		$('#'+account+' select').find('option[value="Valid"]').attr("selected",false);
		$('#'+account+' select').find('option[value="Stop"]').attr("selected",true);
	}
	$.post( "php/changeAccountStatus.php", { accId: acc_regId , selectedOption: sel }).done(function( result ) {
	 	$('#'+account+' select').show();
	 	$('#'+account+' .fa-rolling').hide();
	 	$('#'+account+' .statusWrapper #loading').remove();
	});
}

//Richard
//Change account validity and hide it if the validity is equeals to zero or "STOP"
function changeAccountStatusHide(account) {
	
	//declaration of variables
	var sel, acc_regId;
	//end of declaration

	//initializing variables
	sel = $('#'+account+' select option:selected').val();
	acc_regId = $('#'+account+' #regId').val();

	$('#'+account+' select').hide();
	$('#'+account+' .statusWrapper').append('<div id="loading"><i class="fa fa-circle-o-notch" aria-hidden="true"></i>&nbspSAVING</div>');

	if(sel == 'Valid'){
		sel = 1;
	}else if(sel == 'Stop'){
		sel = 0;
	}
	$.post( "php/changeAccountStatus.php", { accId: acc_regId , selectedOption: sel }).done(function( result ) {
	 	showValidAccounts();
	});
}

function editAccount(accId) {

	//declaration of variables
	var popupBodyContent1, popupBodyContent2, saveButton, pop, form, accountData, accountInfo, accountApps, insert, places;
	//end of declaration
	
	//initializing variables
	popupBodyContent1 = '<div class="inputField">\
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
										<input id="accountPasswordInputField" type="text"></input>\
									</div>\
									<div class="inputError"></div>\
								</div>';
	popupBodyContent2 = '<div id="accountAppList">\
							<div id="displayAddPlaceForm"> <input type="hidden" id="displayAddPlaceFormChild"></input>\</div>\
									<div id="addAccountApplicationButton" onclick="EditaddPlace()");">\
										<i class="fa fa-plus" aria-hidden="true"></i>\
										Add Place\
									</div>\
							</div>\
						</div>';
	pop = new popup({
						header : {content: 'Edit Account'},
						nav : ['PROFILE','PLACE'],
						body : {content:[popupBodyContent1,popupBodyContent2]},
						footer : { buttons : [
									{	
										id : 'popup_savebutton',
										text : 'SAVE CHANGES',
										onclick : 'editAccountInDatabase(\''+accId+'\')'
									}
								]
							},
						height : '690px'
					});
	form = $('.custom-popup-form');
	//end of initializing

	pop.show();
	pop.loading(true);

	var put = $('.custom-popup-form #accountAppList #displayAddPlaceForm');
	

	getEditAccount(accId,function(data) {

		accountData = JSON.parse(data);
		accountInfo = accountData['info'];
		places = accountData['place'];

		form.find('#clientNameInputField').val(accountInfo['Lclient']);
		form.find('#emailInputField').val(accountInfo['Lmail']);
		form.find('#telephoneInputField').val(accountInfo['Ltel']);
		form.find('#accountNameInputField').val(accountInfo['Lname']);
		form.find('#accountPasswordInputField').val(accountInfo['Lpass']);

		// form.find('.apps').remove();	

		var placeCounter = 0;
		PlaceIDarrayX = [];
		//placeCounter = places.length;
		//$('.custom-popup-form #accountAppList').html('<div class="placename"> <div id="labelplace"> PLACE NAME: </div><div id="nameVal">Richard</div></div>');

		$.each(places, function(index, places_name) {
			placeCounter ++;


			if (places_name.Pvalid == 1) {

				insert = '<div id="PlaceInfo' +placeCounter+ '"> \  <i id="PageInfoCloseButton" class="fa fa-times" aria-hidden="true"></i> \ <input type="hidden" id="place_id" value="'+places_name.Pid+'"></input>\ <div class="placename"> <div id="labelplace"> PLACE NAME: </div><div id="nameVal">' +places_name.Pname+ '</div></div> \ <div class="placetel"><span>Tel: </span> <div id="telVal">' +places_name.Ptel+ '</div></div> \ <div class="placeAdd"><span>Address: </span> <div id="addVal">' +places_name.Padd+ '</div></div></div>';

				$(insert).insertBefore(form.find('#displayAddPlaceFormChild'));
			}
			$('.custom-popup-form #PlaceInfo'+placeCounter).addClass('PlaceInfo');	
			
		});	

		$('.custom-popup-form #accountAppList #displayAddPlaceForm .PlaceInfo #PageInfoCloseButton').click(function(){
				//console.log($(this).parent().attr('id'));


				parent = $(this).parent().attr('id');

				placeIdX = $('.custom-popup-form #'+parent).find('#place_id').val();

				PlaceIDarrayX.push({
								placeValue_ID: placeIdX
							 });

				$(this).parent().remove();
		});

		placeCounterTemp = placeCounter;
		
		pop.loading(false);	
		reInitializedInstance();
	});
}

//Richard
//Add Place Form in Edit Account
function EditaddPlace(){


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
				EditcloseAddRegisterButton();
			}
		});
	});
}


//Richard
//Close Add Place in Account Register Add Place Form
function EditcloseAddRegisterButton(){

	placeCounterTemp ++;
	makeElementClickable('.active');

	var form = $('.custom-popup-form #accountAppList #displayAddPlaceForm');
	var Pname = $('#applicationListPopup').find('#PnameForm').val();
	var tel = $('#applicationListPopup').find('#telForm').val();
	var add = $('#applicationListPopup').find('#addForm').val();
	
	form.append('<div id="PlaceInfoEdit' +placeCounterTemp+ '"></div>');
	$('.custom-popup-form #PlaceInfoEdit'+placeCounterTemp).addClass('PlaceInfoEdit');
	$('.custom-popup-form #PlaceInfoEdit'+placeCounterTemp).append('<i id="PageInfoCloseButton" class="fa fa-times" aria-hidden="true"></i>');
	$('.custom-popup-form #PlaceInfoEdit'+placeCounterTemp).append('<div class="placename"> <div id="labelplace"> PLACE NAME: </div><div id="nameVal">' +Pname+ '</div></div>');
	$('.custom-popup-form #PlaceInfoEdit'+placeCounterTemp).append('<div class="placetel"><span>Tel: </span> <div id="telVal">' +tel+ '</div></div>');
	$('.custom-popup-form #PlaceInfoEdit'+placeCounterTemp).append('<div class="placeAdd"><span>Address: </span> <div id="addVal">' +add+ '</div></div>');


	$('#applicationListPopup').append('<div id="formLoading"><img src="css/rolling.gif"></div>');
	$('#applicationListPopup').removeClass('active');
	$('#addPlaceBG').removeClass('addPlaceBG');
	$('#applicationListPopup').css('box-shadow', '1px 10px 50px grey');
	$('#applicationListPopup').find('#formLoading').remove();
	$('#applicationListPopup').css('z-index', '-1');


	$('.custom-popup-form #accountAppList #displayAddPlaceForm .PlaceInfoEdit #PageInfoCloseButton').click(function(){
		//console.log($(this).parent().attr('id'));
		$(this).parent().remove();
		// $('#displayAddPlaceForm').find('#PlaceInfo' +placeCounter).remove();
	});

}

function editAccountInDatabase(accId) {

	//declaration of variables
	var form, data, response, closePlaces;
	//end of declaration

	closePlaces = PlaceIDarrayX;

	//initializing variables 
	form = $('.custom-popup-form');

	makeElementUnclickable('.custom-popup-form');


	verifyAccountFormFields(function(result) {
		if(result == 'valid'){
			form.find('#popup_savebutton').html('<div id="loading"><i class="fa fa-circle-o-notch" aria-hidden="true"></i>&nbspSAVING</div>');

			data = getAccountDataFromForm();

			addAccountFunction(data[0],'edit',accId,function(result) {

				form.find('#popup_savebutton').html('SAVE CHANGES');
				form.find('.inputField input').removeClass('error');
				
				Clear(form.find('.inputError'));

				if(result == 'Success') {
					
					if (filterValid == 0){
						showAccounts();
						alertDialog('<i class="fa fa-check" aria-hidden="true"></i>','Success',function(){
						makeElementClickable('.custom-popup-form');
		
						form.find('.popup_close_button .fa').click(); //close the popup
						});
					}
					else {
						showValidAccounts();
						alertDialog('<i class="fa fa-check" aria-hidden="true"></i>','Success',function(){
						makeElementClickable('.custom-popup-form');
						form.find('.popup_close_button .fa').click(); //close the popup
						}); 
					}
				} else {

					response = JSON.parse(result);

					try{
						if(response['conflicts']['clientNameNoOfConflicts'] > 0 ) throw "Client Name is already taken";
					}
					catch(err){
						form.find('#clientNameInputField').addClass('error');
						form.find('#clientNameInputField').parents('.inputField').find('.inputError').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
					}

					try{
						if(response['conflicts']['emailNoOfConflicts'] > 0 ) throw "Email is already taken";
					}
					catch(err){
						form.find('#emailInputField').addClass('error');
						form.find('#emailInputField').parents('.inputField').find('.inputError').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
					}

					try{
						if(response['conflicts']['accountNameNoOfConflicts'] > 0 ) throw "Account Name is already taken";
					}
					catch(err){
						form.find('#accountNameInputField').addClass('error');
						form.find('#accountNameInputField').parents('.inputField').find('.inputError').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
					}

					alertDialog('<i class="fa fa-exclamation" aria-hidden="true"></i>','Fail',function() {
						makeElementClickable('.custom-popup-form');
					});
				}
			});


		} else {
			alertDialog('<i class="fa fa-exclamation" aria-hidden="true"></i>','Error',function() {
				makeElementClickable('.custom-popup-form');
			});
		}
	});
	closePlacesFunction(closePlaces,function(result){;
	});
}

function addAccountToDatabase() {

	//declaration of variables
	var form, data, response; 

	//initializing variables
	form = $('.custom-popup-form');

	makeElementUnclickable('.custom-popup-form');
	
	verifyAccountFormFields(function(result) {
		if(result == 'valid') {
			
			form.find('#popup_savebutton').html('<div id="loading"><i class="fa fa-circle-o-notch" aria-hidden="true"></i>&nbspSAVING</div>');
			data = getAccountDataFromForm(); 
			
			addAccountFunction(data[0],'new','0',function(result) {


				form.find('#popup_savebutton').html('SAVE');
				form.find('.inputField input').removeClass('error');
				
				Clear(form.find('.inputError'));

				if(result == 'Success') {
					
					if (filterValid == 0){
						showAccounts();
						alertDialog('<i class="fa fa-check" aria-hidden="true"></i>','Success',function(){
						makeElementClickable('.custom-popup-form');
		
						form.find('.popup_close_button .fa').click(); //close the popup
						});
					}
					else {
						showValidAccounts();
						alertDialog('<i class="fa fa-check" aria-hidden="true"></i>','Success',function(){
						makeElementClickable('.custom-popup-form');
						form.find('.popup_close_button .fa').click(); //close the popup
						}); 
					}
					
				} else {
					response = JSON.parse(result);

					try {
						if(response['conflicts']['clientNameNoOfConflicts'] > 0 ) throw "Client Name is already taken";
					} catch(err) {
						form.find('#clientNameInputField').addClass('error');
						form.find('#clientNameInputField').parents('.inputField').find('.inputError').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
					}

					try {
						if(response['conflicts']['emailNoOfConflicts'] > 0 ) throw "Email is already taken";
					} catch(err) {
						form.find('#emailInputField').addClass('error');
						form.find('#emailInputField').parents('.inputField').find('.inputError').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
					}

					try {
						if(response['conflicts']['accountNameNoOfConflicts'] > 0 ) throw "Account Name is already taken";
					} catch(err) {
						form.find('#accountNameInputField').addClass('error');
						form.find('#accountNameInputField').parents('.inputField').find('.inputError').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
					}

					alertDialog('<i class="fa fa-exclamation" aria-hidden="true"></i>','Fail',function() {
						makeElementClickable('.custom-popup-form');
					});
				}	
			});
		} else { 
			alertDialog('<i class="fa fa-exclamation" aria-hidden="true"></i>','Error',function() {
				makeElementClickable('.custom-popup-form');
			});
		}
	});
}


function saveNewAccountToDatabase() {
	
	//declaration of variables
	var form, data, response; 

	//initializing variables
	form = $('.custom-popup-form');

	makeElementUnclickable('.custom-popup-form');
	
	verifyAccountFormFields(function(result) {
		if(result == 'valid') {
			
			form.find('#popup_savebutton').html('<div id="loading"><i class="fa fa-circle-o-notch" aria-hidden="true"></i>&nbspSAVING</div>');
			data = getAccountDataFromForm(); 

			saveAccount(data[0],'new','0',function(result) {

				form.find('#popup_savebutton').html('SAVE');
				form.find('.inputField input').removeClass('error');
				
				Clear(form.find('.inputError'));

				if(result == 'Success') {
					showAccounts();
					alertDialog('<i class="fa fa-check" aria-hidden="true"></i>','Success',function(){
						makeElementClickable('.custom-popup-form');
		
						form.find('.popup_close_button .fa').click(); //close the popup
					});
				} else {
					response = JSON.parse(result);

					try {
						if(response['conflicts']['clientNameNoOfConflicts'] > 0 ) throw "Client Name is already taken";
					} catch(err) {
						form.find('#clientNameInputField').addClass('error');
						form.find('#clientNameInputField').parents('.inputField').find('.inputError').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
					}

					try {
						if(response['conflicts']['emailNoOfConflicts'] > 0 ) throw "Email is already taken";
					} catch(err) {
						form.find('#emailInputField').addClass('error');
						form.find('#emailInputField').parents('.inputField').find('.inputError').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
					}

					try {
						if(response['conflicts']['accountNameNoOfConflicts'] > 0 ) throw "Account Name is already taken";
					} catch(err) {
						form.find('#accountNameInputField').addClass('error');
						form.find('#accountNameInputField').parents('.inputField').find('.inputError').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
					}

					alertDialog('<i class="fa fa-exclamation" aria-hidden="true"></i>','Fail',function() {
						makeElementClickable('.custom-popup-form');
					});
				}	
			});
		} else { 
			alertDialog('<i class="fa fa-exclamation" aria-hidden="true"></i>','Error',function() {
				makeElementClickable('.custom-popup-form');
			});
		}
	});
}

function verifyApplicationFormFields(callback){
	//declaration of variables
	var invalidity, form, applicationName, applicationWebURL, applicationManualURL;

	//initializing variables
	invalidity = 0;
	form = $('.custom-popup-form');
	applicationName = form.find('#appNameInputField').val();
	applicationID = form.find('#appIDInputField').val();
	applicationWebURL = form.find('#webURLInputField').val();
	applicationManualURL = form.find('#manualURLInputField').val();
	//end of intializing

	form.find('.inputField input').removeClass('error');
	Clear(form.find('.inputError'));

	try {
		if(applicationName == "") throw "Application Name is Empty";
	} catch(err) {
		form.find('#appNameInputField').addClass('error');
		form.find('#appNameInputField').parents('.inputField').find('.inputError').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
		invalidity++;
	}

	try {
		if(applicationID == "") throw "Application ID is Empty";
	} catch(err) {
		form.find('#appIDInputField').addClass('error');
		form.find('#appIDInputField').parents('.inputField').find('.inputError').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
		invalidity++;
	}

	try {
		if(applicationWebURL == "") throw "WebSystem URL is Empty";
		if(!isValidURl(applicationWebURL)) throw "Websystem URL is invalid";
	} catch(err) {
		form.find('#webURLInputField').addClass('error');
		form.find('#webURLInputField').parents('.inputField').find('.inputError').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
		invalidity++;
	}

	try {
		if(applicationManualURL == "") throw "Manual URL is Empty";
		if(!isValidURl(applicationManualURL)) throw "Manual URL is invalid";
	} catch(err) {
		form.find('#manualURLInputField').addClass('error');
		form.find('#manualURLInputField').parents('.inputField').find('.inputError').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
		invalidity++;
	}

	if(invalidity > 0) {
		callback('invalid');
	} else {
		callback('valid');
	}

}

function verifyAddPlaceTopPage (callback) {
	var form, addPlaceName, tel, address, invalid = 0;

	form = $('#applicationListPopup #appList');
	addPlaceName = form.find('#PnameUpdate').val();
	tel = form.find('#telUpdate').val();
	address = form.find('#addUpdate').val();

	form.find('.addPlaceForm input').removeClass('error');
	Clear(form.find('.inputErrorTp'));
	Clear(form.find('.inputErrorTt'));
	Clear(form.find('.inputErrorTa'));

	try {
		if(addPlaceName == "") throw "Place Name is Empty";
	} catch(err) {
		form.find('#PnameUpdate').addClass('error');
		form.find('#PnameUpdate').parents('.addPlaceForm').find('.inputErrorTp').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
		invalid++;
	}

	try {
		if(tel == "") throw "Telephone is Empty";
		if(tel != "" && !isValidPhoneNumber(tel)) throw "Telephone is Invalid";
	} catch(err) {
		form.find('#telUpdate').addClass('error');
		form.find('#telUpdate').parents('.addPlaceForm').find('.inputErrorTt').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
		invalid++;
	}

	try {
		if(address == "") throw "Address is Empty";
	} catch(err) {
		form.find('#addUpdate').addClass('error');
		form.find('#addUpdate').parents('.addPlaceForm').find('.inputErrorTa').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
		invalid++;
	}

	if (invalid > 0) {
		callback('invalid');
	}
	else {
		callback('valid');
	}

}


function verifyAddPlaceForm (callback) {
	var form, addPlaceName, tel, address, invalid = 0;

	form = $('#applicationListPopup #appList');
	addPlaceName = form.find('#PnameForm').val();
	tel = form.find('#telForm').val();
	address = form.find('#addForm').val();

	form.find('.addPlaceForm input').removeClass('error');
	Clear(form.find('.inputErrorP'));
	Clear(form.find('.inputErrorT'));
	Clear(form.find('.inputErrorA'));

	try {
		if(addPlaceName == "") throw "Place Name is Empty";
	} catch(err) {
		form.find('#PnameForm').addClass('error');
		form.find('#PnameForm').parents('.addPlaceForm').find('.inputErrorP').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
		invalid++;
	}

	try {
		if(tel == "") throw "Telephone is Empty";
		if(tel != "" && !isValidPhoneNumber(tel)) throw "Telephone is Invalid";
	} catch(err) {
		form.find('#telForm').addClass('error');
		form.find('#telForm').parents('.addPlaceForm').find('.inputErrorT').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
		invalid++;
	}

	try {
		if(address == "") throw "Address is Empty";
	} catch(err) {
		form.find('#addForm').addClass('error');
		form.find('#addForm').parents('.addPlaceForm').find('.inputErrorA').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
		invalid++;
	}

	if (invalid > 0) {
		callback('invalid');
	}
	else {
		callback('valid');
	}

}


function verifyAccountFormFields(callback){
	//declaration of variables
	var invalidity, form, clientName, email, tel, accountName, accountPass, start_date, end_date;

	var now = new Date();
	var nowMonth = now.getMonth() + 1;
	var nowDate = now.getDate();
	var capDate = "3000-01-01"

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

	var end = $('.account').find('.endDate .expire1').val();
	
	//initializing variables
	invalidity = 0;
	form = $('.custom-popup-form');
	clientName = form.find('#clientNameInputField').val();
	email = form.find('#emailInputField').val();
	tel = form.find('#telephoneInputField').val();
	accountName = form.find('#accountNameInputField').val();
	accountPass = form.find('#accountPasswordInputField').val();
	start_date = form.find('#startPeriodAddId').val();
	end_date = form.find('#endPeriodAddId').val();

	//end of intializing


	form.find('.inputField input').removeClass('error');
	Clear(form.find('.inputError'));

	try {
		if(clientName == "") throw "Client Name is Empty";
	} catch(err) {
		form.find('#clientNameInputField').addClass('error');
		form.find('#clientNameInputField').parents('.inputField').find('.inputError').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
		invalidity++;
	}

	try {
		if(email == "") throw "Email is Empty";
		if(email != "" && !isValidEmailAddress(email)) throw "Email is Invalid";
	} catch(err) {
		form.find('#emailInputField').addClass('error');
		form.find('#emailInputField').parents('.inputField').find('.inputError').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
		invalidity++;
	}

	try {
		if(tel == "") throw "Telephone is Empty";
		if(tel != "" && !isValidPhoneNumber(tel)) throw "Telephone is Invalid";
	} catch(err) {
		form.find('#telephoneInputField').addClass('error');
		form.find('#telephoneInputField').parents('.inputField').find('.inputError').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
		invalidity++;
	}

	try {
		if(accountName == "") throw "Account Name is Empty";
	} catch(err) {
		form.find('#accountNameInputField').addClass('error');
		form.find('#accountNameInputField').parents('.inputField').find('.inputError').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
		invalidity++;
	}

	try {
		if(accountPass == "") throw "Account Password is Empty";
		if(accountPass.length < 8) throw "Password is too short. Please put atleast 8 characters";
	} catch(err) {
		form.find('#accountPasswordInputField').addClass('error');
		form.find('#accountPasswordInputField').parents('.inputField').find('.inputError').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
		invalidity++; 
	}

	$('.custom-popup-form').find('.apps input').each(function(index, el) {
		if($(el).val() == "0000-00-00" || $(el).val() == "0") {
			invalidity++;
			$(el).addClass('error');
		} else {
			$(el).removeClass('error');
		}
	});

	//Richard
	//If Start Date and End Date are Valid or Not
	var startDateform = form.find('.startAndEndPeriodAccount #startPeriodAddId').val();
	var endDateform = form.find('.startAndEndPeriodAccount #endPeriodAddId').val();


	if (startDateform == "" || startDateform == "0" || startDateform == "0000-00-00" || (startDateform < 999999999999999 && startDateform > -9999999999999)) {
		invalidity++;
		form.find('.startAndEndPeriodAccount #startPeriodAddId').addClass('error');
	} else {
		form.find('.startAndEndPeriodAccount #startPeriodAddId').removeClass('error');
	}

	if (endDateform == "" || endDateform == "0" || endDateform == "0000-00-00" || (endDateform < 999999999999999 && endDateform > -999999999999999) ) {
		invalidity++;
		form.find('.startAndEndPeriodAccount #endPeriodAddId').addClass('error');
	} else {
		form.find('.startAndEndPeriodAccount #endPeriodAddId').removeClass('error');
	}

	if (startDateform < NowDate || startDateform >= capDate) {
		invalidity++;
		form.find('.startAndEndPeriodAccount #startPeriodAddId').addClass('error');
	} else {
		form.find('.startAndEndPeriodAccount #startPeriodAddId').removeClass('error');
	}

	if (endDateform <= NowDate || endDateform >= capDate) {
		invalidity++;
		form.find('.startAndEndPeriodAccount #endPeriodAddId').addClass('error');
	} else {
		form.find('.startAndEndPeriodAccount #endPeriodAddId').removeClass('error');
	}

	if (startDateform >= endDateform) {
		invalidity++;
		form.find('.startAndEndPeriodAccount #startPeriodAddId').addClass('error');
	}
	else {
		form.find('.startAndEndPeriodAccount #startPeriodAddId').removeClass('error');
	}


	


	if(invalidity > 0) {
		callback('invalid');
	} else {
		callback('valid');
	}
}

function isValidEmailAddress(emailAddress) {
	var pattern;
    
    pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    
    return pattern.test(emailAddress);
}
function isValidPhoneNumber(number) {
	var pattern;
	
	//pattern = new RegExp(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/);

	//pattern = new RegExp(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})|\(?([0-9]{2})\)?([ .-]?)([0-9]{2})\2([0-9]{4})/);

	pattern = new RegExp(/(\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})|\(?([0-9]{2})\)?([ .-]?)([0-9]{2})\2([0-9]{4})|\(?([0-9]{3})\)?([ .-]?)([0-9]{5}))/);


	return pattern.test(number);
}
function isValidURl(string){
	var pattern;
	
	pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

    return pattern.test(string);
}
function showApplicationPopUp() {
	showApplicationListPopup();
}
function showAddplace(){
	showAddplaceFunction();
}
function putApplicationToAccount(appId,appName) {
	//declaration of variables
	var activeForm, html;
	
	//initializing variables
	activeForm = $('.custom-popup-form');
	
	accountApplicationCounter++;
	
	html = '<div id="acc_app_'+accountApplicationCounter+'" class="apps new">\
							<input type="hidden" id="accAppId"></input>\
							<input type="hidden" id="appId" value="'+appId+'"></input>\
							<div class="appInformation">\
								<div class="appName" onclick="changeApplication(\'acc_app_'+accountApplicationCounter+'\')">'+appName+'</div>\
								<div class="appStartDate">\
									Start Date: <input type="text" value="0000-00-00"></input>\
								</div>\
								<div class="appLimit">\
									Limit Date: <input type="text" value="0000-00-00"></input>\
								</div>\
								<div class="pepperMax">\
									Pepper Maximum: <input type="number" value="0" min="0"></input>\
								</div>\
							</div>\
							<div class="appRemoveButton"><i class="fa fa-times" aria-hidden="true" onclick="removeAccountApplication(\'acc_app_'+accountApplicationCounter+'\')"></i></div>\
						</div>';
	$(html).insertBefore(activeForm.find('#addAccountApplicationButton'));
	reInitializedInstance();
	hideApplicationListPopup();
}
function changeApplication(accAppId) {
	//decleration of variables
	var appConflict, appId, appList;

	//initializing variables
	appList = $('#applicationListPopup #appList');

	Clear(appList);

	appList.html('<div id="formLoading"><img src="css/rolling.gif"></div>');

	getAllApplications(function(applications) {
		appList.find('#formLoading').remove();
		if(applications.length > 0) {
			$.each(JSON.parse(applications), function(index, application) {
				appConflict = 0;
				//check if app already exist
				$('.custom-popup-form').find('.apps').each(function(index, el) {
					appId = $(el).find('#appId').val();
					if(appId == application.id) {
						appConflict++;
					}
				});

				if(appConflict > 0) {//if app exist
					appList.append('<div class="app disable" onclick="changeAccountApplication(\''+accAppId+'\',\''+application.id+'\',\''+application.name+'\')"><span>'+application.name+'</span></div>'); 
				} else {//if app didnt exist
					appList.append('<div class="app" onclick="changeAccountApplication(\''+accAppId+'\',\''+application.id+'\',\''+application.name+'\')"><span>'+application.name+'</span></div>'); 
				}
			});
		} else {
			appList.html('<div style="position:relative;width:100%;height:100%;"><div style="position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;text-align:center;height: 20px;font-size: 20px;color: gainsboro;">NO APPLICATIONS</div></div>');
		}
		reInitializedInstance();
	});
	showApplicationPopUp();
}
function changeAccountApplication(accountApplicationId,appId,appName) {
	$('#'+accountApplicationId).find('#appId').val(appId);
	$('#'+accountApplicationId).find('.appName').html(appName);
	reInitializedInstance();
	hideApplicationListPopup();
}


function viewAccount(accId) {

	//declaration of variables 
	var popupBodyContent1, popupBodyContent2, pop, form, account, accountInfo, accountPlace, pepperBodyListString, html;

	//initializing variables
	popupBodyContent1 = '<div class="inputField">\
									<div class="inputLabel">CLIENT NAME</div>\
									<div class="inputBox">\
										<input id="clientNameInputField" type="text" readonly></input>\
									</div>\
								</div>\
								<div class="inputField">\
									<div class="inputLabel">EMAIL ADDRESS</div>\
									<div class="inputBox">\
										<input id="emailAddInputField" type="text" readonly></input>\
									</div>\
								</div>\
								<div class="inputField">\
									<div class="inputLabel">TELEPHONE</div>\
									<div class="inputBox">\
										<input id="telephoneInputField" type="text" readonly></input>\
									</div>\
								</div>\
								<div class="inputField">\
									<div class="inputLabel">ACCOUNT NAME</div>\
									<div class="inputBox">\
										<input id="accountNameInputField" type="text" readonly></input>\
									</div>\
								</div>\
								<div class="inputField">\
									<div class="inputLabel">ACCOUNT PASSWORD</div>\
									<div class="inputBox">\
										<input id="accountPasswordInputField" type="text" readonly></input>\
									</div>\
								</div>';
	popupBodyContent2 = '<div id="accountPlaceList">\
							</div>';
	pop = new popup({
							header : {content: 'View Account'},
							nav : ['PROFILE','PLACE'],
							body : {content:[popupBodyContent1,popupBodyContent2]},
							footer : false,
							height : '600px'
						});
	form = $('.custom-popup-form');
	//end of initializing

	var placeValidityCount = 0;

	pop.show();
	pop.loading(true);
	getAccount(accId,function(data) {
		account = JSON.parse(data);
		accountInfo =  account['info'];
		//accountApps = account['applications'];
		accountPlace = account['places'];

		form.find('#clientNameInputField').val(accountInfo['clientName']);
		form.find('#emailAddInputField').val(accountInfo['email']);
		form.find('#telephoneInputField').val(accountInfo['tel']);
		form.find('#accountNameInputField').val(accountInfo['accountName']);
		form.find('#accountPasswordInputField').val(accountInfo['password']);

		Clear(form.find('#accountPlaceList'));

		$.each(accountPlace, function(index, place) {

			if(place.placeValidity == 1) {

				placeValidityCount++;

			}

		});

		if(placeValidityCount == 0) {
			form.find('#accountPlaceList').html('<div style="/*position:relative;*/width:100%;height:100%;"><div style="position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;width: 70px;height: 20px;font-size: 20px;color: gainsboro;">EMPTY</div></div>');
		} 
		else {
			$.each(accountPlace, function(index, place) {

				if(place.placeValidity == 1) {

					html = '<div class="placeInfo">\
									<div class="viewplacename" class="apps">\
										Place Name:  '+place.placeName+'\
									</div>\
									<div class="viewplacetel">\
										Telephone: '+place.placeTel+'\
									</div>\
									<div class="placeAddview">\
										Address: '+place.placeAdd+'\
									</div>\
									<div class="placeRegister">\
										Place Register: <input type="text" id="placereg" value="'+place.placeRegister+'" min="0" readonly></input>\
									</div>\
									<div class="placeUpdated">\
										Place Last Updated: <input type="text" id="placeupdate" value="'+place.placeUpdate+'" min="0" readonly></input>\
									</div>\
								</div>\
							</div>';
					form.find('#accountPlaceList').append(html);

				}

			});
		}

		makeElementUnclickable(form.find('input'));
		makeElementUnclickable(form.find('.apps'));

		pop.loading(false);
	});
}


function deleteApp(appId) {
	//declaration of variables
	var app;

	//initializing variables
	app = $('#applicationContent #app_'+appId);

	confirmDialog(function(result) {
		if(result == 'yes') {
			app.append('<div id="formLoading" style="background-color:tomato;color:white;border-radius:5px;"><img src="css/rolling1.gif"></div>');
			$.post('php/deleteApplication.php', {id: appId}, function(data, textStatus, xhr) {
				if(textStatus == 'success') {
					app.remove();
				}
			});
		}
	});
}
function editApp(appId) {
	//declaration of variables
	var popupBodyContent1, pop, form, app;

	//initializing variables
	popupBodyContent1 = '<div class="inputField">\
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
	pop = new popup({
						header : {content: 'Edit Application'},
						nav : false,
						body : {content:[popupBodyContent1]},
						footer : { buttons : [
										{	
											id : 'popup_savebutton',
											text : 'SAVE CHANGES',
											onclick : 'editApplication(\''+appId+'\')'
										}
									]
								},
						height : '530px'
					});
	form = $('.custom-popup-form');
	//end of initializing

	pop.show();
	pop.loading(true);

	getApplication(appId, function(data) {
		app = JSON.parse(data);

		form.find('#appNameInputField').val(app['name']);
		form.find('#appIDInputField').val(app['appID']);
		form.find('#webURLInputField').val(app['webURL']);
		form.find('#manualURLInputField').val(app['manualURL']);

		pop.loading(false);
	});
}

function saveNewApplication() {
	//declaration of variables
	var data, response, form;

	//initialize variables
	form = $('.custom-popup-form');

	makeElementUnclickable('.custom-popup-form');

	verifyApplicationFormFields(function(result) {
		if(result == 'valid') {	
			data = getApplicationDataFromForm();
			form.find('#popup_savebutton').html('<div id="loading"><i class="fa fa-circle-o-notch" aria-hidden="true"></i>&nbspSAVING</div>');

			saveApplication(data,'new','0',function(result) {
				form.find('#popup_savebutton').html('SAVE');
				
				
				if(result == 'Success') {
					alertDialog('<i class="fa fa-check" aria-hidden="true"></i>','Success',function(){
						makeElementClickable('.custom-popup-form');

						form.find('.popup_close_button .fa').click(); //close the popup
					});

					showApplicationsFromDatabase();
				} else {
					response = JSON.parse(result);

					try {
						if(response['conflicts']['appNameNoOfConflicts'] > 0 ) throw "Application Name is already taken";
					} catch(err) {
						form.find('#appNameInputField').addClass('error');
						form.find('#appNameInputField').parents('.inputField').find('.inputError').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
					}

					try {
						if(response['conflicts']['appIDNoOfConflicts'] > 0 ) throw "Application ID is already taken";
					} catch(err) {
						form.find('#appIDInputField').addClass('error');
						form.find('#appIDInputField').parents('.inputField').find('.inputError').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
					}

					try {
						if(response['conflicts']['webURLNoOfConflicts'] > 0 ) throw "Websystem URL is already taken";
					} catch(err) {
						form.find('#webURLInputField').addClass('error');
						form.find('#webURLInputField').parents('.inputField').find('.inputError').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
					}

					try {
						if(response['conflicts']['manualURLNoOfConflicts'] > 0 ) throw "Manual URL is already taken";
					} catch(err) {
						form.find('#manualURLInputField').addClass('error');
						form.find('#manualURLInputField').parents('.inputField').find('.inputError').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
					}

					alertDialog('<i class="fa fa-exclamation" aria-hidden="true"></i>','Fail',function(){
						makeElementClickable('.custom-popup-form');
					});
				}			
			});
		} else {
			alertDialog('<i class="fa fa-exclamation" aria-hidden="true"></i>','Error!',function(){
				makeElementClickable('.custom-popup-form');
			});
		}
	});
	
}
function editApplication(appId) {
	//declaration of variables
	var data, response, form;

	//initialize variables
	form = $('.custom-popup-form');

	makeElementUnclickable('.custom-popup-form');

	verifyApplicationFormFields(function(result) {
		if(result == 'valid') {		
			form.find('#popup_savebutton').html('<div id="loading"><i class="fa fa-circle-o-notch" aria-hidden="true"></i>&nbspSAVING</div>');
			data = getApplicationDataFromForm();

			saveApplication(data,'edit', appId, function(result) {


				
				form.find('#popup_savebutton').html('SAVE CHANGES');
				
				if(result == 'Success') {
					alertDialog('<i class="fa fa-check" aria-hidden="true"></i>','Success',function(){
						makeElementClickable('.custom-popup-form');
					});
					showApplicationsFromDatabase();
				} else {
					response = JSON.parse(result);

					try {
						if(response['conflicts']['appNameNoOfConflicts'] > 0 ) throw "Application Name is already taken";
					} catch(err) {
						form.find('#appNameInputField').addClass('error');
						form.find('#appNameInputField').parents('.inputField').find('.inputError').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
					}

					try {
						if(response['conflicts']['appIDNoOfConflicts'] > 0 ) throw "Application ID is already taken";
					} catch(err) {
						form.find('#appIDInputField').addClass('error');
						form.find('#appIDInputField').parents('.inputField').find('.inputError').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
					}

					try {
						if(response['conflicts']['webURLNoOfConflicts'] > 0 ) throw "Websystem URL is already taken";
					} catch(err) {
						form.find('#webURLInputField').addClass('error');
						form.find('#webURLInputField').parents('.inputField').find('.inputError').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
					}

					try {
						if(response['conflicts']['manualURLNoOfConflicts'] > 0 ) throw "Manual URL is already taken";
					} catch(err) {
						form.find('#manualURLInputField').addClass('error');
						form.find('#manualURLInputField').parents('.inputField').find('.inputError').html('<i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp'+err);
					}

					alertDialog('<i class="fa fa-exclamation" aria-hidden="true"></i>','Fail',function(){
						makeElementClickable('.custom-popup-form');
					});
				}
			});
		} else {
			alertDialog('<i class="fa fa-exclamation" aria-hidden="true"></i>','Error',function(){
				makeElementClickable('.custom-popup-form');
			});
		}
	});
}
function getApplicationDataFromForm() {
	//declaration of variables
	var form, appName, appID, webURL, manualURL, appData;

	//initializing variables
	form = $('.custom-popup-form');
	appName = htmlspecialchars(form.find('#appNameInputField').val());
	appID = htmlspecialchars(form.find('#appIDInputField').val());
	webURL = htmlspecialchars(form.find('#webURLInputField').val());
	manualURL = htmlspecialchars(form.find('#manualURLInputField').val());		
	appData = [];
	//end of initialization

	appData.push({
					name : appName,
					ID : appID,
					weburl : webURL,
					manualurl : manualURL,
				});

	return appData;
}
function getAccountDataFromForm() {
	//declaration of variables
	var form, accountData, accountApplications, clientName, email, tel, accountName, accountPass, appStatus, placeArray, placeEditArray;
	
	//initializing variables
	form = $('.custom-popup-form');
	accountData = [];
	accountApplications = [];
	placeArray = [];
	placeEditArray = [];
 	clientName = htmlspecialchars(form.find('#clientNameInputField').val());
	email = htmlspecialchars(form.find('#emailInputField').val());
	tel = htmlspecialchars(form.find('#telephoneInputField').val());
 	accountName = htmlspecialchars(form.find('#accountNameInputField').val());
	accountPass = htmlspecialchars(form.find('#accountPasswordInputField').val());
	startDateGet = htmlspecialchars(form.find('#startPeriodAddId').val());
	endDateGet = htmlspecialchars(form.find('#endPeriodAddId').val());
	//end of initialization

	form.find('#popup_savebutton').html('<div id="loading"><i class="fa fa-circle-o-notch" aria-hidden="true"></i>&nbspSAVING</div>');


	form.find('.apps').each(function(index, el) {
		appStatus = 'new';

		if(!$(el).hasClass('new')) {
			appStatus = 'old';
		}             

		accountApplications.push({
									id : $(el).find('#accAppId').val(),
									appId :  $(el).find('#appId').val(),
									start : $(el).find('.appStartDate input').val(),
									limit : $(el).find('.appLimit input').val(),
									pepperMax : $(el).find('.pepperMax input').val(),
									status : appStatus
								 });
	});

	//Richard
	//Store the data of Place name, telephone number and Address to placeArray
	form.find('.PlaceInfo').each(function(index, el){

		placeArray.push({
							name : $(el).find('#nameVal').text(),
							tel : $(el).find('#telVal').text(),
							address : $(el).find('#addVal').text()
		});

	});

	form.find('.PlaceInfoEdit').each(function(index, el){

		placeEditArray.push({
							nameEdit : $(el).find('#nameVal').text(),
							telEdit : $(el).find('#telVal').text(),
							addressEdit : $(el).find('#addVal').text()
		});

	});

	accountData.push({
                      ClientName : clientName,
                      Email : email,
                      Tel : tel,
                      AccountName : accountName,
                      AccountPass : accountPass,
                      Applications : accountApplications,
                      Start_Date : startDateGet,
                      End_Date : endDateGet,
                      Place : placeArray,
                      PlaceEdit : placeEditArray
                    });

	return accountData;
}

function htmlspecialchars(string) { 
	return $('<span>').text(string).html() ;
}

//Richard
function countExistingAccount(callback) {
	$.post( "php/count.php", function( result ) {
		callback(result);
	});
}

//Richard
//Add new Account in Database
function addAccountFunction(data,accStatus,accId,callback) {
	$.post( "php/addAccount.php", { data: JSON.stringify(data),status : accStatus,id: accId}).done(function( result ) {
		callback(result);
	});
}
//Richard
function closePlacesFunction(closePlaces,callback) {
	$.post( "php/validPlaces.php", { closePlace: JSON.stringify(closePlaces) }).done(function(result) {
		callback(result);
	});
}
//Richard
//Check database end date and compare it if it's still valid or not
function updateExpiredAccounts() {
	$.ajax({  type: "POST",  
          url: "php/expireDate.php" 
    });

}

//Richard
//get all information in the account_tb
function getAccountsFromDatabase(callback) {
	$.get( "php/LgetAccounts.php", function( data, textStatus, xhr ) {
		callback(data);
	});
}
//Richard
//Display data from account_tb to be edit
function getEditAccount(accId,callback) {
	$.post('php/editAccount.php',{id: accId}, function(data, textStatus, xhr) {
		callback(data);
	});
}

function saveAccount(data,accStatus,accId,callback) {
	$.post( "php/saveAccount.php", { data: JSON.stringify(data),status : accStatus,id: accId}).done(function( result ) {
		callback(result);
	});
}

function getAllApplications(callback) {
	$.get( "php/getAllApplication.php", function( data ) {
		callback(data);
	});
}
function getAccount(accId,callback) {
	$.post('php/LgetViewAccounts.php',{id: accId}, function(data, textStatus, xhr) {
		callback(data);
	});
}
function getApplication(appId, callback) { 
	$.post('php/getApplication.php', {id: appId}, function(data, textStatus, xhr) {
		callback(data);
	});
}
function saveApplication(appData,appStatus,appId,callback) {
	$.post('php/saveApplication.php', {data: JSON.stringify(appData[0]),status: appStatus, id: appId}, function(data, textStatus, xhr) {
		callback(data);
	});
}


