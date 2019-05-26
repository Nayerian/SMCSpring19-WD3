(function ($) {

  Drupal.behaviors.wiz_decklist_filter = {

    attach: function() {
      if( typeof CKEDITOR !== "undefined" ) {
        CKEDITOR.on('instanceReady', function (ev) {
          // Append <br /> to each line in decklist definition.
          // The filter is able to handle such tags and parse them correctly.
          var text = $('#' + ev.editor.name).val();
          var regex = /\[decklist\]([\s\S]*?)\[\/decklist\]/g;
          var matches;

          while (matches = regex.exec(text)) {
            var decklist = matches[0];

            // If we find some <p> or <br> tags, don't do anything.
            if (/<p>/.test(decklist) || /<br[ \/>]/.test(decklist)) {
              continue;
            }
            var fixed_decklist = decklist.replace(/\n/g, '<br />\n');
            ev.editor.setData(text.replace(decklist, fixed_decklist));
          }
        });
      }
    }
  };
})(jQuery);
