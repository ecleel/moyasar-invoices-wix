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

import wixWindow from 'wix-window';
import {local} from 'wix-storage';
import {obtainInvoiceForUser} from 'backend/moyasarInvoicesModule';

var context = {
  invoiceExsits: false,
  invoice: null
};

$w.onReady(function () {
  loadUI();
  defineTranslations();
  defineCustomValidations();
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
      notValidAmount: 'Amount number is not valid',
    },

    ar: {
      error: 'خطأ',
      notValidAmount: 'المبلغ المدخل عير صالح. الرجاء إدخال قيمة رقمية بين ٢ و ٥٠٠٠ ريال.',
    }
  };
}

function defineCustomValidations() {
  context.amountField.onChange( (event, $w) => {
    validateInvoiceAmount(event.target.value);
  });

  context.nameField.onChange( (event, $w) => {
    validateInvoiceName(event.target.value);
  });
}

function t(key, lang='ar') {
  return context.resources[lang][key];
}

function validateInvoiceCommonData(allValid) {
  if (allValid) {
    context.generateBtn.enable();
  } else {
    context.generateBtn.disable();
  }
}

function validateInvoiceAmount(amountNewValue) {
  let isAmountValid = validateNumber(amountNewValue);
  if (isAmountValid)
    context.amountValidationMsg.hide();
  else
    context.amountValidationMsg.show();

  validateInvoiceCommonData(isAmountValid && context.nameField.valid);
}

function validateInvoiceName(nameNewValue) {
  let isNameValid = validateName(nameNewValue);

  if (isNameValid)
    context.nameValidationMsg.hide();
  else
    context.nameValidationMsg.show();

  validateInvoiceCommonData(isNameValid && context.amountField.valid);
}

function validateName(n) {
  return n.replace(/\s/g, "").length > 0 ? true : false;
}

function validateNumber(x) {
  var parts = x.split(".");

  if (typeof parts[1] == "string" && (parts[1].length == 0 || parts[1].length > 2))
      return false;
  var n = parseFloat(x);

  if (isNaN(n))
      return false;
  if (n < 2 || n > 5000)
      return false;

  return true;
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

function getExistingOrNewInvoice(invoiceGenButton) {
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

    invoiceGenButton.enable();
    context.invoiceLink.enable();

  }).catch((error) => {
    reportErrorModally(error);

    invoiceGenButton.enable();
    context.invoiceLink.enable();
  });
}

// Decide how to show invoice upon client requirements
// This is for simple button enabling and assigment of link property to the invoice url.
function presentInvoiceToUser(invoice) {
  context.invoiceLink.link = invoice.url;
  context.invoiceLink.show();
}

// When troubles strikes, show the error message from API/backend-module to the user.
function reportErrorModally(error) {
  transitionToApologyScreen();
  console.log("[System Error Reporter]: \n" + error);
}

// Reveal the thank you message widget and hide invoices generation UI upon successful creation.
function transitionToThanksScreen() {
  wixWindow.openLightbox('thankYouLightbox', { link: context.invoiceLink.link });
}

function transitionToApologyScreen() {
  wixWindow.openLightbox(
    'thankYouLightbox',
    { link: '', title: "خطأ", text: "نأسف حدث خطأ ما ! يرجى الحاولة مرة أخرى." }
  );
}

/**
 *  Event Handlers
 */

export function openInvoice_click(event, $w) {
  var _btn = event.target;

  if (_btn.enabled) {
    _btn.disable();
    context.invoiceLink.disable();
    getExistingOrNewInvoice(_btn);
  }
}
