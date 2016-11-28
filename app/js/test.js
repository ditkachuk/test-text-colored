(function() {
    var renderedColorBlocks = [];

    function addColorBlocks() {
        var target = $('.wrap');
        if (!target[0]) return;

        var enter = /%%(\d+)\s/g;
        var close = /\s(\d+)%%/g;

        var matches = target[0].innerHTML.match(enter);
        if (!matches) return;

        var result = target[0].innerHTML.replace(enter, '<div id="block_$1_enter" class="block_$1 block_start"><a name="block_$1"></a></div>');
        result = result.replace(close, '<div id="block_$1_close" class="block_$1 block_close"></div>');

        target[0].innerHTML = result;
    }

    function renderColorBlock(blockIndex) {
        var target = $('.wrap');
        if (renderedColorBlocks[blockIndex]) return;

        var targetWidth = target.width();
        var startBlock = $('#block_' + blockIndex + '_enter');
        var closeBlock = $('#block_' + blockIndex + '_close');
        if (!startBlock[0]) return;

        var startPoint = startBlock.offset().top;
        var closePoint = closeBlock.offset().top; 

        var cls = (blockIndex % 2 == 0) ? 'even' : 'odd';
        var colorBlock = $('<div class="block block_' + cls + '" id="block_' + blockIndex + '"></div>');

        colorBlock.css({top: startPoint});
        colorBlock.width(targetWidth);
        colorBlock.height(closePoint - startPoint);

        target.append(colorBlock);
        renderedColorBlocks[blockIndex] = colorBlock;
    }

    window.renderColorBlock = renderColorBlock;

    function renderDocument(data) {
        var title = $('.main-title');
        var doc = $('.wrap');
        var contentHTML = '';
        var tocHTML = '<h1>Оглавление</h1><ul class="menu none">';

        $.each(data, function(index, part) {
            if (!part.found || part.id == 'doc_whole') return;

            if (part.id == 'doc_title' && part.data) {
                $.each(part.data, function(index, part) {
                    if (!part.content) return;

                    $('#' + part.id).html(part.content.replace(/(?:\r\n|\r|\n)/g, '<br />'));
                });
                return;
            }

            var content = part.content.replace(/background: #ffffff/g, '');
            contentHTML += ' %%' + index + ' <h1>' + part.title + '</h1>' + content + ' ' + index + '%% ';
            tocHTML += '<li><a href="#block_' + index + '" onclick="renderColorBlock(' + index + ')">' + part.title + '</a></li>';
        });

        doc[0].innerHTML = tocHTML + '</ul>' + contentHTML;
    }

    function loadDocument() {
        $.ajax({url: 'data/data.json', dataType: "json"}).done(function(response) {
            renderDocument(response);
            addColorBlocks();
        });
    }

    $(loadDocument);
})();
