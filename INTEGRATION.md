# Invoices Integration

This guide goes through the needed steps to provide Moyasar Invoices in Wix website.

This is useful for customers who are interested in using invoicing solutions such as a donation system.

Please ensure to enable Developer tools in Wix prior proceeding with the following steps:


## 1. Set up Form Input with Validation

Use Wix Interactive editor to create the following user input fields:

- **Name:** text box field to hold payer name.
- **Amount:**  numeric text box field for invoice amount.
- **Description:**  a hidden field with value defined as suits merchant.

Perform `required` rule in both fields with default (2 S.R.) amount and (philanthropist) name.

Also, make sure amount is between 2 and 5000.

In addition, Add another UI button to submit the data for the invoice generation in backend.

(one)[https://raw.githubusercontent.com/moyasar/moyasar-wix/master/images/1.png]
(two)[https://raw.githubusercontent.com/moyasar/moyasar-wix/master/images/2.png]

Keep in mind that UI is flexible and should be aligned according to client's requirements.

## 2. Add Invoice Generation Code into Web Module

- Create new file in backend section of site with name `moyasarInvoicesModule.jsw`.

(three)[https://raw.githubusercontent.com/moyasar/moyasar-wix/master/images/3.png]

- Copy `backend.js` file to the newly created module in Wix backend.
- **Ensure to specifying client's API secret key** at the very first line in code using `clientSecretKey` variable.

(four)[https://raw.githubusercontent.com/moyasar/moyasar-wix/master/images/4.png]


## 3. Interact via Front-End with Web Module and Finalize Process

- Open the script panel of the user invoicing screen we have built UI for previously.
- Add the logic from `frontend.js`.
- Adjust description according to client's specification and needs.
- Set all the needed UI textboxes and buttons with validation and event handlers if any.

(five)[https://raw.githubusercontent.com/moyasar/moyasar-wix/master/images/5.png]

## 4. Design and Code Supporting LightBox UI

Add lighbox widget for user popup upon invoice generation result reception, as the following:
1. Create new lightbox from Wix toolbox.
2. Copy `lightbox_ui.js` to the lightbox code panel.
3. Add three text lables with the names according to `$w` elements in `lightbox_ui.js` file.
4. Ensure to change lightbox name, and id to `thankYouLightbox`
5. Specify lightbox settings for not showing automatically and with appropriate background color.

(five)[https://raw.githubusercontent.com/moyasar/moyasar-wix/master/images/5.png]
(five)[https://raw.githubusercontent.com/moyasar/moyasar-wix/master/images/5.png]

## 5. Publish and Test

Publish the site after steps completed and verify it's functioning properly with Moyasar Invoices.


## 6. Customize

You're likely will have different imaginary view from the customer in regard of UI, message notices, design, etc.

In theses cases, use Wix Editor, JavaScript, [HTML Component](https://support.wix.com/en/article/working-with-the-html-component-in-wix-code), and even other [Wix Apps from the market](https://www.wix.com/app-market/main) to fulfill the requirements.


(coding)[https://raw.githubusercontent.com/moyasar/moyasar-wix/master/images/code.jpg]
