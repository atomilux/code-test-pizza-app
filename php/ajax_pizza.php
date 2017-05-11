<?php

//phpinfo();

/* *************************************************************************
 * Welcome to the SwipeTrack PIZZA PIZZA code exercise.  We'd like to get to
 * know your skillset and style.  We have this "application", designed to
 * let a user create a list of the toppings they want on their pizza.  We
 * store this list on the backend in case the user leaves and returns to the
 * site.  Normally this would be done in a database, but for this exercise
 * we are using a PHP session.
 * 
 * There is one problem -- it doesn't allow the user to remove a topping if
 * they change their mind.  We'd like you to put that functionality in.
 * We would prefer you stick to AJAX so that the imaginary rest of the
 * application interface does not have to be reloaded.  Aside from that,
 * you have complete creative freedom.
 * 
 * If you have any questions, need any help or explanation of any of the
 * code below, please don't hesitate to contact tammy@swipetrack.com
 * *************************************************************************
 */


/* ------------------------------

				INIT

--------------------------------- */

//Startup...
session_start();
init();

//initializes SESSION and pseudo data
function init() {

	if (!isset($_SESSION['toppings_available']) || !isset($_SESSION['toppings'])) {

		//total available toppings
		$_SESSION['toppings_available'] = array('Pepperoni','Sausage','Canadian Bacon','Olives','Onions','Bell Pepper','Shrooms');

		//running meta of toppings
		$_SESSION['toppings'] = array();

	}

	api_url_router();

}//end f



/* ------------------------------

		TOPPING VALIDATORS

--------------------------------- */

function valid_topping($top,$drop = false) {

	$msg = "ok";

	//catch empty
	if(!$top) {
		$msg = "no topping submitted";
	}

	//catch invalid topping
	if (!validate_toppingAvailable($top)) {
		$msg = "invalid topping";
	}

	return $msg;

}//end f

function validate_toppingAvailable($t) {

	//might alias this to something later
	$toppingsList = $_SESSION['toppings_available'];

	//we got it?
	if (in_array($t, $toppingsList)) {
		return true;//Si
	}

	return false;//NEIN!

}//end f


function validate_toppingExists($t) {

	$currentToppingsList = $_SESSION['toppings'];

	if (!in_array($t,$currentToppingsList)) {
		return false;
	}

	return true;

}//end f




/* ------------------------------

			API CALLS

--------------------------------- */


function api_url_router() {

	//ajax add topping
	if ($_POST['action'] == 'addTopping') {
		api_addTopping($_POST['topping']);
	}

	//ajax remove topping
	if ($_POST['action'] == 'dropTopping') {
		api_dropTopping($_POST['topping']);
	}

	if ($_POST['action'] == 'getToppings' || $_GET['action'] == 'getToppings') {
		api_getToppings();
	}

}//end f


function api_getToppings() {
	json_toppings($_SESSION['toppings_available'],$_SESSION['toppings']);
}


function api_addTopping($top) {

	//test to see if its a legit topping
	$status = valid_topping($top);

	//nope - JSON back a fail
	if($status != "ok") {
		json_error($status);
		exit;
	}

	//if it's already been added
	if (validate_toppingExists($top)) {
		$msg = $top . " aleady exists";
		json_error($_SESSION['toppings']);
		exit;
	}

	//add topping
	array_push($_SESSION['toppings'],$top);

	//JSON out
	json_success("topping added");

}//end f


function api_dropTopping($top) {

	//test to see if its a legit topping
	$status = valid_topping($top);

	//nope - JSON back a fail
	if($status != "ok") {
		json_error($status);
		exit;
	}

	//ONLY if it's already an added topping
	if (in_array($top,$_SESSION['toppings'])) {

		//find the key and unset it
		if (($key = array_search($top, $_SESSION['toppings'])) !== false) {

			array_splice($_SESSION['toppings'],$key,1);

			json_success("Topping Removed");
		}

	} else {
		//it's not a legit one to remove
		json_error("No topping to remove");

	}

}//end f



/* ------------------------------

			JSON OUTPUT

--------------------------------- */

function json_error($msg) {

	$result = array();
	$result["success"] = 0;
	$result["msg"] = $msg;

	echo json_encode($result);

}//end f

function json_success($msg) {

	$result = array();
	$result["success"] = 1;
	$result["msg"] = $msg;
	$result["type"] = "success";

	echo json_encode($result);

}//end f

function json_toppings($top_all,$top_current) {

	$result = array();
	$result["success"] = 1;
	$result["toppings_all"] = $top_all;
	$result["toppings_current"] = $top_current;

	echo json_encode($result);

}//end f

?>