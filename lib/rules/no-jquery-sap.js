/**
 * @fileoverview Checks if the deprecated jQuery.sap API is used
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
            description: "Checks if the deprecated jQuery.sap API is used",
            category: "Possible Errors",
            recommended: true
        },
        fixable: "code",  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ],
        messages: {
            unexpectedUse: "Unexpected reference to legacy jQuery.sap API"
        }
    },

    create: function (context) {

        const ERROR_MSG_NO_JQUERY_SAP = "unexpectedUse";

        const fixableMethods = {
            sap: {
                assert: "sap.base.assert",
                log: {
                    addLogListener: "sap.base.Log.addLogListener",
                    debug: "sap.base.Log.debug",
                    error: "sap.base.Log.error",
                    fatal: "sap.base.Log.fatal",
                    getLevel: "sap.base.Log.getLevel",
                    getLog: "sap.base.Log.getLogEntries",
                    getLogEntries: "sap.base.Log.getLogEntries",
                    getLogger: "sap.base.Log.getLogger",
                    info: "sap.base.Log.info",
                    isLoggable: "sap.base.Log.isLoggable",
                    Level: "sap.base.Log.Level",
                    logSupportInfo: "sap.base.Log.logSupportInfo",
                    removeLogListener: "sap.base.Log.removeLogListener",
                    trace: "sap.base.Log.trace",
                    warning: "sap.base.Log.warning"
                },
                encodeCSS: "sap.base.security.encodeCSS",
                encodeJS: "sap.base.security.encodeJS",
                encodeURL: "sap.base.security.encodeURL",
                encodeURLParameters: "sap.base.security.encodeURLParameters",
                encodeHTML: "sap.base.security.encodeXML",
                encodeXML: "sap.base.security.encodeXML",
                camelCase: "sap.base.strings.camelize",
                charToUpperCase: "sap.base.strings.capitalize",
                escapeRegExp: "sap.base.strings.escapeRegExp",
                formatMessage: "sap.base.strings.formatMessage",
                hashCode: "sap.base.strings.hash",
                hyphen: "sap.base.strings.hyphenate",
                arraySymbolDiff: "sap.base.util.array.diff",
                unique: "sap.base.util.array.uniqueSort",
                equal: "sap.base.util.deepEqual",
                each: "sap.base.util.each",
                forIn: "sap.base.util.each",
                parseJS: "sap.base.util.JSTokenizer.parseJS",
                now: "sap.base.util.now",
                uid: "sap.base.util.uid",
                Version: "sap.base.util.Version",
                syncStyleClass: "sap.ui.core.syncStyleClass",
                containsOrEquals: "sap.ui.dom.containsOrEquals",
                denormalizeScrollBeginRTL: "sap.ui.dom.denormalizeScrollBeginRTL",
                denormalizeScrollLeftRTL: "sap.ui.dom.denormalizeScrollLeftRTL",
                ownerWindow: "sap.ui.dom.getOwnerWindow",
                scrollbarSize: "sap.ui.dom.getScrollbarSize",
                includeScript: "sap.ui.dom.includeScript",
                includeStylesheet: "sap.ui.dom.includeStylesheet",
                replaceDOM: "sap.ui.dom.patch",
                pxToRem: "sap.ui.dom.units.Rem.fromPx",
                remToPx: "sap.ui.dom.units.Rem.toPx",
                checkMouseEnterOrLeave: "sap.ui.events.checkMouseEnterOrLeave",
                bindAnyEvent: "sap.ui.events.ControlEvents.bindAnyEvent",
                ControlEvents: "sap.ui.events.ControlEvents.events",
                unbindAnyEvent: "sap.ui.events.ControlEvents.unbindAnyEvent",
                handleF6GroupNavigation: "sap.ui.events.F6Navigation.handleF6GroupNavigation",
                isMouseEventDelayed: "sap.ui.events.isMouseEventDelayed",
                isSpecialKey: "sap.ui.events.isSpecialKey",
                touchEventMode: "sap.ui.events.jquery.EventSimulation.touchEventMode",
                keycodes: "sap.ui.events.KeyCodes",
                PseudoEvents: "sap.ui.events.PseudoEvents",
                disableTouchToMouseHandling: "sap.ui.events.TouchToMouseMapping.disableTouchToMouseHandling",
                measure: {
                    add: "sap.ui.performance.Measurement.add",
                    average: "sap.ui.performance.Measurement.average",
                    clear: "sap.ui.performance.Measurement.clear",
                    end: "sap.ui.performance.Measurement.end",
                    filterMeasurements: "sap.ui.performance.Measurement.filterMeasurements",
                    getActive: "sap.ui.performance.Measurement.getActive",
                    getAllMeasurements: "sap.ui.performance.Measurement.getAllMeasurements",
                    getMeasurement: "sap.ui.performance.Measurement.getMeasurement",
                    pause: "sap.ui.performance.Measurement.pause",
                    registerMethod: "sap.ui.performance.Measurement.registerMethod",
                    remove: "sap.ui.performance.Measurement.remove",
                    resume: "sap.ui.performance.Measurement.resume",
                    setActive: "sap.ui.performance.Measurement.setActive",
                    start: "sap.ui.performance.Measurement.start",
                    unregisterAllMethods: "sap.ui.performance.Measurement.unregisterAllMethods",
                    unregisterMethod: "sap.ui.performance.Measurement.unregisterMethod",
                },
                fesr: {
                    getActive: "sap.ui.performance.trace.FESR.getActive",
                    setActive: "sap.ui.performance.trace.FESR.setActive",
                    addBusyDuration: "sap.ui.performance.trace.Interaction.addBusyDuration",
                },
                FrameOptions: "sap.ui.security.FrameOptions",
                act: "sap.ui.util.ActivityDetection",
                setIcons: "sap.ui.util.Mobile.setIcons",
                setMobileWebAppCapable: "sap.ui.util.Mobile.setWebAppCabable",
                getParseError: "sap.ui.util.XMLHelper.getParseError",
            },
            isPlainObject: "sap.base.util.isPlainObject",
            device: undefined,
            os: undefined,
            inArray: undefined,
            isArray: undefined
        };

        const jqueryAliases = ["jQuery", "jquery", "$"];

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        // any helper functions should go here or else delete this section

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            MemberExpression(node) {
                const isJquery = jqueryAliases.indexOf(node.object.name) > -1;
                const isLegacy = Object.keys(fixableMethods).indexOf(node.property.name) > -1;

                if (isJquery && isLegacy) {
                    context.report({
                        node,
                        messageId: ERROR_MSG_NO_JQUERY_SAP,
                        fix: fixer => {
                            let method = fixableMethods[node.property.name];

                            while (node.parent.type === "MemberExpression") {
                                node = node.parent;
                                method = method[node.property.name];
                            }

                            if (method) {
                                return fixer.replaceText(node, method);
                            }
                            return null;
                        }
                    });
                }
            }
        };
    }
};
