/**
 * @fileoverview No comparison against boolean literals
 * @author Marc Schleeweiß
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "No comparison against boolean literals",
            category: "Possible Errors",
            recommended: true
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ]
    },

    create: function (context) {

        const ERROR_MSG_NO_BOOLEAN_LITERAL_COMPARE = "Unexpected boolean literal comparison";

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        const isBoolean = function (value) {
            return value === true || value === false;
        };

        const isComparisonOperator = function(operator) {
            return operator === "=="
                || operator === "==="
                || operator === "!=="
                || operator === "!=";
        };

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {

            BinaryExpression(node) {
                if (!isComparisonOperator(node.operator)) {
                    return;
                }

                if (isBoolean(node.right.value) || isBoolean(node.left.value)) {
                    context.report(node, ERROR_MSG_NO_BOOLEAN_LITERAL_COMPARE);
                }
            }

        };
    }
};
