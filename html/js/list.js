function nextLine() {
	createClone();
	$(".numberInput").last().focus();
}

function computeCheckDigit(an) {
	weight = 3;
	sum = 0;
	for (i = an.length - 1; i >= 0; i--) {
		digit = an[i];

		sum += weight * digit;

		if (weight == 3)
			weight = 1;
		else
			weight = 3;
	}
	if (sum % 10 == 0)
		return 0;
	return 10 - sum % 10;
}

function complete4Digit(an) {
	lead = 4 - an.toString().length;
	let i;
	for(i = 0; i < lead; i++){
		an = "0" + an.toString();
	}
	an = "290" + an.toString();
	return an + computeCheckDigit(an);
}

function validateGtin(an) {
	short = an.toString().substring(0, an.toString().length - 1);
	return computeCheckDigit(short) == an.toString()[short.length];
}

function getComplete(an) {
	if(an == undefined || isNaN(an) || an.toString().length <= 0 || an == 0)
		return undefined;
	if (an.toString().length <= 4) {
		return complete4Digit(an);
	} else if (an.toString().length <= 7) {
		return complete7Digit(an);
	}
	if(an.toString().length == 8 || an.toString().length == 13)
		return validateGtin(an) ? an : undefined;
	return undefined;
}

function complete7Digit(an) {
	if (an <= 9999)
		return complete4Digit(an % 10000);
	else {
		lead = 7 - an.toString().length;
		let i;
		for(i = 0; i < lead; i++){
			an = "0" + an.toString();
		}
		an = "20090" + an.toString();
		return an + computeCheckDigit(an);
	}
}

$(document).ready(function() {

	createClone = function() {
		clone = $(".form-container").first().clone(true);
		$(clone).removeClass("invalid");
		$(clone).find(".input").val("");
		$(clone).find(".barcode").addClass("inactive");
		$(clone).find(".anc").text("");
		clone.appendTo($("#allForms"));
	}

	$(".numberInput").on("input", function(event) {

		event.preventDefault();

		input = $(event.target).val();
		ean = getComplete(input);

		if(ean == undefined){
			$(event.target.parentElement).find(".barcode").addClass("inactive");
			$(event.target.parentElement).find(".anc").text("");
			if(input.length > 0){
				$(event.target.parentElement).addClass("invalid");
			}
			return;
		}

		$(event.target.parentElement).removeClass("invalid");
		$(event.target.parentElement).find(".barcode").removeClass("inactive").JsBarcode(ean, {height: 50, format: ean.length == 8 ? "EAN8" : "EAN13"});
		$(event.target.parentElement).find(".anc").text(ean);

	});

	$(".plus").click(function(event) {
		nextLine();
	});

	$(".minus").click(function(event) {
		if ($(".form-container").length <= 1) {
			// if there is only one line left in the list, clear that line but
			// keep it
			$(".form-container").first().find(".input").val("");
			$(".form-container").first().find(".numberLabel").text("");
			$(".form-container").first().find(".anc").text("");
			$(".form-container").first().find(".input").focus();
			$(".form-container").first().find(".barcode").addClass("inactive");
			return;
		}
		$(event.target).closest(".form-container").remove();
	});

});