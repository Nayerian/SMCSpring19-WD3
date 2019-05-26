/**
 * Created by itraore on 2017-08-23.
 */
(function($, Drupal){

    "use strict";

    Drupal.behaviors.wiz_views_article_archives = {
        attach: function () {
            /******************** Event click See more ********************/
            var seeMore = Drupal.wiz_views_article_archives.SELECTOR_CONTAINER + ' ' + Drupal.wiz_views_article_archives.SELECTOR_SEE_MORE;
            
            $(document).on('click', seeMore, function () {
                Drupal.wiz_views_article_archives.isSearch = false;

                var $elementLoading = $(this).children('p:first');
                var data = Drupal.wiz_views_article_archives.getFormParam($(this));

                $elementLoading.addClass('loading');

                Drupal.wiz_views_article_archives.ajax($(this), $elementLoading, data);

            });

            /******************** Event click Search button ********************/
            var search = Drupal.wiz_views_article_archives.SELECTOR_CONTAINER + ' ' + Drupal.wiz_views_article_archives.SELECTOR_SEARCH_BUTTON;
            $(document).on('click', search, function () {
                Drupal.wiz_views_article_archives.isSearch = true;

                var data = Drupal.wiz_views_article_archives.getFormParam($(this));
                data.offset = 0;
                data.isSearch = 1;

                $(this).addClass('loading');

                Drupal.wiz_views_article_archives.ajax($(this), $(this), data);
            });

            /******************** Send form on press enter ********************/
            $(document).on('keypress',  Drupal.wiz_views_article_archives.SELECTOR_CONTAINER + ' form', function(e){
                if (e.which === 13) {
                    $(this).find('input[name=custom-search-submit]').click();
                }
            });
        }
    };

    /**
     * namespace
     * @type {{}}
     */
    Drupal.wiz_views_article_archives = {
        SELECTOR_CONTAINER : '.views-panes--wiz-views-articles-articles--panel-pane-1--across',
        SELECTOR_SEE_MORE : '.see-more-article-archives-layout-across',
        SELECTOR_SEARCH_BUTTON : 'form input[name=custom-search-submit]',
        SELECTOR_BLOCKS_LIST : '.articles-listing-as-blocks--list',
        isSearch : false
    };

    /**
     * Returns all data form
     *
     * @param element current selector
     *
     * @returns {{}}
     */
    Drupal.wiz_views_article_archives.getFormParam = function(element){
        var offset = this.isSearch ? this.getSeeMoreElement(element).attr('data-offset') : element.attr('data-offset');
        var formData = element.closest(this.SELECTOR_CONTAINER).find('form').serializeArray();
        var data = {};

        $.each(formData, function(i, field) {
            data[field.name] = field.value;
        });

        data['offset'] = offset;

        return data;
    };

    /**
     * Returns Ajax menu link
     *
     * @returns {*}
     */
    Drupal.wiz_views_article_archives.getUrl = function() {
        return $(Drupal.wiz_views_article_archives.SELECTOR_SEE_MORE).data('url');
    };

    /**
     * Returns jQueryObject for container items (blocks list)
     *
     * @param $this
     * @returns {*}
     */
    Drupal.wiz_views_article_archives.getBlocksListElement = function($this) {
        return $this.closest(this.SELECTOR_CONTAINER).find(this.SELECTOR_BLOCKS_LIST).eq(0);
    };

    /**
     * Returns jQueryObject for see more element
     *
     * @param $this
     * @returns {*}
     */
    Drupal.wiz_views_article_archives.getSeeMoreElement = function($this) {
        return $this.closest(this.SELECTOR_CONTAINER).find(this.SELECTOR_SEE_MORE).eq(0);
    };

    /**
     * Callback ajax function
     *
     * @param jQueryObject $this Element clicked (see more or search button)
     * @param jQueryObject $elementLoading
     * @param Object data Form data
     */
    Drupal.wiz_views_article_archives.ajax = function($this, $elementLoading, data) {
        var _this = this;
        $.ajax({
            type: 'POST',
            url: Drupal.wiz_views_article_archives.getUrl(),
            data: data,
            dataType: 'json',
            success: function( response ) {
                var seeMoreElement = $this;

                if (_this.isSearch) {
                    Drupal.wiz_views_article_archives.getBlocksListElement($this).html(response.data);
                    seeMoreElement = Drupal.wiz_views_article_archives.getSeeMoreElement($this);
                }
                else
                    Drupal.wiz_views_article_archives.getBlocksListElement($this).append(response.data);

                seeMoreElement.attr("data-offset", response.offset);

                if(response.displaySeeMore == 0) {
                    //Initialize query parameter range offset
                    seeMoreElement.attr("data-offset", response.defaultOffset);
                    //Hide button see more
                    seeMoreElement.hide();
                }else {
                    seeMoreElement.show()
                }

                $elementLoading.removeClass('loading');
            }
        });
    };

})(jQuery, Drupal);