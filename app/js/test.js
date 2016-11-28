(function() {
    $(function() {
        window.app = new app();
    });

    function app() {
        this.html = '';
        this.target = $('.wrap');
        this.rendered = {
            block: [],
            part: []
        };

        this.loadDocumentJSON(this.target);
        $('#html').hide();

        this.renderDocument = function() {
            $('#html').show();
        };

        this.showLinks = function() {
            var links = '';

            $.each(this.matches, function(index, match) {
                var blockIndex = parseInt(match.replace('%%', ''));
                links += '<li><a href="#block_' + blockIndex + '" onclick="app.gotoColorBlock(' + blockIndex + ')">' + blockIndex + '</a></li>';
            });

            $('#links').html(links).show();
        };

        this.gotoColorPart = function(blockIndex) {
            this.rendered.part[blockIndex] = this.renderColorBlock(this.target, blockIndex, 'part');
        };

        this.gotoColorBlock = function(blockIndex) {
            $('#html').show();
            this.rendered.block[blockIndex] = this.renderColorBlock(this.target, blockIndex, 'block');
        };
    }

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

        var cls = (blockIndex % 2 == 0) ? 'even' : 'odd';
        var colorBlock = $('<div class="' + type + ' ' + type + '_' + cls + '" id="' + type + '_' + blockIndex + '"></div>');

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

            tocHTML += '<li><a href="#part_' + index + '" onclick="app.gotoColorPart(' + index + ')">' + part.title + '</a></li>';
        });

        return target[0].innerHTML = tocHTML + '</ul>' + contentHTML;
    };

    app.prototype.loadDocumentJSON = function(target) {
        var self = this;
        
        return $.ajax({url: 'data/data.json', dataType: "json"}).done(function(response) {
            self.html = self.renderDocumentHTML(response, target);
            self.addColorBlocks(target);
        });
    };
})();
