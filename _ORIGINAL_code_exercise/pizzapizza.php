<?php

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


if (!isset($_GET['action'])) {$_GET['action'] = '';}
session_start();

if ($_GET['action'] == 'addTopping') {
	$result = array();
	$result['errormsg'] = '';
	$result['success'] = 0;

	if (isset($_GET['topping'])) {
		if (!isset($_SESSION['toppings'])) {
			$_SESSION['toppings'] = array();
		}
		$_SESSION['toppings'][] = $_GET['topping'];
		$result['success'] = 1;
	} else {
		$result['errormsg'] = 'No Topping Entered';
	}

	echo json_encode($result);
	exit;
} else if ($_GET['action'] == 'getToppings') {
	$result = array();
	$result['errormsg'] = '';
	$result['success'] = 1;
	$result['toppings'] = array();

	if (isset($_SESSION['toppings'])) {
		$result['toppings'] = $_SESSION['toppings'];
		$result['success'] = 1;
	}
	
	echo json_encode($result);
	exit;
} else {
	printForm();
}


function printForm() {?>
	<!DOCTYPE html>
	<html>
		<head>
			<title>Pizza Pizza</title>
			<script src="jquery.min.js"></script>
			<script>
				$(document).ready(function() {
					getToppings();
				});

				$(document).on("keydown", function (e) {
					// capture the enter key and call submitTopping() if pressed
					var key = e.which || e.keyCode || e.charCode;
					if (key === 13) {
						addTopping();
					}
				});

				$(document).on("click","#btnSubmit",function(e) {
					e.stopPropagation();
					e.preventDefault();
					addTopping();
				});

				function addTopping() {
					$.ajax({
						url: 'pizzapizza.php?action=addTopping',
						data: {
							topping: $("#topping").val()
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
								$("#topping").val("");
								getToppings();
							}
						},
						error: function() {
							showError('Error Reaching pizzapizza.php');
						}
					});
				}

				function getToppings() {
					$.ajax({
						url: 'pizzapizza.php?action=getToppings',
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
								if (Object.keys(json["toppings"]).length > 0) {
									$("#listToppings").empty();
									$.each(json["toppings"],function(key,value) {
										$("#listToppings").append("<li data-toppingid='" + key + "'>" + value + "</li>");
									});
								} else {
									$("#divToppings").html("");
								}
							}
						},
						error: function() {
							showError('Error Reaching Server');
						}
					});
				}

				function showError(message) {
					alert("ERROR: " + message);
				}
			</script>

			<style type="text/css">
				#listToppings li {
					border: 1px solid #F2F2F2;
					list-style-type: none;
				}
			</style>
		</head>
		<body>

			What topping would you like?
			<input type="text" name="topping" id="topping" value="">
			<button type="button" id="btnSubmit" name="btnSubmit">Submit</button>

			<br><br><br>

			<h1>YOUR PIZZA:</h1>
			<ul id="listToppings"></ul>

		</body>
	</html>
<?php
}
