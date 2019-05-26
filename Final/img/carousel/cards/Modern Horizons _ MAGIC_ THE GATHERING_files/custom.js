(function ($) {

  var classViewContainer = '.view-id-event_calendar.view-display-id-page_1';

  Drupal.behaviors.seasonalCustom = {
    attach: function (context, settings) {

      var mySwiper = new Swiper('div.swiper-container.seasonalWiz', {
        scrollContainer: true,
        scrollbar: {
          container: '.swiper-scrollbar'
        }
      });
    }
  };


  Drupal.behaviors.calendarMonthCustom = {
    attach: function (context, settings) {

      /***** Events Schedules :: Features Sorting and Filtering on Views Calendar Month  *****/
      //Event select parent term
      $('#event-type .dropdown li').click(function() {

        var tid = $(this).attr('data-value');
        var children = '.parent-tid-' + tid;
        var currentGroupSelect = 'current-group-select';
        var $subtypes = $('#event-subtype .dropdown li');
        var $inputEventSubtype = $('#field-event-type-tid-calender-month-subtype');

        $('#field-event-type-tid-calender-month').val(tid);

        //Hide all event subtypes and unselected child
        $subtypes.removeClass(currentGroupSelect).removeClass('selected');

        if (tid) {
          $(children).addClass(currentGroupSelect);
          Drupal.calendarMonthCustom.addAllInputEventSubTypes();
        }
        //Show all subtype if selected All Event types
        else {
          $subtypes.not(":first").addClass(currentGroupSelect);
        }

        //Intialize value event subtype
        $inputEventSubtype.val($subtypes.first().attr('data-value'));
        $inputEventSubtype.nextAll('span:first').text($subtypes.first().text());

        Drupal.calendarMonthCustom.runAjax();

      });

      $('#event-subtype .dropdown li').click(function() {
        var tid = $(this).attr('data-value');

        $('#field-event-type-tid-calender-month-subtype').val(tid);
        $('.selected-event-subtype-form').remove();

        if (!tid)
          Drupal.calendarMonthCustom.addAllInputEventSubTypes();

        Drupal.calendarMonthCustom.runAjax();
      });

      /***** END Events Schedules :: Features Sorting and Filtering on Calendar Month View *****/

      Drupal.calendarMonthCustom.refresh();

      //Event Apply filter
      $('#views-exposed-form-event-calendar-page-1').submit( function (evt) {
        evt.preventDefault();
        Drupal.calendarMonthCustom.runAjax();
      });

      //Event click next or previous month
      $(document).on('click', classViewContainer + ' .pager li', function (evt) {
        evt.preventDefault();

        //Get next or previous month from pull of the href attribute of the tag a
        var month = $(this).find('a').attr('href').split('/').pop().split('?').shift();

        Drupal.calendarMonthCustom.runAjax(month);
      });
    }
  };

  Drupal.calendarMonthCustom = {};



  /**
   * Refresh color event
   */
  Drupal.calendarMonthCustom.refresh = function() {

    $('.calendar-calendar .event-type-calender-month-link').each( function(){
      var backgroundColor = {'background-color': '#' + $(this).attr('data-color') }
      var $parent = $(this).closest('.calendar.monthview');
      var $clone = $(this).clone();

      $parent.css(backgroundColor).find('div:not(.contents)').css(backgroundColor);
      $clone.html('').removeClass('event-type-calender-month-link').removeAttr('data-color');
      $parent.wrap( $clone );

    });

  }

  /**
   *
   */
  Drupal.calendarMonthCustom.addAllInputEventSubTypes = function(tid) {
    //remove the input subtype created dynamically
    $('.selected-event-subtype-form').remove();

    //Add input subtype dynamically
    $('.current-group-select').each( function() {
      var value = $(this).data('value');
      $('<input>').attr({
        type: 'hidden',
        class: 'selected-event-subtype-form',
        name: 'field_event_type_tid[]',
        value: value,
      }).insertAfter('#field-event-type-tid-calender-month-subtype');

    });
  }

  /**
   * Get form Data
   * @returns {string}
     */
  Drupal.calendarMonthCustom.getFormData = function() {
    var data = '';
    var fields = $('#views-exposed-form-event-calendar-page-1').serializeArray();

    if ( fields.length > 0 ) {
      var fieldWithData = new Array();

      $.each( fields, function( i, field ) {
        if (field && field.value != "") {
          fieldWithData.push( field );
        }
      });

      if ( fieldWithData.length > 0 ) {
        data = $.param( fieldWithData );
      }

    }

    return data;
  }

  /**
   * Call AJAX
   * @param url
   * @param data
   * @param classViewContainer
     */
  Drupal.calendarMonthCustom.runAjax = function(month) {

    var currentLanguage = $(classViewContainer).attr('data-language') || 'en';
    var url = '/' + currentLanguage + '/calendar-node-field-event-date-ajax/month/';
    var data = Drupal.calendarMonthCustom.getFormData();
    var $viewsContainer = $(classViewContainer);
    url += month ? month : $viewsContainer.attr('data-month');

    $viewsContainer.append('<div class="loading"/>');

    $.ajax({
      method: 'GET',
      url: url,
      data: data,
      cache: true,
      success: function(response) {
        var responseData = $(response.data);
        $viewsContainer.replaceWith(responseData.find(classViewContainer));
        $('#event-type-subterm').replaceWith(responseData.find('#event-type-subterm'))
        Drupal.calendarMonthCustom.refresh();
        $viewsContainer.find('.loading').remove();
      }

    });

  }
})(jQuery);