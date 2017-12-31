/**
 * Moyasar Invoices UI Code for Wix
 * ---------------------------------
 *
 * @description: A Wix script to launch and prepare the invoice generation interface.
 * @filename: frontend.js
 * @author: Abdullah Barrak (Moyasar Team).
 *
 *  All rights reserved. (2017 - 2018)
 */


import {local} from 'wix-storage';
import {obtainInvoiceForUser} from 'backend/moyasarInvoicesModule';

var context = {
  invoiceExsits: false,
  invoice: null
};

$w.onReady(function () {
  loadUI();
  defineTranslations();
});


/**
 *  UI Setup and Validation
 */

function loadUI () {
  context.nameField           = $w("#invoiceName");
  context.amountField         = $w("#invoiceAmount");
  context.generateBtn         = $w("#openInvoice");
  context.amountValidationMsg = $w("#amountErrMsg");
  context.nameValidationMsg   = $w("#nameErrMsg");
  context.invoiceLink         = $w("#invoiceLink");
}

function defineTranslations() {
  context.resources = {
    en: {
      error: 'Error',
    },

    ar: {
      error: 'خطأ',
    }
  };
}

function validateInvoiceData() {
  let isNameValid = context.nameField.valid;
  let isAmountValid = context.amountField.valid;

  if (isNameValid && isAmountValid) {
    context.generateBtn.enable();
  } else {
    context.generateBtn.disable();
  }

  isNameValid   ? context.nameValidationMsg.hide() : context.nameValidationMsg.show();
  isAmountValid ? context.amountValidationMsg.hide() : context.amountValidationMsg.show();
}

function getNormalizedAmount() {
  return $w("#invoiceAmount").value * 100;
}

function getDescription() {
  return 'Donation Invoice for ' +  context.nameField.value + ' - Charity Organization';
}


/**
 *  Invoice Generation Processing
 */

function getExistingOrNewInvoice() {
  // When it's already available, fetch it from current app/local cache storage,
  // ensuring it's not paid & updated to latest data.
  // Useful for multiple clicks, revisiting user, etc.
  //
  // Otherwise, bring new one from API.
  //
  let description = getDescription();
  let amount = getNormalizedAmount();

  let id = context.invoiceExsits ? context.invoice.id : local.getItem('moyasar_invoice_id');

  obtainInvoiceForUser(amount, description, id || null).then((json) => {
    context.invoiceExsits = true;
    context.invoice = json;
    local.setItem('moyasar_invoice_id', json['id']);

    presentInvoiceToUser(json);
  }).catch(error => reportErrorModally(error));
}

// Decide how to show invoice upon client requirements
// This is for simple button enabling and assigment of link property to the invoice url.
function presentInvoiceToUser(invoice) {
  context.invoiceLink.link = invoice.url;
  context.invoiceLink.show();
}

// When troubles strikes, show the error message from API/backend-module to the user.
function reportErrorModally(error) {
  console.log("[System Error Reporter]: \n" + error);
}

/**
 *  Event Handlers
 */

export function invoiceAmount_keyPress(event, $w) {
  validateInvoiceData();
}

export function openInvoice_click(event, $w) {
  getExistingOrNewInvoice();
}
