/* scenarioo-client
 * Copyright (C) 2014, scenarioo.org Development Team
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* global SVG:false */
declare const SVG: any;
import * as $ from 'jquery';

SVG.CompositeShape = function(width, height, x, y, options) {
    let i;

    this.settings = {
        text: ''
        , fontSize: 14
        , fontColor: '#000'
        , fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif'
        , fontWeight: 'normal'
        , fill: '#fff'
        , opacity: 1
        , stroke: '#000'
        , strokeWidth: 3
        , cornerRadius: 0
        , padding: 10
        , halign: 'left'
        , valign: 'top'
        , class: 'rect-shape'
        , minWidth: 70
        , minHeight: 48
        , isNote: false,
    };

    options = options || {};
    for (i in options) {
        this.settings[i] = options[i];
    }

    this.constructor.call(this, SVG.create('svg'));

    this.width(width);
    this.height(height);
    this.move(x, y);
    this.addClass(this.settings.class);

    this.rect = this.rect(width, height, 0, 0);
    this.rect.fill({color: this.settings.fill, opacity: this.settings.opacity})
        .stroke({color: this.settings.stroke, width: this.settings.strokeWidth})
        .radius(this.settings.cornerRadius);

    if (this.settings.isNote) {
        this.isNote = true;
        this.createNotePolygon();
    }

    let halign = '';
    if (this.settings.halign === 'center') {
        halign = 'middle';
    } else if (this.settings.halign === 'right') {
        halign = 'end';
    } else {
        halign = 'start';
    }

    this.textNode = this.text(this.settings.text)
        .move(this.settings.padding, this.settings.padding)
        .fill(this.settings.fontColor)
        .attr('style', 'cursor:pointer;')
        .font({
            anchor: halign
            , size: this.settings.fontSize
            , family: this.settings.fontFamily
            , weight: this.settings.fontWeight,
        });

    this.registerAttrChangeEvent();
};

SVG.CompositeShape.prototype = new SVG.Nested();

// Add methods
SVG.extend(SVG.CompositeShape, {

    update() {
        this.rect.attr({
            width: this.width()
            , height: this.height(),
        });

        if (this.isNote) {
            this.updateNotePolygon();
        }

        this.updateHalign();
        this.updateValign();
    },

    showText() {
        this.textNode.show();
    },

    hideText() {
        this.textNode.hide();
    },

    setMinSizeIfSmaller() {
        if (this.width() < this.settings.minWidth) {
            this.width(this.settings.minWidth);
        }
        if (this.height() < this.settings.minHeight) {
            this.height(this.settings.minHeight);
        }
    },

    updateSizeIfTextisLarger() {
        let textWidth = this.textNode.node.clientWidth;
        let textHeight = this.textNode.node.clientHeight;

        let newWidth = textWidth + 2 * this.settings.padding;
        let newHeight = textHeight + 2 * this.settings.padding;

        if (this.width() < newWidth) {
            this.width(newWidth);
        }
        if (this.height() < newHeight) {
            this.height(newHeight);
        }
    },

    updateHalign() {
        switch (this.settings.halign) {
            case 'center':
                this.textNode.x(this.width() / 2);
                break;
            case 'right':
                this.textNode.x(this.width() - this.settings.padding);
                break;
            default:
                this.textNode.x(this.settings.padding);
        }
    },

    updateValign() {
        let textHeight = 0;

        this.textNode.lines().each(function() {
            textHeight += this.dy();
        });

        switch (this.settings.valign) {
            case 'middle':
                if (textHeight > 0) {
                    this.textNode.y((this.height() - textHeight) / 2);
                }
                break;
            case 'bottom':
                this.textNode.y(this.height() - textHeight - this.settings.padding);
                break;
            default:
                this.textNode.y(this.settings.padding);
        }
    },

    getText() {
        return this.textNode.text();
    },

    setText(text) {
        this.textNode.text(text);
    },

    edit(zoomFactor, offset) {
        zoomFactor = zoomFactor || 1;
        offset = offset || {x: 0, y: 0};

        let self = this,
            shapeEditNodeId = self.id() + '-edit',
            workspaceNode = $(self.node).closest('div');

        self.hideText();
        self.unSelect();

        let fontSize = this.settings.fontSize * zoomFactor;
        let padding = this.settings.padding * zoomFactor;

        $(workspaceNode).prepend('<div id="' + shapeEditNodeId + '" class="shapeTextWrapper">' +
        '<textarea class="shapeText" style="font-size:' + fontSize + 'px; font-weight:' + this.settings.fontWeight + '; padding:' +
            padding + 'px; text-align: ' + this.settings.halign + ';"></textarea>' +
        '</div>');

        $('#' + shapeEditNodeId).width(self.width() * zoomFactor)
            .height(self.height() * zoomFactor)
            .css('left', self.x() * zoomFactor + offset.x)
            .css('top', self.y() * zoomFactor + offset.y);

        $('#' + shapeEditNodeId + ' textarea').on('blur', function() {
            self.setText($(this).val());
            self.showText();
            $(this).parent().remove();
        }).focus().val(self.getText());
    },

    view() {
        let shapeEditNodeId = this.id() + '-edit';
        this.setText($('#' + shapeEditNodeId + ' textarea').val());
        this.showText();
        $('#' + shapeEditNodeId).remove();
        this.update();
        this.updateSizeIfTextisLarger();
    },

    createNotePolygon() {
        this.polygon = this.polygon('0,0').fill('#f1c40f').opacity(0.8);
        this.polyline = this.polyline('0,0').fill('none').stroke({width: 1}).opacity(0.2);
    },

    updateNotePolygon() {
        this.polygon.plot([
            [this.rect.width() - 15, 0],
            [this.rect.width(), 15],
            [this.rect.width(), this.rect.height()],
            [0, this.rect.height()],
            [0, 0],
        ]);

        this.polyline.plot([
            [this.rect.width() - 15, 0],
            [this.rect.width() - 15, 15],
            [this.rect.width(), 15],
        ]);
    },

    // http://stackoverflow.com/questions/4561845/firing-event-on-dom-attribute-change
    registerAttrChangeEvent() {
        let self = this;
        (window as any).MutationObserver = (window as any).MutationObserver
        || (window as any).WebKitMutationObserver
        || (window as any).MozMutationObserver;

        if ((window as any).MutationObserver || (window as any).MutationObserver !== undefined) {
            let target = self.node,
                observer = new MutationObserver(function() {
                    self.update();
                }),
                config = {
                    attributes: true, // this is to watch for attribute changes.
                };
            observer.observe(target, config);
        } else {
            self.on('DOMAttrModified.shape', function() {
                self.update();
            });
        }
    },
});

// Extend SVG container
SVG.extend(SVG.Container, {
    rectShape(width, height, x, y) {
        return this.put(new SVG.CompositeShape(width, height, x, y));
    },
    borderShape(width, height, x, y) {
        return this.put(new SVG.CompositeShape(width, height, x, y, {
            opacity: 0
            , stroke: '#e74c3c'
            , strokeWidth: 5
            , class: 'border-shape',
        }));
    },
    noteShape(width, height, x, y) {
        return this.put(new SVG.CompositeShape(width, height, x, y, {
            opacity: 0
            , strokeWidth: 0
            , isNote: true
            , class: 'note-shape'
            , minWidth: 120
            , minHeight: 120,
        }));
    },
    textShape(width, height, x, y) {
        return this.put(new SVG.CompositeShape(width, height, x, y, {
            opacity: 0
            , fill: '#fff'
            , strokeWidth: 0
            , class: 'text-shape'
            , minWidth: 120,
        }));
    },
    buttonShape(width, height, x, y) {
        return this.put(new SVG.CompositeShape(width, height, x, y, {
            fill: '#3498db'
            , strokeWidth: 0
            , halign: 'center'
            , valign: 'middle'
            , text: 'button text'
            , cornerRadius: 10
            , fontWeight: 'bold'
            , class: 'button-shape'
            , minWidth: 100,
        }));
    },
    highlightShape(width, height, x, y) {
        return this.put(new SVG.CompositeShape(width, height, x, y, {
            fill: '#f1c40f'
            , opacity: 0.5
            , strokeWidth: 0
            , class: 'highlight-shape'
            , minWidth: 120
            , minHeight: 30,
        }));
    },
});
