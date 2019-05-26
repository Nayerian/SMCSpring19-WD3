function wizRenderCaptcha(){
     mdn_form = [];
	 jQuery("form.mdn-registration-form").each(function() {
	 	var form_id = jQuery(this).attr("id");
	 	var form_callback = form_id.replace(/\-/g, '_');
	 	var captcha =  grecaptcha.render(document.getElementById('g-recaptcha_' + form_id), {
	            'sitekey': Drupal.settings.wiz_mdn_subscription.google_recaptcha_key,
				'callback' : form_callback + '_js'
			    });
	 	mdn_form.push(captcha);
	 });
}

(function ($) {
$.fn.refreshcaptcha = function(data) {
    $.each(mdn_form, function( index, value ) {
			grecaptcha.reset(value);
	});
  };
$.fn.pushAnalyticsMdnForm = function(data, formId) {
		fullPageVideoHeaderRegisterForm('mdn', data, formId);
	};
$.fn.clearMdnForm = function(clear_form_id) {
		function shareButtonClickEvent() {
			try {
				ga("send", "event", "mdn", "click", this.getAttribute("data-tracking-label"));
			} catch(e) {}
		}
		
		jQuery("button#g-recaptcha_" + clear_form_id).remove();
		var style = jQuery('<style> #' + clear_form_id + ' div.grecaptcha-badge { display: none; }</style>');
		jQuery('html > head').append(style);
		ark.updateSocialButton();
		$( document ).ajaxStop(function() {
  			ark.updateSocialButton();
  			
  			var shareButtons = document.querySelectorAll("#fullpage-video-header .social-share a:not([data-tracking-initialized])"),
  				i;
  			for ( i = 0; i < shareButtons.length; i++ ) {
	  			shareButtons[i].setAttribute("data-tracking-initialized", "true");
	  			shareButtons[i].addEventListener("click", shareButtonClickEvent);
  			}
		});
	};
$.fn.createRegistrationDeniedCookie = function() {
    window.ark.Cookies.set("mdn_subscription_denied", 1, "1m");
};
}(jQuery));

function checkIfRegistrationIsDenied() {
    if (window.ark.Cookies.get("mdn_subscription_denied") != null) {
		jQuery.get("/mdn_subscription/denied", function(data){
			jQuery("form.mdn-registration-form").each(function() {
				jQuery(this).html(data);
			});
		});
        return true;
    }else{
    	return false;
    }
};