"use strict";

//https://developer.sitevision.se/docs/webapps/webapps-2/configuration/config.js/validation
(function () {
  window.validate = function () {
    var emailInput = document.getElementById("email");
    var isValid = true;
    if (!emailInput.validity.valid) {
      isValid = false;
      window.sv.addErrorMessage(emailInput, {
        component: errorMessage,
        message: emailInput.validationMessage,
        isValid: function isValid(e) {
          return e.target.validity.valid;
        }
      });
    }
    return isValid && window.sv.validate();
  };
})();