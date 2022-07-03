/**
 * Helper class defined to centralize events definitions in a single place and
 * send them easily by ID, minimizing potential typos in the various gtag arguments.
 */
export default class AK_Analytics {
  /**
   * Register a new event ID with its category, action and default label.
   *
   * @param events An array or object containing events definitions. See examples for accepted formats.
   *
   * @example #1 : Array of arrays defining 'eventId', 'category', 'action' and 'label' in this order.
   *
   * AK_Analytics.registerEvents([
   *   ['event-1', 'category A', 'action#1', 'default label'],
   *   ['event-2', 'category A', 'action#3', ''],
   *   ['event-3', 'category B', 'action#1', false],
   *   ['event-4', 'category C', 'action#2', null],
   * ])
   *
   * @example #2 : An array of objects defining 'eventId', 'category', 'action' and 'label' through their respective keys.
   *
   * AK_Analytics.registerEvents([
   *   { eventId: 'event-1', category: 'category A', action: 'action#1', label: 'default label']},
   *   { eventId: 'event-2', category: 'category A', action: 'action#3', label: '']},
   *   { eventId: 'event-3', category: 'category B', action: 'action#1', label: false]},
   *   { eventId: 'event-4', category: 'category C', action: 'action#2', label: null]},
   * ])
   *
   * @example #3 : An object with eventId as keys and arrays - defining 'category', 'action' and 'label' in this order - as values
   *
   * AK_Analytics.registerEvents({
   *   'event-1': ['category A', 'action#1', 'default label'],
   *   'event-2': ['category A', 'action#3', ''],
   *   'event-3': ['category B', 'action#1', false],
   *   'event-4': ['category C', 'action#2', null],
   * })
   *
   * @example #4 : An object with eventId as keys and objects - defining 'eventId', 'category', 'action' and 'label' through their respective keys - as values
   *
   * AK_Analytics.registerEvents({
   *   'event-1': { category: 'category A', action: 'action#1', label: 'default label']},
   *   'event-2': { category: 'category A', action: 'action#3', label: '']},
   *   'event-3': { category: 'category B', action: 'action#1', label: false]},
   *   'event-4': { category: 'category C', action: 'action#2', label: null]},
   * })
   */
  static registerEvents(events) {
    if (typeof events != 'object') {
      console.log("Could not register events");

      return AK_Analytics;
    }

    if (Array.isArray(events)) {
      for (let i = 0; i < events.length; i++) {
        let event = events[i];

        let eventId = event.hasOwnProperty('eventId') ? event.eventId : event[0],
          category = event.hasOwnProperty('category') ? event.category : event[1],
          action = event.hasOwnProperty('action') ? event.action : event[2],
          label = event.hasOwnProperty('label') ? event.label : event[3];

        AK_Analytics.registerEvent(eventId, category, action, label);
      }
    } else {
      for (let eventId in events) {
        let event = events[eventId];

        let category = event.hasOwnProperty('category') ? event.category : event[0],
          action = event.hasOwnProperty('action') ? event.action : event[1],
          label = event.hasOwnProperty('label') ? event.label : event[2];

        AK_Analytics.registerEvent(eventId, category, action, label);
      }
    }

    return AK_Analytics;
  }

  /**
   * Register a new event ID with its category, action and default label.
   *
   * @param eventId   Registered event ID
   * @param category  The category to group this event into
   * @param action    The action described by this event
   * @param label     A more specific label for filtering events inside the same category
   *
   * @example #1 : Register an event with a default label
   *
   * AK_Analytics.registerEvent('event-1', 'category A', 'action#1', 'default label');
   *
   * @example #2 : Register an event without label (will still be overridable when sending though)
   *
   * AK_Analytics.registerEvent('event-2', 'category A', 'action#3', '');
   * AK_Analytics.registerEvent('event-3', 'category B', 'action#1', false);
   * AK_Analytics.registerEvent('event-4', 'category B', 'action#2', null);
   */
  static registerEvent(eventId, category, action, label) {
    AK_Analytics.events[eventId] = {
      category: category,
      action:   action,
      label:    label
    };
  }

  /**
   * Sends the event registered under the specified ID with the default label from the definition or
   * the one provided here.
   *
   * @param eventId  Registered event ID
   * @param label    Label to override the default one with
   *
   * @example #1 : Send and event using its default label
   *
   * <button onclick="AK_Analytics.sendEvent('event-3')">An element to track</a>
   *
   * @example #2 : Send an event with a custom label
   *
   * <button onclick="AK_Analytics.sendEvent('event-1', 'custom label')">An element to track</a>
   */
  static sendEvent(eventId, label) {
    let event = AK_Analytics.events[eventId];

    if (!event) {
      if (AK_Analytics.debug || AK_Analytics.dryRun) {
        alert(`Event '${eventId}' not found`)
      } else {
        console.log(`Event '${eventId}' not found`)
      }

      return false
    }

    if (label) {
      AK_Analytics.sendGtag(eventId, event.category, event.action, label);
    } else if (event.label) {
      AK_Analytics.sendGtag(eventId, event.category, event.action, event.label);
    } else {
      AK_Analytics.sendGtag(eventId, event.category, event.action);
    }

    return true;
  }

  /**
   * Sends the event through google's gtag system (unless dry-running)
   * and prints debug line when applicable.
   *
   * @param eventId   Registered event ID
   * @param category  The category to group this event into
   * @param action    The action described by this event
   * @param label     A more specific label for filtering events inside the same category
   */
  static sendGtag(eventId, category, action, label) {
    if (AK_Analytics.debug) {
      console.log(`gtag : Sending event '${eventId}' (c,a,l) => '${category}', '${action}', '${label}'.`);
    }

    if (!AK_Analytics.dryRun) {
      var eventData = {
        'event_category': category,
      };

      if ( label !== undefined ) {
        eventData.event_label = label
      }

      gtag('event', action, eventData);
    }
  }

  /**
   * Inject tracking script
   */
  static inject(pixel) {
    if (!window.wp_theme.tracking)
      return;

    if (pixel) {
      if (!window.wp_theme.tracking.hasOwnProperty(pixel)) {
        console.error("Could not inject missing pixel code for " + pixel);

        return;
      }

      var scriptLines = $(window.wp_theme.tracking[pixel]);
      scriptLines.each(function(lineNbr) {
        var scriptLine = scriptLines[lineNbr];

        if (scriptLine.tagName === 'SCRIPT') {
          // Clever trick to run the script
          var script = scriptLine;
          scriptLine = document.createElement('script');
          if (script.src) {
            scriptLine.src = script.src;
          } else if (script.textContent || script.innerText) {
            var scriptContent = document.createTextNode(script.textContent || script.innerText)
            scriptLine.appendChild(scriptContent);
          }
        }

        document.head.appendChild(scriptLine)
      });
    } else {
      for (pixel in window.wp_theme.tracking){
        if (window.wp_theme.tracking.hasOwnProperty(pixel)) {
          this.inject(pixel)
        }
      }
    }
  }

  /**
   * Switches to a sandbox mode, activating dry-run and debug lines.
   */
  static sandbox() {
    AK_Analytics.dryRun = true;
    AK_Analytics.debug = true;
  }

  /**
   * Switches to a live mode, deactivating dry-run and debug lines.
   */
  static live() {
    AK_Analytics.dryRun = false;
    AK_Analytics.debug = false;
  }
}

AK_Analytics.events = {};