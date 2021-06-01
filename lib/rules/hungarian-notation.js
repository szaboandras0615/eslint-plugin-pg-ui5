/**
 * @fileoverview Use hungarian notation when declaring variables
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
            description: "Use hungarian notation when declaring variables",
            category: "Possible Errors",
            recommended: false
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            {
                type: "object",
                properties: {
                    onlyDeclarations: {
                        type: "boolean",
                        default: false
                    },
                    ignore: {
                        type: "array",
                        items: {
                            type: "string"
                        },
                        uniqueItems: true
                    }
                }
            }
        ]
    },

    create: function (context) {

        const ERROR_MSG_HUNGARIAN_NOTATION = "Use hungarian notation when naming variables";

        const TYPES = [
            "VariableDeclarator",
            "FunctionExpression",
            "FunctionDeclaration",
        ];

        const REGEXES = [
            // allow hungarian notation (with snakeCase) for declarations
            /^(\$|fn|[a-z]|)([A-Z]+[a-z0-9]*)+$/,
            // allow UpperCamelCase for class names
            /^([A-Z]+[a-z0-9]*)+$/,
            // allow SCREAMING_SNAKE_CASE for constants
            /^([A-Z0-9]+_*)+$/,
        ];

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        const options = context.options[0] || {};
        const onlyDeclarations = !!options.onlyDeclarations;
        const ignore = options.ignore || [];

        // allow single char ids and special keywords
        const whitelist = ["[a-z]", "that", "resolve", "reject", "cb", "done"];
        Array.prototype.push.apply(whitelist, ignore);

        REGEXES.push(new RegExp("^(" + whitelist.join("|") + ")$"));

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {

            Identifier(node) {

                const name = node.name;
                const parent = node.parent;
                const effectiveParent = (parent.type === "MemberExpression") ? parent.parent : parent;

                if (TYPES.indexOf(node.parent.type) > -1) {

                    const isDeclaration = effectiveParent.type === "FunctionDeclaration" && effectiveParent.id.name === name || effectiveParent.type === "VariableDeclarator";

                    if (isDeclaration || !onlyDeclarations) {
                        if (!REGEXES.some(r => r.test(name))) {
                            context.report(node, ERROR_MSG_HUNGARIAN_NOTATION);
                        }
                    }
                }
            }
        };
    }
};
