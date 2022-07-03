import AjaxRequest from './ajax-request';

export default class AjaxForm extends AjaxRequest {
  /**
   * Ajax form helper.
   * Handles common behaviours for ajax forms :
   * - Disable inputs when sending data and after request success
   * - Show incorrect fields with optional field message
   * - Trigger events on success and failure
   * - Allow configuration through constructor options
   *
   * @param form The form element to work with (as returned by jQuery)
   * @param opts List of options to configure the form behaviour.
   *  @option endpoint            The url to send the data to
   *                              (default: form action attribute)
   *  @option method              The method used to send the data to the endpoint
   *                              (default: form method attribute)
   *
   *  @option fieldsSelector      The jQuery selector string used to find the fields inside the form.
   *                              This is used to add error class and display validation hints.
   *                              (default: '.form-field')
   *  @option fieldHintSelector   The jQuery selector string used to find the fields validation hints inside the form.
   *                              This is used to show validation error messages for each specific incorrect fields.
   *                              (default: false => no hint)
   *  @option inputsSelector      The jQuery selector string used to find the inputs inside the form.
   *                              This is used to enable and disable the inputs while sending the data and
   *                              after success.
   *                              (default: 'input, select')
   *  @option submitSelector      The jQuery selector string used to find the submit button inside the form.
   *                              This is used to enable and disable the button while sending the data and
   *                              after success.
   *                              (default: '[type=submit]')
   *
   *  @option loadingClass        The class added the form and the submit button while the data is being sent.
   *                              (default: 'is-loading')
   *  @option fieldErrorClass     The class added to the fields for which backend validation failed.
   *                              The fields are found using the jQuery selector defined by the 'fieldsSelector' option.
   *                              (default: 'error')
   *
   *  @option successEvent        The event to fire from the form on success.
   *                              (default: 'ajax:success')
   *  @option failureEvent        The event to fire from the form on failure.
   *                              (default: 'ajax:failure')
   *
   *  @option checkForTrueSuccess Anonymous function to decide whether or not the accepted response from the web-service
   *                              can be considered as a success. Some web-services providers have a bad habit of returning
   *                              an OK status even after receiving bad request inputs instead of returning a 400.
   *                              Should return a boolean (true for a true success and false for a false one).
   *                              (default: returns true)
   *  @option onSuccess           Anonymous function to call when the request has succeeded. (Bound to context)
   *                              (default: triggers the @option successEvent event)
   *  @option onFailure           Anonymous function to call when the request has failed. (Bound to context)
   *                              (default: triggers the @option failureEvent event)
   *
   *  @option onRequestStart      Anonymous function to call when the request has just been sent. (Bound to context)
   *                              (default: add @option loadingClass to form and @option submitSelector)
   *                              Note : default behaviour will still be executed, unless your custom function returns false.
   *  @option onRequestStop       Anonymous function to call when the request has just received a response. (Bound to context)
   *                              (default: remove @option loadingClass from form and @option submitSelector)
   *                              Note : default behaviour will still be executed, unless your custom function returns false.
   *  @option appendFields        Append the following string defining additional fields to append to the form before sending it.
   *                              (default: '')
   *
   * @example
   *
   * let form = new AjaxForm($('form#my-form'), {
   *     fieldsSelector: '.fields',
   *     fieldErrorClass: 'validation-error',
   *     onRequestStart: function() {
   *         this.form.find('div.field-set').hide();
   *         this.form.find('spinner').show();
   *     },
   *     onRequestStop: function() {
   *         this.form.find('div.field-set').show();
   *         this.form.find('spinner').hide();
   *     },
   *     onSuccess: function() {
   *         this.form.remove();
   *         $('#formSuccess').show();
   *     }
   * })
   */
  constructor(form, opts) {
    super(Object.assign({
      method: form.attr('method'),
      endpoint: form.attr('action'),
    }, opts));

    this.form = form;

    this.opts = Object.assign(this.opts, {
      fieldsSelector: '.form-field',
      fieldHintSelector: false,
      inputsSelector: 'input, select',
      submitSelector: '[type="submit"]',
      loadingClass: 'is-loading',
      fieldErrorClass: 'error',
      validationErrorsPath: ['data', 'params']
    }, opts || {});

    this.inputs = this.form.find(this.opts.inputsSelector);
    this.fields = this.form.find(this.opts.fieldsSelector);
    this.submit = this.form.find(this.opts.submitSelector);

    this.bindEvents();
  }

  onRequestStart() {
    if (this.doCustomAndMaybeDefault('onRequestStart')) {
      // Default behavior

      this.form.addClass(this.opts.loadingClass);
      this.submit.addClass(this.opts.loadingClass);
    }

    this.disableInputs();
  }

  onRequestStop() {
    if (this.doCustomAndMaybeDefault('onRequestStop')) {
      // Default behavior

      this.form.removeClass(this.opts.loadingClass);
      this.submit.removeClass(this.opts.loadingClass);
    }
  }

  parseResponse(response) {
    if (!response) {
      return response
    }

    if (typeof response !== 'object') {
      try {
        response = JSON.parse(response)
      } catch (e) {
        return response
      }
    }

    if (response.responseJSON && typeof response.responseJSON === 'object' ) {
      return response.responseJSON;
    } else if (response.responseText) {
      try {
        return JSON.parse(response.responseText)
      } catch (e) {
        return response.responseText
      }
    } else {
      return response
    }
  }

  addValidationErrors() {
    if (!this.opts.validationErrorsPath)
      return;

    let path = this.opts.validationErrorsPath;
    let validationErrors = {};

    switch (typeof path) {
      case 'function':
        validationErrors = path.bind(this)() || {};
        break;
      case 'string':
        validationErrors = this.response[path] || {};
        break;
      default:
        if (Array.isArray(path)) {
          validationErrors = this.response || {};
          path.forEach((p) => validationErrors = validationErrors[p] || {})
        }
        break;
    }

    if (Object.keys(validationErrors).length === 0)
      return;

    if (Array.isArray(validationErrors)) {
      validationErrors = validationErrors.reduce((validations, inputName) => Object.assign(validations, {[inputName]: ""}))
    }

    for (let inputName in validationErrors) {
      let input = this.form.find('[name="' + inputName + '"]');
      let field = input.closest(this.opts.fieldsSelector);
      let hint = this.opts.fieldHintSelector && field.find(this.opts.fieldHintSelector);

      if (hint && validationErrors.hasOwnProperty(inputName) && validationErrors[inputName]) {
        hint.html(validationErrors[inputName]);
      }

      field.addClass(this.opts.fieldErrorClass);
    }
  }

  reset() {
    if (this.doCustomAndMaybeDefault('onReset')) {
      // Default behavior

      this.removeAllErrors();
      this.enableInputs();
      this.inputs.blur();
    }

    this.form[0].reset()
  }

  removeAllErrors() {
    this.fields.removeClass(this.opts.fieldErrorClass);
  }

  disableInputs() {
    this.inputs.attr('disabled', 'disabled');
    this.submit.attr('disabled', 'disabled');
  }

  enableInputs() {
    this.inputs.removeAttr('disabled');
    this.submit.removeAttr('disabled');
  }

  onRequestSuccess(response) {
    this.response = this.parseResponse(response);

    this.onRequestStop();
    this.removeAllErrors();

    this.onSuccess();

    this.reset();
  }

  onRequestFailure(response) {
    this.response = this.parseResponse(response);

    this.onRequestStop();
    this.removeAllErrors();

    this.addValidationErrors();
    this.enableInputs();

    this.onFailure();
  }

  buildRequest() {
    if (this.opts.appendFields) {
      this.form.append(this.opts.appendFields)
    }

    return {
      method: this.opts.method,
      url: this.opts.endpoint,
      data: new FormData(this.form.get(0)),
      processData: false,
      contentType: false
    };
  }

  bindEvents() {
    let self = this;

    this.form.on('submit', function (e) {
      e.preventDefault();

      self.execute.bind(self)();
    })
  }
}