/**
 * Moyasar Invoices Module for Wix
 * -------------------------------
 *
 * @description: A Wix web modules to create and manages invoices resources.
 * @filename: backend/moyasar-invoices-app.js
 * @author: Abdullah Barrak (Moyasar Team).
 *
 *  All rights reserved – (2017)
 */

import {fetch} from 'wix-fetch';


/**
 * Change for client secret API Key ..
 */
let clientSecretKey = '';


//
// Base64 encoding & decoding are built-in in JS and Node.
// Unfortunately, they're not available on Wix.
//
// These functions are polyfill for it.
//
// Ported from: https://stackoverflow.com/a/246813
//
class Base64 {
  static encode(input) {
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = this.utf8_encode(input);

    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }

      output = output +
      _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
      _keyStr.charAt(enc3) + _keyStr.charAt(enc4);

    }
    return output;
  }

  static utf8_encode(string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      }
      else if((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  }
}


//
// Simple translation store for error messages and strings
//
class Resources {
  static initialize(lang = 'ar') {
    this.lang = lang;
    this.en = {
      generic_failure_message: 'Creating invoice failed. Please try again.',
    };

    this.ar = {
      generic_failure_message: 'فشل إنشاء الفاتورة. الرجاء المحاولة مرةً أخرى.',
    };
  }

  static t(key) {
    if (this.lang === 'en')
      return this.en[key];
    else
      return this.ar[key];
  }
}


class apiClient {
  constructor(secretKey) {
    this.apiBaseUrl = "https://api.moyasar.com/v1";
    this.secretKey = secretKey;
    this.apiAuth = "Basic " + Base64.encode(this.secretKey + ":");
  }

  makeRequest(path, method, params = null) {
    let fullUrl = this.apiBaseUrl + path;
    let headers = this.apiHeaders;
    let bodyParams = params ? JSON.stringify(params) : '';

    return fetch(fullUrl, { method: method, body: bodyParams, headers: headers }).then((httpResponse) => {
      let jsonResponse = httpResponse.json();

      if (httpResponse.ok) {
        return jsonResponse;
      } else {
        return Promise.reject(jsonResponse['message'] || Resources.t('generic_failure_message'));
      }
    });
  }

  createInvoice(amount, description = '', curreny = 'SAR') {
    let params = { 'amount': amount, 'description': description, 'currency': curreny };

    return this.makeRequest('/invoices', 'POST', params);
  }

  findInvoice(id) {
    return this.makeRequest('/invoices' + id.toString(), 'GET');
  }

  updateInvoice(id, amount, description, curreny = 'SAR') {
    let params = { 'amount': amount, 'description': description, 'currency': curreny };

    return this.makeRequest('/invoices' + id.toString(), 'PUT', params);
  }

  get apiHeaders() {
    return { 'Authorization': this.apiAuth, 'Content-Type': 'application/json' };
  }

  isInvoicePaid(invoice) {
    return invoice['status'] === 'paid';
  }

  isInvoiceDataIdentical(invoice, amount, description) {
    return invoice['amount'] == amount && invoice['description'] == description;
  }
}




//
// Start application
//
Resources.initialize();


//
// The only exposed method for front end.
// It gives back a new or refreshed invoice according to provided attributes.
//
export function obtainInvoiceForUser(amount, description, invoiceId = null) {
  let client = new apiClient(clientSecretKey);

  if (invoiceId) {
    let findResponse = client.findInvoice(invoiceId).then((json) => {
      return json;
    }).catch((error) => { return error; });


    // when find resulted in existing invoice, match its data by update in case they differ.
    //
    if (findResponse && findResponse.type === undefined) {
      let invoice = findResponse;

      if (!client.isInvoicePaid(invoice)) {
        if (client.isInvoiceDataIdentical(invoice, amount, description))
          return invoice;
        else
          return client.updateInvoice(invoice['id'], amount, description);
      }
    }
  }

  return client.createInvoice(amount, description);
}
