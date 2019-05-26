(function ($) {
	Drupal.behaviors.wiz_autocard = {
		attach: function() {
			// DOUBLE FACED CARDS
			// Handle double-faced card flipping functionality.
			$(".btn-flip-image").click(function() {
				var new_img = $(this).attr('data-image-url');
				var cur_img = $(this).prev().find('img').attr('src');
				$(this).attr('data-image-url', cur_img);
				$(this).prev().find('img').attr('src', new_img);
					return false;
			});
			
			// Make card links open in new window
			$('.autocard-link , .autocard-card-link').click(function(event) {
				$(this).attr('target', '_blank');
			});
			
			// AUTOCARD IMAGE HOVER
			// Handle card hover tip functionality, integrated with qTip
			$('.autocard-link').each(function() {
				if( !$(this).closest('.articles-bloc').length ){
					var image_source = jQuery(this).attr('data-image-url'),
						url = jQuery(this).attr("href");
						isTouch = ark !== undefined ? ark.isMobile() : false;
					if (!isTouch) {
						$(this).qtip({
							content: '<img src="' + image_source + '" class="autocard-hover-image" />',
							position: { target: 'mouse', adjust: { screen: true } },
							style: { width: { min: 245, max: 245 } }
						});
					} else {
						$(this).bind("click", function(evt) {
							jQuery.fancybox.open({
								content   : '<a href="' + url + '" target="_blank" onclick="jQuery.fancybox.close();"><p class="image"><img src="' + image_source + '" alt="" /></p><p class="actions"><button type="button" class="learn-more">See it in the Gatherer</button></p></a>',
								helpers   : { overlay: { locked: true } },
								padding   : 0,
								type      : "html",
								wrapCSS   : "autocard",
								scrolling : "hidden"
							});
							
							evt.preventDefault();
						})
					}
				}
			})
		}
	};
})(jQuery);