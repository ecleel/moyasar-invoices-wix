/**
 * Moyasar Invoices UI Code for Wix
 * ---------------------------------
 *
 * @description: A Wix script to launch and prepare the invoice generation interface.
 * @filename: moyasar-frontend-ui.js
 * @author: Abdullah Barrak (Moyasar Team).
 *
 *  All rights reserved – (2017).
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

function makeInvoice() {
  // When it's already available, fetch it from cache or browser local storage.
  // Also, ensure it's paid or updated to latest data prior presenting it to the user.
  var invoice = null;

  if (context.invoiceCreated) {
    invoice = getExistingInvoice();
    if (invoice)
      presentInvoiceToUser(invoice);
  }

  if (!invoice) {
    obtainInvoiceForUser($w("#invoiceAmount").value * 100, 'Created via Wix ~').then((json) => {
      context.invoiceCreated = true;
      context.invoice = json;
      presentInvoiceToUser(json);
    }).catch(err => console.log(err));
  }
}

function getExistingInvoice() {
  return null;
}

// Decide how to show invoice upon client requirements
// This is for simple button enabling and assigment of link property to the invoice url.
function presentInvoiceToUser(invoice) {
  context.invoiceLink.link = invoice.url;
  context.invoiceLink.show();
}


/**
 *  Event Handlers
 */

export function invoiceAmount_keyPress(event, $w) {
  validateInvoiceData();
}

export function openInvoice_click(event, $w) {
  makeInvoice();
}
