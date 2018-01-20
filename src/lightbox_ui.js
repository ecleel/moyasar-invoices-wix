/**
 * Moyasar Invoices UI Code for Wix
 * ---------------------------------
 *
 * @description: A Wix script for result light box logic.
 * @filename: lightbox_ui.js
 * @author: Abdullah Barrak (Moyasar Team).
 *
 *  All rights reserved. (2017 - 2018)
 */

import wixWindow from 'wix-window';


$w.onReady(function () {
  let lightboxData = wixWindow.lightbox.getContext();

  $w('#noticeBoxTitle').text = lightboxData.title || "شكراً لكم";
  $w('#noticeBoxText').text  = lightboxData.text  || "تم إنشاء فاتورة التبرع بنجاح !";
  $w('#noticeBoxLink').link  = lightboxData.link;
});
