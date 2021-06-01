/**
 * @fileoverview Checks if the deprecated jQuery.sap API is used
 * @author Marc Schleeweiß
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-jquery-sap"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("no-jquery-sap", rule, {

    valid: [

        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "jQuery.sap.log.info(\"Debugger active\");",
            output: "sap.base.Log.info(\"Debugger active\");",
            errors: [{
                message: "Unexpected reference to legacy jQuery.sap API",
                type: "MemberExpression"
            }]
        }
    ]
});
