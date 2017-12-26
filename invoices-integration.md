# Invoices Integration

This guide goes through the needed steps to provide Moyasar Invoices in Wix website.

This is useful for entities who are interested in using invoicing solutions such as a donation system.

Please ensure to enable Developer tools in Wix prior proceeding with the following steps:


## 1. Set up Form Input with Validation

Use Wix Interactive editor to create the following user input fields:

- **Name:** text box field to hold payer name.
- **Amount:**  numeric text box field for invoice amount.
- **Description:**  a hidden field with value defined as suits merchant.

Perform `required` rule in both fields with default (2 S.R.) amount and (philanthropist) name.

Also, make sure amount is between 2 and 5000.

In addition, Add another UI button to submit the data for the invoice generation.

(one)[https://raw.githubusercontent.com/moyasar/moyasar-wix/master/images/1.png]
(two)[https://raw.githubusercontent.com/moyasar/moyasar-wix/master/images/2.png]


## 2. Add Invoice Generation Code into Web Module

- Create new file in backend section of site with name `invoicesModule.jsw`.
- Copy `moyasar-invoices-app.js` file here to the newly created module in Wix backedn.
- Ensure to specifiy client secret key at the very first line in code using `clientSecretKey` varibale.


## 3. Interact via Front-End with Web Module and Finalize Process


## 4. Save Current User's Invoice Reference in Browser Store


## 5. Publish and Test

Publish the Site after steps completed and verify proper functionality with Moyasar Invoices.
