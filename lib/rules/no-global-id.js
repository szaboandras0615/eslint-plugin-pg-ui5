/**
 * @fileoverview Checks if controls are accessed using their global ID
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
            description: "Checks if controls are accessed using their global ID",
            category: "Possible Errors",
            recommended: true
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ]
    },

    create: function (context) {

        const ERROR_MSG_NO_GLOBAL_ID = "Unexpected access of control using a global ID";

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        // any helper functions should go here or else delete this section

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {

            CallExpression(node) {
                if (node.parent.property && node.parent.property.name === "byId" && node.callee.property.name === "getCore") {
                    context.report(node, ERROR_MSG_NO_GLOBAL_ID);
                }
            }

        };
    }
};
