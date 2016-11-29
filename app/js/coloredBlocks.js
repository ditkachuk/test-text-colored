(function() {
    window.Application = app;
    $(function() {
        $('#html').hide();
    });

    function app(json) {
        this.json = json;
        this.target = $('.wrap');
        this.rendered = {
            block: {},
            part: {}
        };

        this.renderDocumentHTML(this.json, this.target);

        this.renderDocument = function() {
            $('#html').show();
            this.clearColorBlocks();
        };

        this.showLinks = function() {
            var links = '';

            $.each(this.matches, function(index, match) {
                var blockIndex = parseInt(match.replace('%%', ''));
                links += '<li><button onclick="app.gotoColorBlock(' + blockIndex + ')">' + blockIndex + '</button></li>';
            });

            $('#links ul').html(links);
            $('#links').show();
        };

        this.gotoColorPart = function(blockIndexes) {
            $('#html').show();
            this.clearColorBlocks();

            this.gotoBlock(blockIndexes, 'part');
        };

        this.gotoColorBlock = function(blockIndexes) {
            $('#html').show();
            this.clearColorBlocks();

            this.gotoBlock(blockIndexes, 'block');
        };
    }

    app.prototype.gotoBlock = function(blockIndexes, type) {
        if (!$.isArray(blockIndexes)) blockIndexes = [blockIndexes];

        var minOffset, self = this;
        $.each(blockIndexes, function(index, item) {
            if (!item) return;
            var block = self.rendered[type][item] = self.renderColorBlock(self.target, item, type);
            if (!minOffset || block.offset().top < minOffset) minOffset = block.offset().top;
        })

        $('html, body').animate({
            scrollTop: minOffset - 30
        }, 1000);
    };

    app.prototype.clearColorBlocks = function() {
        $.each(this.rendered.block, function(i, item) {
            if (item) item.detach();
        });

        $.each(this.rendered.part, function(i, item) {
           if (item) item.detach();
        });

        this.rendered.block = {};
        this.rendered.part = {};
    };

    app.prototype.addColorBlocks = function() {
        if (!this.target[0]) return;

        var enter = /%%(\d+)\s/g;
        var close = /\s(\d+)%%/g;

        var matches = this.target[0].innerHTML.match(enter);
        if (!matches) return;

        var result = this.target[0].innerHTML.replace(enter, '<span id="block_$1_enter" class="block_$1 block_start"><a name="block_$1"></a></span>');
        result = result.replace(close, '<span id="block_$1_close" class="block_$1 block_close"></span>');

        this.target[0].innerHTML = result;

        return this.matches = matches;
    };

    app.prototype.renderColorBlock = function(target, blockIndex, type) {
        if (this.rendered[type][blockIndex]) return;
        if (!type) type = 'block';

        var targetWidth = target.width();
        var startBlock = $('#' + type + '_' + blockIndex + '_enter');
        var closeBlock = $('#' + type + '_' + blockIndex + '_close');
        if (!startBlock[0]) return;

        var startPoint = startBlock.offset().top;
        var closePoint = closeBlock.offset().top; 

        var colorBlock = $('<div class="' + type + '" id="' + type + '_' + blockIndex + '"></div>');

        colorBlock.css({top: startPoint});
        colorBlock.width(targetWidth);
        colorBlock.height(closePoint - startPoint);

        target.append(colorBlock);
        return colorBlock;
    };

    app.prototype.renderDocumentHTML = function(data, target) {
        var title = $('.main-title');
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

            contentHTML += '<span id="part_' + index + '_enter" class="part_' + index + ' part_start"><a name="part_' + index + '"></a></span>'
                + '<h1>' + part.title + '</h1>' + content
                + '<span id="part_' + index + '_close" class="part_' + index + ' part_close"></span>';

            tocHTML += '<li><a onclick="app.gotoColorPart(' + index + ')">' + part.title + '</a></li>';
        });

        target[0].innerHTML = tocHTML + '</ul>' + contentHTML;

        this.addColorBlocks(target);
    };
})();
