/**
 * @fileoverview Do not load modules/controls synchronously
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
            description: "Don't use references to global names",
            category: "Possible Errors",
            recommended: true
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            {
                "type": "object",
                "properties": {
                    "targetVersion": {
                        "type": "string"
                    }
                },
                "additionalProperties": false
            }
        ]
    },

    create: function (context) {

        const ERROR_MSG_NO_SYNC_MODULE_LOADING = "Unexpected reference to global name";


        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        // any helper functions should go here or else delete this section

        const buildExceptionList = function (targetVersion) {
            const version = parseVersion(targetVersion);

            const list = [
                "sap.ui.define",
                "sap.ui.require",
                "sap.ui.getCore",
                "sap.ushell.Container.getService"
            ];

            if (version.major < 1 || version.major === 1 && version.minor < 56) {
                Array.prototype.push.apply(list, [
                    "sap.ui.component",
                    "sap.ui.template",
                    "sap.ui.templateview",
                    "sap.ui.view",
                    "sap.ui.xmlview",
                    "sap.ui.htmlview",
                    "sap.ui.jsview",
                    "sap.ui.jsonview"
                ]);
            }

            if (version.major < 1 || version.major === 1 && version.minor < 58) {
                Array.prototype.push.apply(list, [
                    "sap.ui.fragment",
                    "sap.ui.htmlfragment",
                    "sap.ui.jsfragment",
                    "sap.ui.xmlfragment"
                ]);
            }

            return list;
        }

        const parseVersion = function (version) {
            const VERSION_REGEX = /^(\d+)(?:\.(\d+))?(?:\.(\d+))?$/;
            const matches = version.match(VERSION_REGEX);

            return {
                major: parseInt(matches[1]) || 1,
                minor: parseInt(matches[2]) || 0,
                patch: parseInt(matches[3]) || 0
            };
        }

        const options = context.options[0] || {};
        const targetVersion = options.targetVersion || "1.0.0";
        const exceptionList = buildExceptionList(targetVersion);

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            MemberExpression(node) {
                if (node.object.name === "sap") {
                    const namespaceParts = [];
                    namespaceParts.push(node.object.name);
                    namespaceParts.push(node.property.name);

                    while (node.parent.type === "MemberExpression") {
                        node = node.parent;
                        namespaceParts.push(node.property.name);
                    }

                    const namespace = namespaceParts.join(".");

                    if (exceptionList.indexOf(namespace) < 0) {
                        context.report(node, ERROR_MSG_NO_SYNC_MODULE_LOADING);
                    }
                }
            }
        };
    }
};
