jQuery(document).ready(function($) {
  $("img").unveil(800);
});

/**
 * Events Customize Drupal
 */
function redirect(){
    return true;
}

/**
 *
 * discuss at: http://phpjs.org/functions/array_diff/
 * original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
 * improved by: Sanjoy Roy
 *  revised by: Brett Zamir (http://brett-zamir.me)
 *   example 1: array_diff(['Kevin', 'van', 'Zonneveld'], ['van', 'Zonneveld']);
 *   returns 1: {0:'Kevin'}
 *
 * @param arr1
 * @returns {{}}
 */
function array_diff(arr1) {


    var retArr = new Array(),
        argl = arguments.length,
        k1 = '',
        i = 1,
        k = '',
        arr = {};

    arr1keys: for (k1 in arr1) {
        for (i = 1; i < argl; i++) {
            arr = arguments[i];
            for (k in arr) {
                if (arr[k] === arr1[k1]) {
                    // If it reaches here, it was found in at least one array, so try next value
                    continue arr1keys;
                }
            }
            retArr.push(arr1[k1]);
        }
    }

    return retArr;
}

jQuery.noConflict();
(function( $, Drupal ) {
    $(function() {

        $('#filter-by .dropdown li').click(function() {
            var filter = ['section', 'person', 'deck', 'event'],
                url = '/filter/by/taxonomy',
                language = $('input[name=l]').val(),
                contentType = $(this).data('value'),
                data = 'filter='  + contentType + '&' + 'l=' + language,
                dropdownElement = document.getElementById("and-by"),
                ul = dropdownElement.querySelector("ul.dropdown"),
                li;

            if (contentType === 'all') {
                $('#custom-search-submit').attr('data-type', 'apache-solr');
            } else {
                $('#custom-search-submit').attr('data-type', '');
            }
            while(ul.childNodes.length)
                ul.removeChild(ul.firstChild);

            // Creates the ANY option
            li = document.createElement("li");
            li.setAttribute("data-value", "-1");
            li.appendChild(document.createTextNode(dropdownElement.attributes.getNamedItem("data-default-label") ? dropdownElement.attributes.getNamedItem("data-default-label").value : "ALL"));
            ul.appendChild(li);

            if ( $.inArray( contentType, filter ) != -1 ) {
                $.getJSON(
                    url,
                    data,
                    function( response ) {
                        for ( var i = 0; i < response.length; i++ ) {
                            li = document.createElement("li");
                            li.setAttribute("data-value", response[i].nid);
                            li.appendChild(document.createTextNode(response[i].name));
                            ul.appendChild(li);
                        }
                        $('#and-by').parent().removeClass('filter-inactive');
                        dropdownElement.dropdown.update();
                    }
                );
            } else {
                $('#and-by').parent().addClass('filter-inactive');
                dropdownElement.dropdown.update();
            }

        });

        $("#event-filter .dropdown li").click(function() {
            var dropdownElement = document.getElementById("and-by"),
            ul = dropdownElement.querySelector("ul.dropdown"),
            li;

            while(ul.childNodes.length)
                ul.removeChild(ul.firstChild);

            // Creates the ANY option
            li = document.createElement("li");
            li.setAttribute("data-value", "-1");
            li.appendChild(document.createTextNode(dropdownElement.attributes.getNamedItem("data-default-label") ? dropdownElement.attributes.getNamedItem("data-default-label").value : "ALL"));
            ul.appendChild(li);
            dropdownElement.dropdown.update();
        });

        /**
         * show or hide button the bottom of the search list
         * @param data
         */
        $.fn._showHideSeeMore = function(data, valueIntialOffset) {

            if(data.displaySeeMore == 0) {
                //Initialize offset query
                $(this).attr("data-offset", valueIntialOffset);
                $(this).hide();
            }else {
                $(this).show()
            }
        };



        function convertedDate (inputDate, to) {

            //[2014-09-01T00:00:00Z TO 2014-10-01T00:00:00Z]
            if(inputDate) {
                var dateSplit = Array();
                dateSplit = inputDate.split('/');
                if(to) {
                    var date = new Date(dateSplit[2], dateSplit[0] - 1, dateSplit[1]);
                    date.setDate(date.getDate() + 1);
                    dateSplit = ($.datepicker.formatDate('mm/dd/yy', date)).split('/');
                }
                return dateSplit[2] + '-' + dateSplit[0] + '-' + dateSplit[1] + 'T00:00:00Z';
            }
            return '';
        }

        function validatedate(inputText)
        {
            var dateformat = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/;
            // Match the date format through regular expression
            if(inputText.match(dateformat))
            {
                //Test which seperator is used '/' or '-'
                var opera1 = inputText.split('/');
                lopera1 = opera1.length;
                // Extract the string into month, date and year
                if (lopera1>1)
                {
                    var pdate = inputText.split('/');
                }
                var mm  = parseInt(pdate[0]);
                var dd = parseInt(pdate[1]);
                var yy = parseInt(pdate[2]);
                // Create list of days of a month [assume there is no leap year by default]
                var ListofDays = [31,28,31,30,31,30,31,31,30,31,30,31];
                if (mm==1 || mm>2)
                {
                    if (dd>ListofDays[mm-1])
                    {
                        return false;
                    }
                }
                if (mm==2)
                {
                    var lyear = false;
                    if ( (!(yy % 4) && yy % 100) || !(yy % 400))
                    {
                        lyear = true;
                    }
                    if ((lyear==false) && (dd>=29))
                    {
                        return false;
                    }
                    if ((lyear==true) && (dd>29))
                    {
                        return false;
                    }
                }
            }
            else
            {
                return false;
            }

            return true;
        }

        function compareDate(dateFrom, dateTo) {
            var date1 = dateFrom.split('/'),
                date2 = dateTo.split('/');
            var dateFrom = new Date(date1[2], date1[0], date1[1]); //Year, Month, Date
            var dateTo = new Date(date2[2], date2[0], date2[1]);

            return dateTo >= dateFrom;
        }

        /**
         * Search Ajax see more list
         */
        $('.see-more-article-listing').click( function (){
            var url = $(this).data('url'),
                offset = $(this).attr('data-offset'),
                data = $('#custom-search').serialize(),
                currentElement = $(this)
                ;
            $('.see-more-article-listing > p').addClass('loading');
            $.getJSON(
                url,
                data + '&offset=' + offset,
                function( response ) {
                    $('.see-more-article-listing').attr("data-offset", response.offset);
                    if (response.data.length>0) {
                        $('.articles-listing').append(response.data.join( "" ));
                    }
                    currentElement._showHideSeeMore(response, 10);
                    currentElement.children('p:first').removeClass('loading');
                }
            );
        });

        /**
         * Search Ajax see more list
         */
        $('.see-more-article-listing-section').click( function (){
            var searchLimit = $('#custom-search input[name=limit]').val();
            var seeMoreLimit = $(this).attr('data-see-more-limit');
            var swapLimitValue = searchLimit != undefined && seeMoreLimit != undefined && searchLimit != seeMoreLimit;
            if (swapLimitValue) {
                $('#custom-search input[name=limit]').val(seeMoreLimit);
            }
            var url = $(this).data('url'),
                offset = $(this).attr('data-offset'),
                data = $('#custom-search').serialize(),
                currentElement = $(this),
                from = '',
                to = ''
                ;
            if (swapLimitValue) {
                $('#custom-search input[name=limit]').val(searchLimit);
            }
            var dataForm = $(this).parents('form').serializeArray();
            for(var key in dataForm) {//treat as key->value array
                if (dataForm[key].name == 'fromDate') {
                    from = dataForm[key].value;
                }
                if (dataForm[key].name == 'toDate') {
                    to = dataForm[key].value;
                }
            }

            //return false;
            if((from && !validatedate(from)) || (to && !validatedate(to))) {
                alert('Invalid date format!');
                return false;
            }

            if(from && to && !compareDate(from, to)) {
                alert('TO must be greater than or equal to FROM');
                return false;
            }

            $('.see-more-article-listing-section > p').addClass('loading');
            $.getJSON(
                url,
                data + '&offset=' + offset,
                function( response ) {
                    $('.see-more-article-listing-section').attr("data-offset", response.offset);
                    if (response.data.length>0) {
                        $('.articles-listing, .articles-listing-as-blocks--list, .module_articles-listing-list--list--items').append(response.data.join( "" ));
                    }
                    currentElement._showHideSeeMore(response, 10);
                    currentElement.children('p:first').removeClass('loading');
                }
            );
        });

        /**
         * Search form Section list Article
         */
        $('.see-more-article-listing-section-search').click( function (){
            var url = $(this).data('url'),
                offset = $(this).attr('data-offset'),
                data = $(this).parents('form').serialize(),
                currentElement = $(this),
                from = '',
                to = ''
                ;
            var dataForm = $(this).parents('form').serializeArray();
            for(var key in dataForm) {//treat as key->value array
                if (dataForm[key].name == 'fromDate') {
                    from = dataForm[key].value;
                }
                if (dataForm[key].name == 'toDate') {
                    to = dataForm[key].value;
                }
            }

            //return false;
            if((from && !validatedate(from)) || (to && !validatedate(to))) {
                alert('Invalid date format!');
                return false;
            }
            if(from && to && !compareDate(from, to)) {
                alert('TO must be greater than or equal to FROM');
                return false;
            }

            $(this).children().addClass('loading');
            $.getJSON(
                url,
                data + '&offset=' + offset,
                function( response ) {
                    var elementDisplaySeeMore =currentElement.parents('.articles-filters').nextAll('.see-more-article-listing-section');
                    if (response.data.length>0) {
                        currentElement.parents('.articles-filters').next().html(response.data.join( "" ));
                    } else {
                        currentElement.parents('.articles-filters').next().html('<p class="no-result">no result found</p>');
                        elementDisplaySeeMore.hide();
                    }
                    if (response.displaySeeMore == 0) {
                        elementDisplaySeeMore.hide();
                    }
                    currentElement.parents('.articles-filters').nextAll('.see-more-article-listing-section').attr('data-offset', 6);
                    currentElement.children().removeClass('loading');
                }
            );
        });

        /**
         * Search All Ajax
         */
        $('#custom-search-submit:input[type=button]').click( function (){
            var langcode = $('#custom-search input[name=l]').val();
                url = '/' + langcode + '/search-magic-ajax',
                data = $('#custom-search').serialize(),
                urlApacheSolr = $(this).data('url'),
                from = $('#datepickerFrom').val(),
                to = $('#datepickerTo').val()
            ;
            if($(this).parent().hasClass('see-more-article-listing-section-search')) {
                return;
            }
            if((from && !validatedate(from)) || (to && !validatedate(to))) {
                alert('Invalid date format!');
                return false;
            }

            if(from && to && !compareDate(from, to)) {
                alert('TO must be greater than or equal to FROM');
                return false;
            }

            if ($(this).attr('data-type') === 'apache-solr') {

                var fromDate = convertedDate(from),
                    toDate = convertedDate(to, true),
                    sort = 'solrsort=',
                    word = $('#search-word').val(),
                    finalDate = '',
                    formData = word,
                    currentLanguage = $('#search-current-language').val();

                //Redirect page search if search word is empty
                if (word == '') {
                    window.location.href = urlApacheSolr.substring(0, urlApacheSolr.length-1);
                    return false;
                }
                sort+= $('#sort').val() === 'alphabet' ? 'sort_label asc' : 'ds_created ' + $('#sort').val().toLowerCase();
                formData+= '?f[0]=' + 'ss_language:' + currentLanguage;
                formData+= '&' + encodeURI(sort);


                if (fromDate && toDate) {
                    finalDate = fromDate + ' TO ' + toDate;
                } else if (fromDate) {
                    finalDate = fromDate + ' TO 2020-01-01T00:00:00Z';
                } else if (toDate) {
                    finalDate = '2000-01-01T00:00:00Z TO ' + toDate;
                } else {
                    finalDate = '';
                }

                if (finalDate) {
                    formData+= '&f[1]=' + 'ds_created:'+ '[' + encodeURI(finalDate) + ']';
                }

                window.location.href = urlApacheSolr + formData;

            } else {
                $(this).addClass('loading');
                var currentElement = $(this);
                $('#pager-search-apache-solr-custom').remove();
                $.get(
                    url,
                    data,
                    function( response ) {
                        if (response.data.length > 0) {
                            $('.articles-listing').html(response.data.join( "" ));
                        }else {
                            $('.articles-listing').html('<p class="no-result">no result found</p>');
                        }
                        currentElement.removeClass('loading');
                        $('.see-more-article-listing')._showHideSeeMore(response, 10);
                    }
                );
            }
        });

        /**
         * Event onclick submit reset : gameinfo/products/magiconline/descklist
         */
        if($('#views-exposed-form-wiz-mtgo-standings-panel-pane-1 #edit-reset').length) {
            $('#views-exposed-form-wiz-mtgo-standings-panel-pane-1 #edit-reset').live("click",function() {
                $('#views-exposed-form-wiz-mtgo-standings-panel-pane-1 .form-select').val('');
                $('#views-exposed-form-wiz-mtgo-standings-panel-pane-1 .form-checkbox').val('');
                $('#views-exposed-form-wiz-mtgo-standings-panel-pane-1 #edit-created-min').val('');
                $('#views-exposed-form-wiz-mtgo-standings-panel-pane-1 #edit-created-max').val('');
                $('#views-exposed-form-wiz-mtgo-standings-panel-pane-1 #edit-created-min').trigger('change');

            });
            $('#views-exposed-form-wiz-mtgo-standings-panel-pane-1').live("submit",
                function(e) {
                    return false;
                }
            );
        }

        /**
         * Send form on press enter
         */
        $('#custom-search').keypress(function(e){
            if (e.which === 13) {
                $('#custom-search-submit:input[type=button]').click();
            }

        });

        /**
         * Ajax Widget date browser pane see more
         */
        $(document).on('click', '.see-more-article-of-the-day', function(){

            var url = $(this).data('url'),
                config = $(this).attr('data-config'),
                offset = $(this).attr('data-offset'),
                language = $(this).attr('data-language'),
                startDate = $(this).attr('data-startdate'),
                queryDate = $(this).attr('data-querydate'),
                lastSlide = $.trim($(this).next().val()),
                currentElement = $(this)
            ;

            currentElement.children('p:first').addClass('loading');

            $.getJSON(
                url,
                config + '&offset=' + offset +
                    '&language=' + language +
                    '&start_date=' + startDate +
                    '&query_date=' + queryDate +
                    '&last_slide=' + lastSlide,
                function( response ) {

                    currentElement.attr("data-offset", response.offset);

                    if (response.nidExclude != '' )
                    {
                        currentElement.attr("data-nidexclude", response.nidExclude);
                    }
                    if (response.data.length>0) {
                        currentElement.prev().append(response.data.join( "" ));
                    }
                    currentElement._showHideSeeMore(response, 10);
                     currentElement.children('p:first').removeClass('loading');
                }
            );

        });

        /**
         * Article of the day Ajax see more
         */
        $('.see-more-latest-mtgo-articles').click( function(){

            var url = $(this).data('url')
                ,offset = $(this).attr('data-offset')
                ,currentElement = $(this)
                ,dataForm = $('#see-more-latest-mtgo-articles').serialize();
            ;

            currentElement.children('p:first').addClass('loading');

            $.getJSON(
                url,
                dataForm + '&offset=' + offset,
                function( response ) {

                    currentElement.attr("data-offset", response.offset);
                    if (response.data.length>0) {
                        currentElement.prev().append(response.data.join( "" ));
                    }
                    currentElement._showHideSeeMore(response, 12);
                    currentElement.children('p:first').removeClass('loading');
                }
            );

        });

        /**
         * Display list article
         */
        $('.show-more-expand').click( function(){
            var articlePerIter = 3;
            var articleHide = $(this).prev('.articles-listing , .hybrid-articles-listing').find('.article-expand-hide');
            articleHide.each( function(index) {
                $(this).show().removeClass('article-expand-hide');
                if (index == (articlePerIter - 1)) {
                    return false;
                }
            });

            articleHide = $(this).prev('.articles-listing , .hybrid-articles-listing').find('.article-expand-hide');
            if (articleHide.length == 0) {
                $(this).hide();
                return false;
            }

        });

        /**
         * Add class current on menu nav premier calender : Overview and List
         */
        $('.subsection_events_schedules_premier .display-switch a').click( function(){
           $('.subsection_events_schedules_premier .display-switch a').not(this).removeClass('active').toggle
           $(this).addClass('active');

           $(this).nextAll('a').removeClass('active');
           $(this).prevAll('a').removeClass('active');
        });

        /**
         * Event click : show Author biography
         */
        $('.article-author-biography').click( function(){
            $('#author-biography').show();
        });


        /**
         * -----------------------LEGACY CONTENT----------------------
         **/
        //Delete column empty td:empty
        $('.legacy_content table').each( function() {
            var indexElementEmpty = new Array();
            $('tr:first td', $(this)).each( function(index) {
                if ($(this).html().trim() == '') {
                    indexElementEmpty.push(index);
                }
            });

            if (indexElementEmpty.length > 1) {
                //Census of empty cells in table
                var cellNotEmpty = new Array();
                for (var i = 0; i < indexElementEmpty.length; i++) {
                    $('tr:not(:first)', $(this)).each( function(index) {
                        var indexColumn = indexElementEmpty[i];
			var contentTd = $('td:eq(' + indexColumn + ')', $(this)).html().trim();
                        if (typeof contentTd !== 'undefined') {
                            if (contentTd != '') {
                                cellNotEmpty.push(indexColumn);
                                return false;
                            }
                        }
                    });
                }

                //Deleting columns with empty cells
                var emptyColumn = typeof cellNotEmpty === 'undefined' ? indexElementEmpty : array_diff(indexElementEmpty, cellNotEmpty);
                if (emptyColumn.length > 0) {
                    emptyColumn.reverse();
                    $('tr', $(this)).each( function(index) {
                        for (var i = 0; i < emptyColumn.length; i++) {
                            var cellIndex = emptyColumn[i];
                            $(this).find('td:eq(' + cellIndex + ')').remove();
                        }
                    });

                }
            }

        });

        $('.legacy_content hr').remove();

        $('.legacy_content iframe[src*="https://www.coveritlive.com"]').attr('style',
            "height: 550px !important; " +
                "width: 610px !important; " +
                "max-width: 100% !imporant; " +
                "margin: 0 auto !important; " +
                "display: block !important; " +
                "overflow: auto !important;");

        $('.legacy_content .revealer img[class*="magic-card"][exception="yes"][alt~="//"]:not([src*="&options=rotate90"])').each(function() {
            $(this).attr('src', $(this).attr('src') + "&options=rotate90");
        });

		//Wrap card images in legacy content with <a> to http://gatherer.wizards.com/
		 $('.legacy_content img[src^="http://gatherer.wizards.com/Handlers/"]').each(function() {
			var imgUrl = $(this).attr('src');
			var key = 'name';
			var query_string = imgUrl.split('?');
			var string_values = query_string[1].split('&');
			for(i=0; i < string_values.length; i++){
				if( string_values[i].match(key)){
					req_value = string_values[i].split('=');
				}
			}
			var cardName = req_value[1];
		    $(this).wrap("<a target='_blank' href='http://gatherer.wizards.com/Pages/Card/Details.aspx?name=" + cardName + "'></a>");
        });

        /** End legacy **/

        $('.calendar-calendar table').addClass('no-script');
        $('.adaptable-table table').addClass('no-script');
        $('table:not(.no-script)').each(function() {

            $(this).wrap('<div class="rankings-table with-scroll"><div class="scrollbar-outer">');
            if(!$(this).hasClass('sortable-table')) {
                $(this).addClass('responsive-table large-only');
            }

            if ( $(this).find("thead").length === 0 ) {
                if($('tr', $(this)).length>1) {
                    $(this).prepend('<thead/>');
                    $(this).find('tr:first').appendTo($(this).find("thead"));
                    $(this).find('tr:first td').replaceWith(function(){
                        return $("<th />", {html: $(this).html()});
                    });
                } else {
                    $('tr', $(this)).children(':first').addClass('table-content-tr-unique');
                }
            }
        });

        $('.set-card-of-the-day-select select').change( function() {
            $(this).parents('form').submit();
        });

        $('.block_bean_upper_tabbed_with_field_select ul').addClass('list-links');

        $('.block_bean_upper_tabbed_with_field_select select').change( function(){
            var containerView = $(this).parents('.selectDeck').next();
            containerView.children().removeClass('active');
            containerView.find('[data-view="' + $(this).val() + '"]').addClass('active');
        });

        /**
         * Hall of fame
         */
        $(".yearReview").each(function() {
            var count = $(".article", $(this)).length;
            $(".article", $(this)).width(String(100/count) + "%");
        });

        /**
         * Wallpaper Ajax see more
         */
        $('.see-more-wallpaper').click( function(){

            var url = $(this).data('url'),
                page = $(this).attr('data-page'),
                currentElement = $(this),
                formData = $("#form-search-wallpaper").serialize(),
                isPodcast = $(this).attr('data-podcast')
                ;

            currentElement.children('p:first').addClass('loading');

            $.getJSON(
                url,
                'page=' + page + '&' + formData,
                function( response ) {

                    currentElement.attr("data-page", response.page);
                    if (response.data.length>0) {
                        if(isPodcast) {
                            currentElement.prev().append(response.data);
                            ark.PodcastListItem.initAll();
                        } else {
                            currentElement.prev().children('ul').append(response.data);
                        }
                    }
                    currentElement._showHideSeeMore(response, 6);
                    currentElement.children('p:first').removeClass('loading');
                    if(!isPodcast) {
                        window.ark.wallpaperGrid();
                        window.ark.assingSocialButton();
                    }
                }
            );

        });

        /**
         * Wallpaper Ajax see more
         */
        $('#form-search-wallpaper input:button, #form-search-wallpaper input:reset').click( function(){

            //Intialize form data if input reset
            if ($(this).attr('type') == 'reset') {
                $("#form-search-wallpaper input:text").val("");
                $("#form-search-wallpaper input[type=hidden][name=filter_by]").val("DESC");
                var inputArtist = $("#form-search-wallpaper input[type=hidden][name=artist]");
                inputArtist.val("-1");
                inputArtist.next().text($('#and-by').attr('data-default-label'));
                $('#sort-by .dropdown li').removeAttr('class');
                var sortNewest = $('#sort-by .dropdown li:first');
                sortNewest.addClass('selected');
                $('#sort-by span').text(sortNewest.text());
            }
            var url = $('.see-more-wallpaper').attr('data-url'),
                page = 1,
                currentElement = $(this),
                formData = $("#form-search-wallpaper").serialize(),
                isPodcast = $('.see-more-wallpaper').attr('data-podcast')
                ;
            currentElement.addClass('loading');
            $.getJSON(
                url,
                'page=' + page + '&' + formData + '&is_search=1',
                function( response ) {

                    $('.see-more.see-more-wallpaper').attr('data-page', response.page);
                    if (response.data.length>0) {
                        if(isPodcast) {
                            currentElement.parents('.articles-filters:first').next().html(response.data);
                            ark.PodcastListItem.initAll();
                        } else {
                            currentElement.parents('.articles-filters:first').next().children('ul').html(response.data);
                        }
                    }

                    if (response.displaySeeMore == 0) {
                        currentElement.parents('.articles-filters:first').nextAll('.see-more-wallpaper').hide();
                    } else {
                        currentElement.parents('.articles-filters:first').nextAll('.see-more-wallpaper').show();
                    }
                    currentElement.removeClass('loading');
                    if(!isPodcast) {
                        window.ark.wallpaperGrid();
                        window.ark.updateSocialButton();
                    }
                }
            );

        });

        /**
         * add class full-page tag img in Article
         */
        $('#content-detail-page-of-an-article img').each(function() {
            if (!$(this).hasClass('panoramic-image')) {
                $(this).addClass('full-page');
            }
        });

        /**
         * Event Top 25 rankings
         */
        $('#selection').change( function(){
            if(navigator.userAgent.indexOf("Safari") > -1 &&
                $(this).attr('onchange') &&
                $(this).attr('onchange').indexOf('redirect') != -1) {
                window.location.href = window.location.origin + $(this).val();
            }

        });

        /**
         * Automation of server status
         * @see module wiz_bean_content_rotator_block :: bean--wiz-content-rotator-block--header-status
         */
        if($('#heartbeat-server-status:not(.hide-status-server)').length) {
            var heartbeat = $('#heartbeat-server-status');
            $.getJSON("https://s3-us-west-2.amazonaws.com/s3-mtgo-greendot/status.json", function (data) {

                if(data.status != undefined) {
                    if(data.status == 'UP') {
                        $('.server-status', heartbeat).addClass('up');
                        $('.description span', heartbeat).text($('.description span', heartbeat).data("server-status-up"));
                    } else if (data.status == 'SLOW') {
                        $('.server-status', heartbeat).addClass('slow');
                        $('.description span', heartbeat).text($('.description span', heartbeat).data("server-status-slow"));
                    } else {
                        $('.server-status', heartbeat).addClass('down');
                        $('.description span', heartbeat).text($('.description span', heartbeat).data("server-status-down"));
                    }
                }
            });
        }

        /**
         *
         * Event form Planeswalkers filter
         *
         */

        //Loading terms of vocabulary choice
        $('.planeswalkers-filter #sort-by .dropdown li').click( function () {
            var vid = $(this).data('value'),
                sortAndByUl = $('#sort-and-by ul'),
                dropdownElement = document.getElementById("sort-and-by")
            ;
            //Initialize list filter and by
            sortAndByUl.children().not(':first').remove();
            var textFirstElement = sortAndByUl.children(':first').text();
            sortAndByUl.prevAll('span').html(textFirstElement);
            sortAndByUl.prevAll('input').val(textFirstElement);

            if (vid !== 'All') {
                $.getJSON("/rotator_block/planeswalkers/findall/term/" + vid, function (response) {
                    if (response.data.length) {

                        $.each(response.data, function(index, obj) {
                           sortAndByUl.append('<li data-value="' + obj.tid + '">' + obj.name + '</li>');
                        });
                        //Refresh dropdown for event click
                        dropdownElement.dropdown.update();
                    }
                });
            }
         });

        //Click for apply Filter
        $('.planeswalkers-filter input[name=filter]').click( function () {
            var valuesForm = $('#form-planeswalkers-filter').serialize(),
                elementLoading = $(this);
            elementLoading.addClass('loading');
            $.get(
                '/rotator_block/planeswalkers/filter',
                valuesForm,
                function( response ) {
                    $('.content-grid-planeswalkers').html(response.data);
                    if (response.data != '') {
                        $(".cta").each(function () {
                            $(this).addClass("learn-more");
                            $(this).appendTo($(this).parent().parent().next('.actions'));
                        });
                        $.get('/sites/all/themes/wiz_mtg/assets/js/lib/content-gallery-grid/grid.js');
                    } else {
                        elementLoading.removeClass('loading');
                    }
                }
            );

        });


        /* End planeswalkers filter */

        // Spoilers On/Off mechanic
        $("article span.spoilerBtn").click(function() {
            $(this).toggleClass("opened");
            $(this).html(($(this).hasClass("opened")) ? ">> " + Drupal.t("Click to Hide") : ">> " + Drupal.t("Click to Show"));
            $(this).parent().find("#spoiler" + $(this).data("spoiler-id")).toggleClass("opened");
        });

        /*** Loading script for mosaic grid ***/
        if($(".content-grid.planeswalkers, .content-grid.planes").length) {
            $.get('/sites/all/themes/wiz_mtg/assets/js/lib/content-gallery-grid/grid.js');
        }
        /*** End Loading script for mosaic grid ***/

        $('#divcolorless i, #divwhite i, #divblue i, ' +
            '#divblack i, #divred i, #divgreen i, ' +
            '#divmulticolored i, #divartifact i, #divland i').addClass("enlarge-caption");

        /******:/
         * FILTER CARD IMAGE GALLERY
         * checked="checked"
         */
        $('.bean_block_card_image_gallery .apply-submit').click(function() {

            var $container = $(this).closest( ".bean_block_card_image_gallery"),
                $filter_select = $container.find('input:hidden'),
                $filter_checkbox = $container.find('input:checked'),
                classesDisplay = new Array(),
                classes = new Array();
                ;

            //Push class
            $filter_select.each(function() {
                if ($(this).val() != '' && $(this).val() !=-1) {
                    classesDisplay.push($(this).val());
                }
            });

            $filter_checkbox.each(function() {
                classesDisplay.push($.trim($(this).attr('name')));
                classes.push($(this).attr('name'));
            });

            //Display all if not filter
            if (classesDisplay.length == 0  && $filter_checkbox.length == 0) {
                $container.find('.container-card-image-gallery-block div').show();
                return false;
            }
            //Show/hide Div by class selected
            $container.find('.container-card-image-gallery-block div').each(function(){
                for (var i = 0; i<classesDisplay.length; i++) {
                    if ($(this).hasClass(classesDisplay[i])) {
                        $(this).show();
                    } else {

                        $(this).hide();
                        break;
                    }
                }
            });


        });
        //Initialize form
        $('.bean_block_card_image_gallery .reset-submit').click(function() {
            var $container = $(this).closest( ".bean_block_card_image_gallery"),
                $filter_select = $container.find('input:hidden'),
                $filter_checkbox = $container.find('input:checked')
                ;

            //Initilize value
            $filter_select.each(function() {
                if ($(this).val() != '' && $(this).val() !=-1) {
                    var liFirst = $(this).next().next().find('li:first');
                    $(this).val(liFirst.attr('data-value'));
                    $(this).next().text(liFirst.text());
                    $(this).next().next().children().removeClass('selected');
                    liFirst.addClass('selected');
                }
            });
            //Initialize checkbox
            $filter_checkbox.each(function() {
                $(this).removeAttr('checked');
            });
            $container.find('.container-card-image-gallery-block div').show();
        });

        /*** Fixed display video of Content Video Header in admin mode (bug due to panels_ipe : line 349) ***/

        if ($('#fullpage-video-header video:not([poster])').length) {
            var $videoHeader = $('#fullpage-video-header video:not([poster]):eq(0)');
            $videoHeader.attr('poster', $videoHeader.children('img:eq(0)').attr('src'));
            $videoHeader.get(0).play();
        }

    });
  })(jQuery, Drupal);
