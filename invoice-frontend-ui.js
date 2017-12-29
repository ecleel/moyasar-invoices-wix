/**
 * Moyasar Invoices UI Code for Wix
 * ---------------------------------
 *
 * @description: A Wix scripts to launch and prepare the invoice generation interface.
 * @filename: moyasar-frontend-ui.js
 * @author: Abdullah Barrak (Moyasar Team).
 *
 *  All rights reserved – (2017).
 */

import wixWindow from 'wix-window';
import {local, session} from 'wix-storage';
import {obtainInvoiceForUser} from 'backend/moyasarInvoicesModule';

var context = { invoiceCreated: false };

$w.onReady(function () {
  loadUI();
});

function loadUI () {
  context.nameField           = $w("#invoiceName");
  context.amountField         = $w("#invoiceAmount");
  context.generateBtn         = $w("#openInvoice");
  context.amountValidationMsg = $w("#amountErrMsg");
  context.nameValidationMsg   = $w("#nameErrMsg");
  context.invoiceLink         = $w("#invoiceLink");
}


export function validateInvoiceData() {
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

export function openInvoice_click(event, $w) {
  makeInvoice();
}

export function makeInvoice() {
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

export function invoiceAmount_keyPress(event, $w) {
  validateInvoiceData();
}
