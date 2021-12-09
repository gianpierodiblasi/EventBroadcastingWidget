/* global TW */
TW.IDE.Widgets.eventbroadcasting = function () {
  this.widgetIconUrl = function () {
    return '../Common/extensions/EventBroadcastingWidget/ui/eventbroadcasting/arrows.png';
  };

  this.widgetProperties = function () {
    return {
      'name': 'EventBroadcasting',
      'description': 'Widget to generate events to be broadcasted',
      'category': ['Common'],
      'iconImage': 'arrows.png',
      'properties': {
        'Width': {
          'description': 'width',
          'defaultValue': 200
        },
        'Height': {
          'description': 'height',
          'defaultValue': 28
        },
        'eventName': {
          'baseType': 'STRING',
          'isBindingTarget': true,
          description: "The (unique) event name"
        },
        eventParameters: {
          baseType: 'JSON',
          defaultValue: '{}',
          description: 'The JSON object describing the event parameters having parameter names as key and data type as value; ex. {"minTemp": "STRING"}'
        },
        'mode': {
          'isBindingTarget': false,
          'description': 'Sender = this widget is an event generator, Receiver = this widget is an event receiver',
          'baseType': 'STRING',
          'defaultValue': 'sender',
          'selectOptions': [
            {value: 'sender', text: 'Sender'},
            {value: 'receiver', text: 'Receiver'}
          ]
        },
        'debugMode': {
          'isVisible': true,
          'baseType': 'BOOLEAN',
          'isEditable': true,
          'defaultValue': false,
          'description': 'true to activate the debug'
        }
      }
    };
  };

  this.renderHtml = function () {
    return '<div class="widget-content widget-eventbroadcasting">' + '<span class="eventbroadcasting-property">Event Broadcasting</span>' + '</div>';
  };

  this.afterRender = function () {
    this.setProperty('_EventParametersDataShape', '{}');
    this.addNewEventParameters(this.getProperty("eventParameters"), this.getProperty('mode'));
  };

  this.afterSetProperty = function (name, value) {
    var thisWidget = this;
    var result = false;

    if (name === 'eventParameters' || name === 'mode') {
      this.deleteOldEventParameters();

      switch (name) {
        case "eventParameters":
          if (value === '') {
            thisWidget.resetJSON(name);
          } else if (!this.addNewEventParameters(value, this.getProperty('mode'))) {
            TW.IDE.showStatusText('error', 'eventParameters: the JSON object is not valid, or one of the parameter names is reserved, or a type other than STRING, INTEGER, NUMBER, DATETIME, BOOLEAN, INFOTABLE has been indicated.');
            thisWidget.resetJSON(name);
          }
          break;
        case "mode":
          if (!this.addNewEventParameters(this.getProperty("eventParameters"), value)) {
            TW.IDE.showStatusText('error', 'eventParameters: the JSON object is not valid, or one of the parameter names is reserved, or a type other than STRING, INTEGER, NUMBER, DATETIME, BOOLEAN, INFOTABLE has been indicated.');
            thisWidget.resetJSON(name);
          }
          break;
      }
    }

    return result;
  };

  this.deleteOldEventParameters = function () {
    var properties = this.allWidgetProperties().properties;
    var oldDataShape = this.strToJson(this.getProperty('_EventParametersDataShape'));

    for (var key in oldDataShape) {
      delete properties[key];
    }

    delete properties["Trigger"];
    delete properties["Triggered"];
  };

  this.addNewEventParameters = function (newEventParameters, mode) {
    var properties = this.allWidgetProperties().properties;
    newEventParameters = this.strToJson(newEventParameters);
    var allowedTypes = ["STRING", "INTEGER", "NUMBER", "DATETIME", "BOOLEAN", "INFOTABLE"];

    for (var key in newEventParameters) {
      if (newEventParameters.hasOwnProperty(key) && properties[key]) {
        this.setProperty('_EventParametersDataShape', '{}');
        return false;
      } else if (allowedTypes.indexOf(newEventParameters[key]) === -1) {
        this.setProperty('_EventParametersDataShape', '{}');
        return false;
      }
    }

    for (var key in newEventParameters) {
      properties[key] = {
        isBaseProperty: false,
        name: key,
        type: 'property',
        isVisible: true,
        isEditable: mode === "sender",
        isBindingTarget: mode === "sender",
        isBindingSource: mode === "receiver",
        baseType: newEventParameters[key]
      };

      if (mode === "sender" && newEventParameters[key] === "STRING") {
        properties[key].isLocalizable = true;
      }
    }

    this.setProperty('_EventParametersDataShape', this.jsonToStr(this.getProperty('eventParameters')));

    properties[mode === "sender" ? "Trigger" : "Triggered"] = {
      name: mode === "sender" ? "Trigger" : "Triggered",
      type: mode === "sender" ? "service" : "event",
      isVisible: true
    };

    this.updatedProperties({
      updateUI: true
    });
    return true;
  };

  this.jsonToStr = function (value) {
    if (!value) {
      value = "{}";
    } else if (typeof value !== "string") {
      value = JSON.stringify(value);
    }
    return value;
  };

  this.strToJson = function (value) {
    if (!value) {
      value = {};
    } else if (typeof value === "string") {
      value = JSON.parse(value);
    }
    return value;
  };

  this.resetJSON = function (name) {
    this.setProperty(name, '{}');
    TW.IDE.updateWidgetPropertiesWindow();
  };
};