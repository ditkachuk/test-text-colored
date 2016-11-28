(function() {
    function renderColorBlocks() {
        var target = $('.wrap');
        var enter = /%%(\d)\s/g;
        var close = /\s(\d)%%/g;

        var matches = target[0].innerHTML.match(enter);
        var result = target[0].innerHTML.replace(enter, '<div id="block_$1_enter" class="block_$1 block_start"></div>');
        result = result.replace(close, '<div id="block_$1_close" class="block_$1 block_close"></div>');

        target[0].innerHTML = result;

        var targetWidth = target.width();
        for(var i = 0; i < matches.length; i++) {
            var blockIndex = parseInt(matches[i].replace('%%', ''));
            
            var startBlock = $('#block_' + blockIndex + '_enter');
            var closeBlock = $('#block_' + blockIndex + '_close');

            var startPoint = startBlock.offset().top;
            var closePoint = closeBlock.offset().top; 

            var colorBlock = $('<div class="block" id="block_' + blockIndex + '"></div>');

            colorBlock.css({top: startPoint});
            colorBlock.width(targetWidth);
            colorBlock.height(closePoint - startPoint);

            target.append(colorBlock);
        }
    }

    $(function() {
        $.ajax('data/data.json').always(function(data) {
            console.log(data);
            renderColorBlocks();
        });
    });
})();

