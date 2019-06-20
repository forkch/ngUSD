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

angular.module('scenarioo.directives')
    .component('scTree', {

        bindings: {
            data: '<'
        },
        template: '<div ng-bind-html="$ctrl.treeHtml" class="sc-tree"></div>',
        controller: TreeComponentController,
    });

function TreeComponentController($sce) {
    const scope = this;
    const ITEM = 'Item';
    const CHILDREN = 'children';

    this.$onChanges = (changes) => {
        if (changes.data) {
            /* there is no 'ng-bind-html-unsafe' anymore. we use Strict Contextual Escaping, see
             http://docs.angularjs.org/api/ng/service/$sce for more information
             */
            scope.treeHtml = $sce.trustAsHtml(createTreeHtml(changes.data.currentValue));
        }
    };

    function createTreeHtml(data) {

        if (!angular.isObject(data)) {
            return 'no data to display';
        } else if (angular.isObject(data) && angular.isArray(data)) {
            let html = '';
            angular.forEach(data, (rootNode) => {
                html += getRootNodeHtml(rootNode);
            });
            return html;
        }
        return getRootNodeHtml(data);
    }

    function getRootNodeHtml(rootNode) {
        let html = '';
        if (angular.isDefined(rootNode.nodeLabel)) {
            html += '<ul><li>';
        }
        html += getNodeHtml(rootNode);
        if (angular.isDefined(rootNode.nodeLabel)) {
            html += '</li></ul>';
        }
        return html;
    }

    function getNodeHtml(node) {
        if (angular.isUndefined(node.nodeValue) || node.nodeValue === '') {
            // Handle special structural nodes with internal scenarioo keywords to not dsiplay those as usual nodes with usual labels.
            if (angular.isDefined(node.nodeLabel) && node.nodeLabel === ITEM) {
                return getItemNodeHtml(node);
            } else if (angular.isDefined(node.nodeLabel) && node.nodeLabel === CHILDREN) {
                return getChildrenNodeHtml(node);
            }
        }
        if (angular.isUndefined(node.nodeObjectType) || angular.isUndefined(node.nodeObjectName)) {
            return getUsualValueItemNodeHtml(node);
        } else {
            return getObjectNodeHtml(node);
        }

    }

    /**
     * HTML for a simple value item in the three structure (most trivial node).
     */
    function getUsualValueItemNodeHtml(node) {
        let html = '';
        if (angular.isDefined(node.nodeLabel)) {
            html = getNodeTitleHtml(node);
        }
        if (angular.isDefined(node.childNodes)) {
            html += getChildNodesHtml(node.childNodes);
        }
        return html;
    }

    /**
     * HTML for a node representing an Object (with a special title from type and name)
     */
    function getObjectNodeHtml(node) {
        let html = '<div class="sc-treeNodeObject">';
        if (angular.isDefined(node.nodeLabel)) {
            html += '<div class="sc-treeNodeObjectTitle">';
            html += getNodeTitleHtml(node);
            html += '</div>';
        }
        if (angular.isDefined(node.childNodes)) {
            html += getChildNodesHtml(node.childNodes);
        }
        html += '</div>';
        return html;
    }

    /**
     * HTML for an item in an ObjectTreeNode
     */
    function getItemNodeHtml(node) {
        let html = '<div class="sc-treeNodeItem">';
        if (angular.isDefined(node.childNodes)) {
            html += getChildNodesHtml(node.childNodes);
        }
        html += '</div>';
        return html;
    }

    /**
     * HTML for all children-Nodes in an ObjectTreeNode
     */
    function getChildrenNodeHtml(node) {
        let html = '<div class="sc-treeNodeChildren">';
        if (angular.isDefined(node.childNodes)) {
            html += getChildNodesHtml(node.childNodes);
        }
        html += '</div>';
        return html;
    }

    function getNodeTitleHtml(data) {
        return '<span class="sc-node-label">' + data.nodeLabel + '</span>' + getNodeValueHtml(data);
    }

    function getNodeValueHtml(data) {
        let href = '';

        if (angular.isUndefined(data.nodeValue)) {
            return '';
        }

        if (angular.isDefined(data.nodeObjectType) && angular.isDefined(data.nodeObjectName)) {
            const hrefObjectType = encodeURIComponent(data.nodeObjectType);
            const hrefObjectName = encodeURIComponent(data.nodeObjectName);

            href = '<a id="' + hrefObjectType + '_' + hrefObjectName + '" href="#/object/' +
                hrefObjectType + '/' + hrefObjectName + '">' + data.nodeValue + '</a>';
        } else {
            href = data.nodeValue;
        }

        return '<span class="sc-node-label">: </span><span class="sc-node-value">' + href + '</span>';
    }

    function getChildNodesHtml(childNodes) {
        if (angular.isUndefined(childNodes) || !angular.isArray(childNodes) || childNodes.length === 0) {
            return '';
        }
        let html = '<ul>';
        angular.forEach(childNodes, (value) => {
            html += '<li>' + getNodeHtml(value) + '</li>';
        });
        html += '</ul>';
        return html;
    }
}
