export default class AjaxRequest {
    /**
     * Ajax request helper.
     * Handles common behaviours for ajax forms :
     * - Disable inputs when sending data and after request success
     * - Show incorrect fields with optional field message
     * - Trigger events on success and failure
     * - Allow configuration through constructor options
     *
     * @param opts List of options to configure the form behaviour.
     *  @option endpoint            The url to send the data to
     *  @option method              The method used to send the data to the endpoint
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
     *  @option wpRestNonce         Default WP REST API nonce for making ajax requests. Must be created with the default action
     *                              for REST API calls : 'wp_rest'
     *
     * @example
     *
     * let request = new AjaxRequest({
     *     onRequestStart: function() {
     *         $('div.field-set').hide();
     *         $('spinner').show();
     *     },
     *     onRequestStop: function() {
     *         $('div.field-set').show();
     *         $('spinner').hide();
     *     },
     *     onSuccess: function() {
     *         $('#success').show();
     *     }
     * });
     *
     * request.execute({some: 'data'})
     */
    constructor(opts) {
        this.response = null;

        this.opts = Object.assign({
            successEvent: 'ajax:success',
            failureEvent: 'ajax:failure'
        }, opts || {});
    }
    
    /**
     * Verifies if the provided option has been defined and match the given type if given.
     *
     * @param name Required. The name of the option
     * @param type Optional. The expected type of the option's value
     *
     * @returns {boolean}
     */
    optionDefined(name, type) {
        if (!this.opts.hasOwnProperty(name))
            return false;

        if (type) return typeof this.opts[name] === type;

        return true;
    }

    /**
     * Applies the custom action if defined and return whether or not
     * to carry on with the default behaviour or not.
     *
     * @param name The name of the custom action
     *
     * @returns {boolean}
     */
    doCustomAndMaybeDefault(name) {
        let doDefault = true;

        if (this.optionDefined(name, 'function')) {
            doDefault = (this.opts[name].bind(this)() !== false);
        }

        return doDefault;
    }

    onRequestStart() {
        if (this.doCustomAndMaybeDefault('onRequestStart')) {

        }
    }

    onRequestStop() {
        if (this.doCustomAndMaybeDefault('onRequestStop')) {

        }
    }

    onSuccess() {
        if (this.optionDefined('onSuccess', 'function')) {
            this.opts.onSuccess.bind(this)();
        }
    }

    onFailure() {
        if (this.optionDefined('onFailure', 'function')) {
            this.opts.onFailure.bind(this)();
        }
    }

    checkForTrueSuccess(response) {
        if (this.optionDefined('checkForTrueSuccess', 'function')) {
            return this.opts.checkForTrueSuccess.bind(this)(response);
        }

        return true;
    }

    buildRequest() {
        return {
            method: this.opts.method,
            url: this.opts.endpoint,
            data: {}
        };
    }

    parseResponse(response) {
        return response;
    }

    onRequestDone(response) {
        if (this.checkForTrueSuccess (response)) {
            this.onRequestSuccess(response);
        } else {
            this.onRequestFailure(response);
        }
    }

    onRequestSuccess(response) {
        this.response = this.parseResponse(response);

        this.onRequestStop();

        this.onSuccess();
    }

    onRequestFailure(response) {
        this.response = this.parseResponse(response);

        this.onRequestStop();

        this.onFailure();
    }

    execute(data) {
        let requestParameters = this.buildRequest();

        if ( data) {
            requestParameters.data = data;
        }

        var wpRestNonce = this.opts.wpRestNonce;
        if (wpRestNonce) {
          var defaultBeforeSend = requestParameters.beforeSend;
          if (defaultBeforeSend) {
            requestParameters.beforeSend = function ( xhr ) {
              defaultBeforeSend(xhr);

              xhr.setRequestHeader( 'X-WP-Nonce', wpRestNonce );
            }
          } else {
            requestParameters.beforeSend = function ( xhr ) {
              xhr.setRequestHeader( 'X-WP-Nonce', wpRestNonce );
            }
          }
        }

        let request = $.ajax(requestParameters);

        this.onRequestStart();

        this.response = null;

        $.when(request).then(this.onRequestDone.bind(this), this.onRequestFailure.bind(this))
    }
}