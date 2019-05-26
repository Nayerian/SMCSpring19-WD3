(function ($) {
  Drupal.behaviors.decklist = {
    /**
     * Decklist Charts/Stats Builder
     * Method responsible for building the stats/graphs for the decklist stats feature.
     *
     * @param deck_name str
     *  The name of the deck that we're going to attach the stats to.
     */
    updateCharts: function (deck_name, subid) {
      var element = Drupal.behaviors.decklist.getElementByIdAndSubid(deck_name, subid);
      $(element).find(' .chart').each(function () {
        $(this).html('');
      });

      if(subid != undefined)  {
        // Double stuff fix
        // @todo must find the reason why these data are sometime doubled and fix it, instead of trapping it here.
        if(Drupal.settings.wiz_bean_content_deck_list_stats[deck_name].manacost.counts.length > 8) {
          var nb = Drupal.settings.wiz_bean_content_deck_list_stats[deck_name].manacost.counts.length;
          for(var i = nb - 1; i >= nb/2; i--) {
            Drupal.settings.wiz_bean_content_deck_list_stats[deck_name].manacost.counts.splice(i, 1);
            Drupal.settings.wiz_bean_content_deck_list_stats[deck_name].manacost.labels.splice(i, 1);
          }
        }
        if(Drupal.settings.wiz_bean_content_deck_list_stats[deck_name].color.counts.length > 8) {
          var nb = Drupal.settings.wiz_bean_content_deck_list_stats[deck_name].color.counts.length;
          for(var i = nb - 1; i >= nb/2; i--) {
            Drupal.settings.wiz_bean_content_deck_list_stats[deck_name].color.counts.splice(i, 1);
            Drupal.settings.wiz_bean_content_deck_list_stats[deck_name].color.labels.splice(i, 1);
          }
        }
        if(Drupal.settings.wiz_bean_content_deck_list_stats[deck_name].type.counts.length > 8) {
          var nb = Drupal.settings.wiz_bean_content_deck_list_stats[deck_name].type.counts.length;
          for(var i = nb - 1; i >= nb/2; i--) {
            Drupal.settings.wiz_bean_content_deck_list_stats[deck_name].type.counts.splice(i, 1);
            Drupal.settings.wiz_bean_content_deck_list_stats[deck_name].type.labels.splice(i, 1);
          }
        }

        var idStr = (deck_name != "") ? "#" + deck_name : "";
        wizBar(idStr+ '[subid="' +subid+ '"] .chart.by-manacost', Drupal.settings.wiz_bean_content_deck_list_stats[deck_name].manacost, Drupal.t(''));
        wizPie(idStr+ '[subid="' +subid+ '"] .chart.by-color', Drupal.settings.wiz_bean_content_deck_list_stats[deck_name].color, Drupal.t(''));
        wizPie(idStr+ '[subid="' +subid+ '"] .chart.by-type', Drupal.settings.wiz_bean_content_deck_list_stats[deck_name].type, Drupal.t(''));
      }
    },

    /**
     * Make the Decklist render appropriately with equal heights.
     * @param group
     * @returns {boolean}
     */
    equalHeight: function (deck_target, item) {

      if ($(window).width() < 760) {
        return false;
      }

      if (document.readyState == "complete") {
        var container = $('#' + deck_target);
        // initialize
        container.masonry({
          itemSelector: item
        });
      }
      else {
        $(window).load(function () {
          var container = $('#' + deck_target);
          // initialize
          container.masonry({
            itemSelector: item
          });
        });
      }
    },

    /**
     * Fetch a new samplehand by making an ajax call to an internal URL property.
     *
     * @param link dom
     *  Dom element containing a data-href parameter that we pull out for the ajax call.
     */
    dealSampleHand: function (link, deck_target, subid) {
      // Hid the sample hand that is currently on the screen.

      var $deckContainer = $(Drupal.behaviors.decklist.getElementByIdAndSubid(deck_target, subid));
      var targetBaseElement = $deckContainer.find(".toggle-samplehand");
      var $dataCards = $deckContainer.find(".data-sample-hand-cards");
      var cards = $dataCards ? $.trim($dataCards.html()) : '';

      $(targetBaseElement).find(' a.sample-hand-redeal').html("Loading...");
      $(targetBaseElement).find(' #responsivDIV').remove();

      // Get the url we're going to used to make the ajax callback from the link object passed in.
      var url = link.attr('data-href');

      var callbackUrl = Drupal.settings.basePath + Drupal.settings.pathPrefix + url;

      // Make the ajax call to get the new sample hand so we can write it back to the page.
      $.ajax({
        type: 'POST',
        url: callbackUrl,
        data: {'cards': cards},
        dataType: 'json',
        success: function (data) {
          // Success, yey, we have a response!
          $(targetBaseElement).html('' +
          '<a href="" class="button sample-hand-redeal" data-href="' + url + '">' + Drupal.t('Deal Another Hand') + '</a>' +
          '<div class="sample-hand-carousel"><ul></ul></div>');

          $(targetBaseElement).find(' a.sample-hand-redeal').bind('click', function (event) {
            event.preventDefault();
            Drupal.behaviors.decklist.dealSampleHand($(this), deck_target, subid);
          });

          // Creates each card elements
          for (var i = 0; i < data.length; i++) {
            $(targetBaseElement).find('.sample-hand-carousel ul').eq(0).append('<li data-title="' + data[i].featured_title + '">' + data[i].featured_image + '<br /><span class="label">' + data[i].featured_title + '</span></li>');
          }
		  
          // Creates the cards carousel
          jQuery(targetBaseElement).find('.sample-hand-carousel ul').eq(0).owlCarousel({
            center            : true,
            controlsClass     : "controls",
            dotClass          : "page",
            dots              : false,
            dotsClass         : "pager",
            loop              : false,
            mouseDrag         : false,
            nav               : true,
            navClass          : ["previous", "next"],
            navContainerClass : "nav",
            navText           : ["&lt;","&gt;"],
            responsive        : {
                0:    { items : 1, startPosition: 0 },
                480:  { items : 3, startPosition: 1 },
                768:  { items : 3, startPosition: 1 },
                1024: { items : 4, startPosition: 1 }
              }
          });
      
          // Removes the loading class on the container
          $(targetBaseElement).removeClass("loading");
        }
      });
    },

    /**
     * Toggle between multiple decks that currently live on the page. This method gets
     * invoked when the "Select Deck" select element is changed.
     *
     * @param deck_target string
     *  The option that was chosen during the select change. Tells us which deck to show.
     *
     * @see local method attach:
     */
    deckChange: function (selected_deck_name, subid) {
      var element = Drupal.behaviors.decklist.getElementByIdAndSubid(selected_deck_name, subid);

      // Hide all deck groups when this is initially activated.
      $(element).parent('.content').find('.deck-group').hide();

      // Show selected deck group passed in.
      $(element).show();

      $(element).find(' select.sort-decklist').each(function () {
        this.selectedIndex = 0;
      });

      $(element).find('div.sortedContainer').hide();
      $(element).find('div.sortedContainer:eq(0)').show();

      $(element).find('.toggle-text').show();
      $(element).find('.subNav .decklist').addClass('active');

      // HANDLE HOVER STATES FOR EACH CARD LINK
      $(element).find('.deck-list-link').hover(function (event) {
        event.preventDefault();
        Drupal.behaviors.decklist.cardHover(selected_deck_name, subid, $(this));
      },
      function () {
        Drupal.behaviors.decklist.cardUnhover(selected_deck_name, subid);
      });
      Drupal.behaviors.decklist.equalHeight(selected_deck_name + " .sorted-by-overview-container", '.masonry');
      Drupal.behaviors.decklist.updateCharts(selected_deck_name, subid);
      Drupal.behaviors.hoverFuncDecklist.attach();

      $('#' + selected_deck_name).find('a.sample-hand-redeal').on('click', function (event) {
        event.preventDefault();
        Drupal.behaviors.decklist.dealSampleHand($(this), selected_deck_name, subid);
      });
    },

    /**
     * Provides functionality that displays the card currently being hovered in the decklist.
     * @param card
     */
    cardHover: function (deck_target, subid, card) {
        var data_src = $(card).attr('data-src');
        var data_original = $(card).attr('data-src');
        var data_mp4 = $(card).attr('data-mp4');
        var data_webm = $(card).attr('data-webm');
        var data_gif = $(card).attr('data-gif');
        // Getting the element by its id AND subid to prevent problems with the same id multiple time
        var element = Drupal.behaviors.decklist.getElementByIdAndSubid(deck_target, subid);
        if (data_mp4.search(".mp4") < 0) {
            $(element).find('.deck-list-img .card-image video').remove();
            $(element).find('.deck-list-img .card-image img').remove();
            $(element).find('.deck-list-img .card-image').append('<img src="' + data_src + '" data-original="' + data_original + '">');
        } else {
            $(element).find('.deck-list-img .card-image video').remove();
            $(element).find('.deck-list-img .card-image img').remove();
            $(element).find('.deck-list-img .card-image').append('<video autoplay="autoplay" muted="muted" loop="loop" width="223px" poster="' + data_original + '"><source type="video/webm" src="' + data_webm + '"><source type="video/mp4" src="' + data_mp4 + '"><img src="' + data_gif + '" data-original="' + data_original + '"></video>');
            setTimeout(function() {
	            ark.handleVideoCards($(element).find(".deck-list-img")[0]);
            }, 1);
        }
    },

    cardUnhover: function (deck_target, subid) {
      var element = Drupal.behaviors.decklist.getElementByIdAndSubid(deck_target, subid);
      var data_original = $(element).find('.deck-list-img img').attr('data-original');
      if (data_original.length > 0) {
        // Getting the element by its id AND subid to prevent problems with the same id multiple time
        $(element).find('.deck-list-img img').attr('src', data_original);
        //$('#' + deck_target).find('.deck-list-img img').attr('src', data_original);
      }
    },

    /**
     * Implement attach method on this behavior.
     * @param context
     * @param settings
     */
    attach: function (context, settings) {

      // Iterate through all decks that are on the current page.
      $('div.bean_block_deck_list').each(function () {

        // Make sure the deck has some data before we attempt to parse it.
        if ($(this).length > 0) {

          // Obtain the deck ID for this deck group so we can target it directly. Works in parallel
          // with the parent_portal_wrapper where needed.
          var deck_name = $(this).find('.deck-group').attr('id');
          var subid = $(this).find('.deck-group').attr('subid');

          // UPDATE CHARTS FOR THIS DECK
          // ----------------------------------------------------------------------------
          Drupal.behaviors.decklist.updateCharts(deck_name, subid);

          // UPDATE EQUAL MASONRY HEIGHTS FOR THIS DECK
          // ----------------------------------------------------------------------------
          Drupal.behaviors.decklist.equalHeight(deck_name + " .sorted-by-overview-container", ".masonry");

          $(this).find('.deck-group:eq(0)').show();
          $(this).find('#edit-deck-list-sort-by option:eq(0)').attr("selected", "selected");

          // HANDLE DECKLIST DECK TOGGLE FROM SELECT LIST WHEN AVAILABLE (FOR MULTIPLE DECKS)
          // ----------------------------------------------------------------------------
          $(this).find('.selectDeck select').change(function () {
            var selected_deck_name = $(this).find('option:selected').attr('value');
            Drupal.behaviors.decklist.deckChange(selected_deck_name, subid);
          });

          // HANDLE DECKLIST TOGGLE FOR DISPLAY MODE (OVERVIEW, COLOR, COST, ETC)
          // ----------------------------------------------------------------------------
          $(this).find('select.form-select').change(function () {
            var display = $(this).find("option:selected").val().toLowerCase();
            var parent_group = $(this).closest('.deck-group');
            parent_group = $(parent_group).attr('id');
            $('#' + parent_group).find('div.sortedContainer').hide();
            $('#' + parent_group).find('.sorted-by-' + display + '-container').show();

            // Sideboard block display based on display type.
            if (display == 'overview') {
              $('#' + parent_group).find(".sorted-by-sideboard-container").show();
            }
            else {
              $('#' + parent_group).find(".sorted-by-sideboard-container").hide();
            }

            // Time to re-masonry the board.
            Drupal.behaviors.decklist.equalHeight(deck_name + " .sorted-by-" + display + "-container", ".masonry");
          });

          // HANDLE HOVER STATES FOR EACH CARD LINK
          // ----------------------------------------------------------------------------
          $(this).find('.deck-list-link').hover(function (event) {
            event.preventDefault();
            Drupal.behaviors.decklist.cardHover(deck_name, subid, $(this));
          },
          function () {
            Drupal.behaviors.decklist.cardUnhover(deck_name, subid);
          });

            // make commander title display image
          $(this).find('.commander-card-header').hover(function (event) {
            event.preventDefault();
             var data_original = $('#' + deck_name).find('.deck-list-img img').attr('data-original');
             if (data_original.length > 0) {
               $('#' + deck_name).find('.deck-list-img img').attr('src', data_original);
             }
          });
		
		
		// Adds a click event that opens the card in a lightbox when screen is too small
		// ----------------------------------------------------------------------------
		jQuery(this).find(".deck-list-link").click(function(e) {
			var showUnderWidth = 768;
			
			if ( document.documentElement.offsetWidth < showUnderWidth ) {
				
				var htmlContent   = '<a href="' + $(this).attr("href") + '" target="_blank">',
					data_src      = $(this).attr("data-src"),
					data_original = $(this).attr("data-src"),
					data_mp4      = $(this).attr("data-mp4"),
					data_webm     = $(this).attr("data-webm"),
					data_gif      = $(this).attr("data-gif");
				
				if (data_mp4.search(".mp4") < 0) {
					htmlContent += '<img src="' + data_src + '" data-original="' + data_original + '" alt="" />';
				} else {
					htmlContent += '<a href="' + $(this).attr("href") + '"><video autoplay="autoplay" muted="muted" loop="loop" width="223px" poster="' + data_original + '"><source type="video/webm" src="' + data_webm + '"><source type="video/mp4" src="' + data_mp4 + '"><img src="' + data_gif + '" data-original="' + data_original + '"></video>';
					setTimeout(function() {
						ark.handleVideoCards($(element).find(".deck-list-img")[0]);
					}, 1);
				}
				
				htmlContent += '</a>';
				
				
				jQuery.fancybox.open({
					content: htmlContent,
					padding: 0,
					wrapCSS: "decklist-mobile-lightbox"
				});
				
				e.preventDefault();
			} else {
				if ( ark.isMobile() && !(/iPhone|iPad|iPod/i).test(navigator.userAgent) ) {
					if ( $(this)[0] !== window.decklistClickedItem ) {
						window.decklistClickedItem = $(this)[0];
						e.preventDefault();
					} else {
						window.decklistClickedItem = null;
					}
				}
			}
		});
		
		
		// Tracks each link to the gatherer
		// ----------------------------------------------------------------------------
		$(this).find('.deck-list-link').click(function() {
			try {
				ga('send', 'event', 'Gatherer', $(this).html(), $(this).attr("href"));
			} catch(e) {
				console.error(e, ['_trackEvent', 'Gatherer', $(this).html(), $(this).attr("href")]);
			}
		});

          // DISABLE ALL CARD LINKS
          // ----------------------------------------------------------------------------
          //$(this).find(".deck-list-link").on("click", function (event) {
          //  event.preventDefault();
          //});

          // HANDLE DECKLIST SUBNAV TOGGLE (DECKLIST, STATS, SAMPLE HAND)
          // ----------------------------------------------------------------------------
          $(this).find(".subNav a").bind("click", function (event) {
            event.preventDefault();
          });

          // HANDLE RE-DEAL BUTTON ACTION
          // ----------------------------------------------------------------------------
          $(this).find('a.sample-hand-redeal').bind('click', function (event) {
            event.preventDefault();
            Drupal.behaviors.decklist.dealSampleHand($(this), deck_name, subid);
          });
        }
      });
    },
    getElementByIdAndSubid: function(id, subid) {
      var idStr = (id != "") ? "#" + id : "";
      return $(idStr + "[subid='" +subid+ "']");
    }
  };


  Drupal.behaviors.hoverFuncDecklist = {
    attach: function (context, settings) {

      if ($(window).width() < 765) {
        return false;
      }

      $('div.chart.by-type, div.chart.by-color').each(function () {

        $(this).find('.tick').each(function (i) {
          $(this).attr('class', $(this).attr('class') + ' wizhvr_' + i).hide();
        });

        $(this).find('.icon-bg').each(function (i) {
          $(this).attr('class', $(this).attr('class') + ' wizhvr_' + i).hide();
        });

        $(this).find('text.label').each(function (i) {
          $(this).attr('class', $(this).attr('class') + ' wizhvr_' + i).hide();
        });

        $(this).find('text.data').each(function (i) {
          $(this).attr('class', $(this).attr('class') + ' wizhvr_' + i).hide();
        });

        $(this).find('.iconsimg').each(function (i) {
          $(this).attr('class', $(this).attr('class') + ' wizhvr_' + i).hide();
        });
        $(this).find('.multi-dots').each(function (i) {
          $(this).attr('class', $(this).attr('class') + ' wizhvr_' + i).hide();
        });

        $(this).find('path').each(function (i) {
          $(this).attr('class', 'wizhvr_' + i);
        });

      });

      $('div.chart.by-type, div.chart.by-color').find('path').hover(function () {

        var activeClass = $(this).attr('class');
        $(this).closest('div.chart').find('.' + activeClass).show();
      }, function () {
        var activeClass = $(this).attr('class');
        $(this).closest('div.chart').find('g.icons .' + activeClass).hide();
      });

    }
  };


  Drupal.behaviors.toggleDecklist = {
    attach: function (context, settings) {
      $('div.bean_block_deck_list').each(function () {
        // SHOW INITIAL GROUPS
        $(this).find('.toggle-subnav:eq(0)').show();
        $(this).find('.subNav > a:eq(0)').addClass('active');

        // HANDLE CLICK EVENTS TO TOGGLE TABS
        $(this).find('.subNav > a').bind("click", function (event) {
          if ($(this).hasClass("active")) return false;
          var parent_group = $(this).parents('.deck-group');
          var deck_name = parent_group.attr("id");
          $(parent_group).find('.subNav > a').removeClass('active');
          $(this).addClass('active');
          var currIndex = $(this).index();
          parent_group.children('.toggle-subnav').hide();
          parent_group.children('.toggle-subnav').eq(currIndex).show();
          $(parent_group).find('a.sample-hand-redeal').trigger("click");
          Drupal.behaviors.decklist.equalHeight(deck_name + " .sorted-by-overview-container", '.masonry');
        });
      });
    }
  };
})(jQuery);




window.addEventListener("load", function() {
	function placeDecklistCard() {
		var cards = document.querySelectorAll(".deck-list-img"),
			cardTopMargin = 65,
			cardBottomMargin = 15,
			cardRect, contentElement, contentElementRect, nextPos;
		
		for ( var i = 0; i < cards.length; i++ ) {
			contentElement = cards[i].parentNode.querySelector(".deck-list-text");
			cardRect = cards[i].getBoundingClientRect();
			contentElementRect = contentElement.getBoundingClientRect();
			
			if (cards[i].originalTop === undefined)
				cards[i].originalTop = cards[i].offsetTop;
			
			if ( contentElementRect.top < cardTopMargin ) {
				nextPos = -contentElementRect.top + cards[i].originalTop + cardTopMargin;
				
				if (nextPos + cardRect.height + cardBottomMargin >= contentElementRect.height + cards[i].originalTop)
					nextPos = contentElementRect.height - cardRect.height + cards[i].originalTop - cardBottomMargin;
			} else {
				nextPos = cards[i].originalTop;
			}
			
			cards[i].style.top = String(nextPos) + "px";
		}
	}

	
	if ( document.querySelector(".deck-list-img") ) {
		window.addEventListener("load", placeDecklistCard, false);
		window.addEventListener("scroll", placeDecklistCard, false);
		window.addEventListener("resize", placeDecklistCard, false);
	}	
}, false);

function wiz_bean_content_deck_list_generate_file(obj) {
  var breakStr = "[b]";
  var output = "";
  var decklist = obj.parentNode.parentNode;
  var vCard = decklist.querySelectorAll(".sorted-by-overview-container .row");
  var vSideboard = decklist.querySelectorAll(" .sorted-by-sideboard-container .row");
  for(var i = 0; i < vCard.length; i++)
  {
    var count = vCard[i].querySelector(".card-count").innerHTML;
    var name = vCard[i].querySelector(".card-name a").innerHTML;
    output += count + " " + name + breakStr;
  }
  output += breakStr + breakStr;
  for(var i = 0; i < vSideboard.length; i++)
  {
    var count = vSideboard[i].querySelector(".card-count").innerHTML;
    var name = vSideboard[i].querySelector(".card-name a").innerHTML;
    output += count + " " + name + breakStr;
  }
  var title = decklist.querySelector(".deck-meta h4").innerHTML;
     
  $form = jQuery(obj).prev("form");
  jQuery("input[name='title']",$form).val(encodeURIComponent(title));
  jQuery("input[name='content']",$form).val(encodeURIComponent(output));
  jQuery($form).submit();
}

function wiz_bean_content_deck_list_safe_str(str) {
  str = str.replace("/", "\/");
  return str;
}