//---------- configs -----------

//HTML template
var fieldInputTemplate;

//container for toppings ui
var ui_toppings;

//global reference for active ingredient
var ajax_toppingWaiting = "";

//API error msg
var api_error_msg = "MON DIEU! Our Le Api has Le Probleme";

/* ------------------------------

 				INIT

 --------------------------------- */

$(document).ready(function() {

	//reference container
	ui_toppings = $("#toppings");

	//grab this guy
	fieldInputTemplate = $('#templates').find('#template_ingredientDiv');

	//cleanse the DOM
	$('body').find('#templates').remove();

	//call api for toppings
	ajax_getToppings();

});


/* ------------------------------

			CLICK HANDLERS

 --------------------------------- */

//click handler for our checkboxes
$(document).on("click",".ingredient",function(e) {

	//make sure we don't cause an ajax logjam

	//fancy audio to reinforce UX
	$('#ui_audio_click').trigger('play');

	//skip processing if ajax still hasn't responded
	if (ajax_toppingWaiting != "") { return; }

	//scope to <input>
	var input = $(e.target);

	//get id
	//var id =
	var id = $(input).text();//spaced text

	//global scope the topping id
	ajax_toppingWaiting = $(input).attr('id');;

	//style the topping grey
	ui_styleInputWaiting(ajax_toppingWaiting,'waiting');

	//add/drop based on check
	$(input).attr('data-added') == 'no' ? ajax_addTopping(id) : ajax_dropTopping(id);

});


/* ------------------------------

			BUILDING

 --------------------------------- */

function build_ingredientHTML(obj, top_list) {

	console.log('build_ingredientHTML');

	//scope to <label>
	var fieldHTML = $(fieldInputTemplate);

	//loop through ingredients and build our fieldset
	for(i=0;i<top_list['toppings_all'].length;i++) {

		var top_name = top_list['toppings_all'][i];
		var top_name_id = top_name.replace(/\s/g,'');

		if (top_name == 'ExtraCheese') { top_name = 'Extra Cheese' }
		if (top_name == 'BellPepper') { top_name = 'Bell Pepper' }

		//clone HTML objs for world dom... world peace, yes that's what i meant "peace"
		var tmpDiv = $(fieldHTML).clone();

		//set text
		$(tmpDiv).text(top_name);

		//set input name prop
		$(tmpDiv).prop('id',top_name_id);//drop white spaces for cleaner id

		//add
		$(obj).append(tmpDiv);

		//check to see if we already have the topping
		if (tool_isInArray(top_name,top_list['toppings_current'])) {

			//show active text in ui
			ui_styleInputWaiting(top_name_id,'added');

			//save active data attr
			$("#"+top_name_id).attr('data-added','yes');

			//show the topping (default is hidden)
			ui_toppingActivator(top_name_id,true);
		}



	}//end for

}//end f

//when hasOwnProperty and $.inArray fail at 11:34pm ...
function tool_isInArray(item,arr) {

	for(x=0;x<arr.length;x++) {
		if (arr[x] == item) {
			return true;
		}
	}
	return false;
}


/* ------------------------------

			STYLING

 --------------------------------- */

function ui_styleInputWaiting(id,mode) {

	var str = "#" + id;
	var tmp = $(str);

	switch(mode) {

		case "plain":
			$(tmp).addClass("input_plain");
			$(tmp).removeClass("input_waiting");
			$(tmp).removeClass("input_added");
			break;

		case "waiting":
			$(tmp).removeClass("input_plain");
			$(tmp).addClass("input_waiting");
			$(tmp).removeClass("input_added");
			break;

		case "added":
			$(tmp).removeClass("input_plain");
			$(tmp).removeClass("input_waiting");
			$(tmp).addClass("input_added");
			break;

	}//end switch

}//end f

function ui_toppingActivator(top,show) {

	if (show == undefined || show == null) {
		show = false;
	}

	top = top.replace(/\s/g, '');

	//array('Pepperoni','Sausage','Canadian Bacon','Olives','Onions','BellPepper','Shrooms');

	/*

	 <div id="message">YOU WILL GET LE SAUCE, NO LE EXCEPTIONS</div>
	 <div id="pizza_img_canadianBacon" class="pizza_topping"><img src="images/canadianBacon.png"/></div>
	 <div id="pizza_img_greenPeppers" class="pizza_topping"><img src="images/greenPeppers.png"/></div>
	 <div id="pizza_img_olives" class="pizza_topping"><img src="images/olives.png"/></div>
	 <div id="pizza_img_onions" class="pizza_topping"><img src="images/onions.png"/></div>
	 <div id="pizza_img_pepperoni" class="pizza_topping"><img src="images/pepperoni.png"/></div>
	 <div id="pizza_img_sausage" class="pizza_topping"><img src="images/sausage.png"/></div>
	 <div id="pizza_img_shrooms" class="pizza_topping"><img src="images/shrooms.png"/></div>
	 <div id="pizza_img_base" class="pizza_base"><img src="images/pizza.png"/></div>

	 */


	switch (top) {

		case "Pepperoni":
			if (show == true) {
				$('#pizza_img_pepperoni').addClass("visible");
				$('#pizza_img_pepperoni').removeClass("hidden");
			} else {
				$('#pizza_img_pepperoni').removeClass("visible");
				$('#pizza_img_pepperoni').addClass("hidden");
			}
			break;

		case "Sausage":
			if (show == true) {
				$('#pizza_img_sausage').addClass("visible");
				$('#pizza_img_sausage').removeClass("hidden");
			} else {
				$('#pizza_img_sausage').removeClass("visible");
				$('#pizza_img_sausage').addClass("hidden");
			}
			break;

		case "CanadianBacon":
			if (show == true) {
				$('#pizza_img_canadianBacon').addClass("visible");
				$('#pizza_img_canadianBacon').removeClass("hidden");
			} else {
				$('#pizza_img_canadianBacon').removeClass("visible");
				$('#pizza_img_canadianBacon').addClass("hidden");
			}
			break;

		case "Olives":
			if (show == true) {
				$('#pizza_img_olives').addClass("visible");
				$('#pizza_img_olives').removeClass("hidden");
			} else {
				$('#pizza_img_olives').removeClass("visible");
				$('#pizza_img_olives').addClass("hidden");
			}
			break;

		case "Onions":
			if (show == true) {
				$('#pizza_img_onions').addClass("visible");
				$('#pizza_img_onions').removeClass("hidden");
			} else {
				$('#pizza_img_onions').removeClass("visible");
				$('#pizza_img_onions').addClass("hidden");
			}
			break;

		case "BellPepper":
			if (show == true) {
				$('#pizza_img_greenPeppers').addClass("visible");
				$('#pizza_img_greenPeppers').removeClass("hidden");
			} else {
				$('#pizza_img_greenPeppers').removeClass("visible");
				$('#pizza_img_greenPeppers').addClass("hidden");
			}
			break;

		case "Shrooms":
			if (show == true) {
				$('#pizza_img_shrooms').addClass("visible");
				$('#pizza_img_shrooms').removeClass("hidden");
			} else {
				$('#pizza_img_shrooms').removeClass("visible");
				$('#pizza_img_shrooms').addClass("hidden");
			}
			break;

	}//end switch

}//end f

/* ------------------------------

				AJAX

 --------------------------------- */


function ajax_addTopping(top) {
	$.ajax({
		method:'POST',
		url: 'php/ajax_pizza.php',
		data: {
			action: 'addTopping',
			topping: top
		},
		success: function(result) {
			try {
				json = jQuery.parseJSON(result);
			} catch (e) {
				showError("Invalid JSON returned from server: " + result);
				return;
			}
			if (json["success"] === "0") {
				showError(json["errormsg"]);
			} else {

				//insult...er...inform our user
				showMsg();

			}

			//change the ingredient text to red
			ui_styleInputWaiting(ajax_toppingWaiting,'added');

			//update the ingredient data attribute
			$("#"+ajax_toppingWaiting).attr('data-added','yes');

			//turn on the topping
			ui_toppingActivator(ajax_toppingWaiting,true);

			ajax_toppingWaiting = "";//reset

		},
		error: function() {
			showError(api_error_msg);
			ajax_toppingWaiting = "";
		}
	});
}

function ajax_dropTopping(top) {
	$.ajax({
		method:'POST',
		url: 'php/ajax_pizza.php',
		data: {
			action: 'dropTopping',
			topping: top
		},
		success: function(result) {

			//Check to see if our JSON is bueno
			try {
				json = jQuery.parseJSON(result);
			} catch (e) {
				showError("Invalid JSON returned from server: " + result);
				return;
			}

			//Check to see if our API call was ok
			if (json["success"] === "0") {
				showError(json["msg"]);
			} else {

				//some friendly banter
				showMsg();

			}

			//change the ingredient text to white
			ui_styleInputWaiting(ajax_toppingWaiting,"plain");

			//update the data attribute
			$("#"+ajax_toppingWaiting).attr('data-added','no');

			//turn off the topping
			ui_toppingActivator(ajax_toppingWaiting,false);

			ajax_toppingWaiting = "";//reset
		},
		error: function() {
			showError(api_error_msg);
			ajax_toppingWaiting = "";
		}
	});
}

function ajax_getToppings() {
	$.ajax({
		method:'POST',
		url: 'php/ajax_pizza.php',
		data: {
			action:"getToppings"
		},
		success: function(result) {
			try {
				json = jQuery.parseJSON(result);
			} catch (e) {
				showError("Invalid JSON returned from server: " + result);
				return;
			}

			if (json["success"] === "0") {

				//modal error
				showError(json["msg"]);

			} else {

				//now get current toppings
				build_ingredientHTML(ui_toppings,json);

			}
		},
		error: function() {
			showError(api_error_msg);
		}
	});
}

function showMsg(msg) {

	var snark = new Array();
	snark[0] = "Oui! Not bad ... for a peasant ...";
	snark[1] = "Les Miserable - such is life. Such is your choice";
	snark[2] = "Sacrebleu! Who has written these?!";
	snark[3] = "Ahhh Le 'Mericans and their bad fashion sense";
	snark[4] = "Perhaps some flithy box wine to go with it eh?";
	snark[5] = "Nein! er, I mean Non. Parisians would nevair.";
	snark[6] = "Le Noir. Superiarrr to ze Technicolarrr";
	snark[7] = "You realize eet ees all bad jokes? Non?";
	snark[8] = "Mon Dieu! Moar! Moar! Le Muricaaaains!";
	snark[9] = "You are not Le French. Shhhh. It's Le OK";
	snark[10] = "Le Drol.";

	if (msg == undefined || msg == '') {
		var num = Math.floor(Math.random() * snark.length);
		var msg = snark[num];
	}

	//set msg
	$("#message").text(msg);

}

function showError(message) {

	alert("Steve...wth!...FIX THIS: " + message);
	showMsg("MON DIEU! Le Steve needs to Le Fix Me");
}

/*
function reportError(message,type) {

}*/