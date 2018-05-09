(function($window) {

    "use strict";

    /**
     * @module Shift
     * @author Adam Timberlake
     */

    /**
     * Responsible for attaching the events to the elements.
     * @constructor
     */
    $window.Shift = function() {

        var scope       = this,
            _fillGaps   = function() {
                scope._fillGaps.call(scope, this);
            },
            nodes       = this._getNodesByGroupName();

        /**
         * @event onkeyup
         * @param event {Object}
         */
        $window.document.onkeyup = function(event) {
            scope._shiftDown = event.shiftKey;
        };

        /**
         * @event onkeydown
         * @param event {Object}
         */
        $window.document.onkeydown = function(event) {
            scope._shiftDown = event.shiftKey;
        };

        // Iterate over each discovered node to attach the event.
        for (var index = 0, maxNodes = nodes.length; index < maxNodes; index++) {
            var node        = nodes[index];
            node.onclick    = _fillGaps;
        }

    };

    /**
     * @property prototype
     * @type {Object}
     */
    $window.Shift.prototype = {

        /**
         * Node that was first selected when the shift key was down.
         * @property _firstNode
         * @type {Object}
         * @private
         */
        _firstNode: null,

        /**
         * Whether the shift key is currently being held down.
         * @property _shiftDown
         * @type {Boolean}
         * @private
         */
        _shiftDown: false,

        /**
         * @method _getNodesByGroupName
         * @param groupName {String}
         * @return {NodeList}
         * @private
         */
        _getNodesByGroupName: function _getNodesByGroupName(groupName) {

            if (!groupName) {
                return $window.document.querySelectorAll('*[data-shift-group]');
            }

            return $window.document.querySelectorAll('*[data-shift-group="' + groupName + '"]');

        },

        /**
         * @method _fillGaps
         * @param lastNode {Object}
         * @return {void}
         * @private
         */
        _fillGaps: function(lastNode) {

            if (!this._firstNode || !this._shiftDown) {

                // We don't have an originating node so let's define one!
                this._firstNode = lastNode;
                return;

            }

            var firstGroupName  = this._firstNode.getAttribute('data-shift-group'),
                lastGroupName   = lastNode.getAttribute('data-shift-group'),
                sameGroupNames  = (firstGroupName === lastGroupName);

            if (!sameGroupNames) {

                // Group names aren't the same so we've not got an actual range.
                this._firstNode = lastNode;
                return;

            }

            var nodes       = this._getNodesByGroupName(lastGroupName),
                highlight   = false;

            // Iterate over each node to determine whether it should be filled in or not. We stop and start
            // whenever we find the first or last node.
            for (var index = 0, maxNodes = nodes.length; index < maxNodes; index++) {

                var node = nodes[index];

                // Determine if the current node is one of the two nodes clicked.
                if (node === lastNode || node === this._firstNode) {

                    // Invert the highlight variable if we've found the first or last clicked node.
                    highlight = !highlight;

                }

                if (highlight) {
                    // Set the `checked` property to that of the first clicked node.
                    node.checked = this._firstNode.checked;
                }

            }

        }

    };

    $window.document.addEventListener('DOMContentLoaded', function() {
        new Shift();
    });

})(window);