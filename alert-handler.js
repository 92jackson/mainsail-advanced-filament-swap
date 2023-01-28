/*
################################################################
################################################################
################################################################
Mainsail index.html mod for ADVANCED FILAMENT SWAP by JACKSON 92
################################################################
################################################################
################################################################

########################################################
Github: https://github.com/92jackson/mainsail-advanced-filament-swap
Discord: https://discord.gg/e3eXGTJbjx
########################################################
	WHAT IS THIS?:
	This is an additional javscript file which must be
	added to your Mainsail index.html to manage pop-up alerts.

	TO INSTALL:
	- Copy this file to the same directory as Mainsail's index.html (/home/pi/mainsail)
	- Open index.html in a text editor and paste the following just before </head>
	
	<!-- MOD START -->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js"></script>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css">
	<script src="./alert-handler.js"></script>
	<!-- MOD END -->
	
	N.B:
	IF MAINSAIL PUSH AN UPDATE TO INDEX.HTML IN AN UPDATE,
	YOU WILL HAVE RE-EDIT THE INDEX.HTML TO INCLUDE THE MOD.
	
	You shouldn't have to edit any of the following source, 
	it should just work (provided that you have set up my
	adv_filament_swap.cfg script correctly).
*/
var currAlertId = 0;
var currPushMsg = 0;
var alertIdForceCloseTo = -1;
var alert = null;
var runningMacro = false;

function isEmpty(value) {
	return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}

function fireMacro(macro) {
	if (runningMacro == false) {
		var wait = ( macro.indexOf('!') == -1 ) ? true : false;
		macro = macro.replace('!', '');
		
		var res = $.ajax({
			type: "GET",
			url: "/printer/gcode/script",
			data: { script: macro },
			cache: false,
			timeout: 300000
		});
		
		runningMacro = true;
		
		if (alert != null) {
			if (wait == false) {
				alert.close();
				alert = null;
				runningMacro = false;
			} else {
				$('.jconfirm-box-container .jconfirm-buttons .btn.'+macro).append('<div class="lds-dual-ring spin"></div>');
				$('.jconfirm-box-container .jconfirm-buttons .btn').prop('disabled', true);
				
				res.always(function( data ) {
					$('.jconfirm-box-container .jconfirm-buttons .btn.'+macro+' .spin').remove();
					$('.jconfirm-box-container .jconfirm-buttons .btn').prop('disabled', false);
					runningMacro = false;
				});
			}
		}
	}
}

$(this).arrive('.consoleTableRow .alert-usr-close', function() {
	var newAlertCloseId = $(this).attr("alertid");

	if (newAlertCloseId > 0 && newAlertCloseId > alertIdForceCloseTo) alertIdForceCloseTo = newAlertCloseId;
	if (currAlertId <= alertIdForceCloseTo && alert != null) {
		alert.close();
		alert = null;
		currPushMsg = 0;
	}
	
	runningMacro = false;
});

$(this).arrive('.consoleTableRow .alert-usr', function() {
	var $newAlert = $(this);
	var newAlertId = parseInt($newAlert.attr("alertid"));
	
	if (newAlertId > currAlertId && alertIdForceCloseTo < newAlertId) {
		runningMacro = false;	
		currPushMsg = 0;

		if (alert != null) {
			alert.close();
			alert = null;
		}
		currAlertId = newAlertId;
		
		var macros = "";
		var numMacros = 0;
		if (!isEmpty($newAlert.attr('macro'))) {
			macros = $newAlert.attr("macro").split("::");
			numMacros = macros.length;
		}
		var color = (!isEmpty($newAlert.attr('color'))) ? $newAlert.attr('color') : 'orange';

		alert = $.alert({
			title: $newAlert.children("h1").text(),
			content: $newAlert.html(),
			type: color,
			typeAnimated: false,
			closeIcon: true,
			theme: 'material',
			columnClass: 'medium',
			buttons: {
				close: {
					text: 'Okay',
					isHidden: (numMacros > 0) ? true : false,
					btnClass: 'btn-'+color
				}
			},
			onOpenBefore: function() {
				if (numMacros > 0) {
					var i;
					for (i = 0; i < numMacros; ++i) {
						$('.jconfirm-box-container .jconfirm-buttons').append(
							'<button class="btn btn-'+color+' '+macros[i].replace('!', '')+'" onclick="fireMacro(\''+macros[i]+'\')">'+
								macros[i].replace('_', ' ').replace('!', '')+
							'</button>'
						);
					}
					
				}
			},
			onOpen: function() {
				if ($(".consoleTableRow .soft-alert-usr[alertid='"+currAlertId+"']").length) {
					pushMsg($(".consoleTableRow .soft-alert-usr[alertid='"+currAlertId+"']").first());
				}
			},
		});
		
		//If alarm=true attr is set, fire an audible alarm
		if (!isEmpty($newAlert.attr("alarm"))) {
			const audio = new Audio("https://cdn.freesound.org/previews/205/205951_981397-lq.mp3");
			audio.play();
		}
	}
});

$(this).arrive('.consoleTableRow .soft-alert-usr', function() {
	pushMsg($(this));
});

function pushMsg(newMsg) {
	if (alert != null) {
		var pushId = parseInt(newMsg.attr("push"));
		//console.log(newMsg.attr("alertid")+"-"+currAlertId+" "+pushId+"-"+currPushMsg);
		
		if (newMsg.attr("alertid") == currAlertId && pushId >= currPushMsg) {
			$('.jconfirm-box-container .jconfirm-clear').html('<div class="push-msg"><span><b>&gt;&nbsp;</b> '+newMsg.text().replace('oC', '&#8451;')+'</span></div>');
			$('.jconfirm-box-container .jconfirm-clear .push-msg').animate({height: "toggle", opacity: "toggle"}, 1000);
			currPushMsg = pushId;
		
			if (!isEmpty(newMsg.attr("eta"))) {
				$('.jconfirm-box-container .jconfirm-clear').append('<div class="progress_bar"><div tyle="background-color:'+$(".jconfirm-buttons button").first().css("background-color")+ '"></div></div>');
				
				window.setTimeout(function() {
					$(".jconfirm-box-container .jconfirm-clear .progress_bar div").css({"width": "100%", "-webkit-transition": Math.ceil(newMsg.attr("eta"))+"s linear"});
				}, 0);
			}
		}
	}
}

var styleElem = document.createElement("style");
styleElem.innerHTML = `
	.jconfirm-box-container {
		margin: 0 auto;
		font-family: Arial, Helvetica, sans-serif !important;
	}

	.jconfirm-box-container .jconfirm-content-pane h1 {
		display: none;
	}

	.jconfirm-box-container .jconfirm-content-pane p, .jconfirm-box-container .jconfirm-content-pane li {
		margin: 10px 10px 0 10px;
	}

	.jconfirm-box-container .jconfirm-content-pane a {
		background: #CDCDCD;
		padding: 0 6px
	}

	.jconfirm-box-container .jconfirm-content-pane li {
		font-size: small;
	}

	.jconfirm-box-container .jconfirm-buttons .btn {
		padding: 10px 40px !important;
	}

	.jconfirm-box-container .jconfirm-buttons .btn[disabled] {
		background-color: #CDCDCD !important;
		cursor: not-allowed;
	}

	.jconfirm-box-container .jconfirm-clear .push-msg {
		display: none;
		width: 100%;
		background: #000000;
		color: #FFFFFF;
		font-size: small;
		font-family: Roboto Mono, monospace !important;
	}

	.jconfirm-box-container .jconfirm-clear .push-msg span {
		padding: 6px 12px;
	}

	@keyframes cursor-blink {
		0% {
			opacity: 0;
		}
	}

	.jconfirm-box-container .jconfirm-clear .push-msg span {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.jconfirm-box-container .jconfirm-clear .push-msg span::after {
		content: "";
		width: 5px;
		height: 20px;
		background: #FFFFFF;
		display: inline-block;
		animation: cursor-blink 1.5s steps(2) infinite;
	}

	.lds-dual-ring {
		display: inline-block;
		width: 20px;
		height: 20px;
		margin: -3px 0;
		position: absolute
	}
	.lds-dual-ring:after {
		content: " ";
		display: block;
		width: 10px;
		height: 10px;
		margin: 8px;
		border-radius: 50%;
		border: 6px solid #fff;
		border-color: #fff transparent #fff transparent;
		animation: lds-dual-ring 1.2s linear infinite;
	}
	@keyframes lds-dual-ring {
		0% {
		transform: rotate(0deg);
		}
		100% {
		transform: rotate(360deg);
		}
	}

	.progress_bar {
		width: 100%;
		height: 20px;
		background: #CDCDCD;
		margin-top: 10px
	}
	.progress_bar div {
		width: 0px;
		height: 20px;
		background-color: #333;
	}
`;
document.head.appendChild(styleElem);