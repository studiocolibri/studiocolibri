import AjaxForm from './ajax-form';

export default class MailchimpForm extends AjaxForm {
  constructor (form, opts) {
    super(form, Object.assign({
      fieldHintSelector: false,
      validationErrorsPath: false,
      checkForTrueSuccess: function (response) {
        this.enableInputs();

        return response && response.result === 'success';
      }
    }, opts));
  }

  buildRequest() {
    return {
      method: this.opts.method,
      url: this.opts.endpoint,
      data: this.form.serialize(),
      cache: false,
      dataType: 'jsonp',
      jsonp: 'c',
      contentType: "application/json; charset=utf-8"
    };
  }

  parseResponse(response) {
    return response
  }

  static register(email, config) {
    let form = $('<form>').attr('action', config.endpoint).attr('method', 'post');

    $('<input type="hidden">').attr('name', 'EMAIL').attr('value', email).appendTo(form);
    $('<input type="hidden">').attr('name', config.listKey).attr('value', "").appendTo(form);

    if (config.groups) {
      for (var groupName in config.groups) {
        if (!config.groups.hasOwnProperty(groupName)) {
          continue
        }

        var group = config.groups[groupName];

        for (var j = 0; j < group.options.length; j++) {
          var option = group.options[j];

          $('<input type="hidden">').attr('name', 'group[' + group.id + '][' + option + ']').attr('value', '1').appendTo(form);
        }
      }
    }

    let mailchimpForm = new MailchimpForm(form);

    mailchimpForm.form.submit();

    return mailchimpForm;
  };
}