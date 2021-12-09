/* global TW */
TW.Runtime.Widgets.eventbroadcasting = function () {
  var thisWidget = this;
  var uid = new Date().getTime() + "_" + Math.floor(1000 * Math.random());

  this.runtimeProperties = function () {
    var mode = thisWidget.getProperty('mode');

    if (mode === "sender") {
      var eventParametersDataShape = this.strToJson(thisWidget.getProperty('_EventParametersDataShape'));

      var propertyAttributes = {
      };

      for (var key in eventParametersDataShape) {
        if (eventParametersDataShape[key] === "STRING") {
          propertyAttributes[key] = {'isLocalizable': true};
        }
      }
    }

    return {
      'needsDataLoadingAndError': false,
      propertyAttributes: propertyAttributes
    };
  };

  this.renderHtml = function () {
    var html = '';
    html = '<div class="widget-content widget-eventbroadcasting" style="display:none;"></div>';
    return html;
  };

  this.afterRender = function () {
    if (thisWidget.getProperty('mode') === "receiver" && thisWidget.getProperty('eventName')) {
      var eventName = thisWidget.getProperty('eventName');

      $(document).on("eventbroadcastingwidget_eventBroadcasting_" + eventName.replaceAll(".", "_") + ".eventbroadcastingwidget_eventBroadcasting_" + uid, function (event, json) {
        var debugMode = thisWidget.getProperty('debugMode');

        if (debugMode) {
          console.log("EventBroadcasting - triggered -> Start");
          console.log("EventBroadcasting - triggered -> event = " + eventName);
          console.log("EventBroadcasting - triggered -> json = " + JSON.stringify(json));
        }

        var eventParametersDataShape = thisWidget.strToJson(thisWidget.getProperty('_EventParametersDataShape'));
        for (var key in eventParametersDataShape) {
          switch (eventParametersDataShape[key]) {
            case "INTEGER":
              thisWidget.setProperty(key, parseInt(json[key], 10));
              break;
            case "NUMBER":
              thisWidget.setProperty(key, parseFloat(json[key]));
              break;
            case "DATETIME":
              thisWidget.setProperty(key, new Date(json[key]));
              break;
            case "BOOLEAN":
              thisWidget.setProperty(key, json[key] === 'true' || json[key] === true);
              break;
            default:
              thisWidget.setProperty(key, json[key]);
              break;
          }
        }
        thisWidget.jqElement.triggerHandler('Triggered');

        if (debugMode) {
          console.log("EventBroadcasting - triggered -> Stop");
        }
      });
    }
  };

  this.serviceInvoked = function (serviceName) {
    if (serviceName === 'Trigger' && thisWidget.getProperty('mode') === "sender" && thisWidget.getProperty('eventName')) {
      var json = {};
      var debugMode = thisWidget.getProperty('debugMode');
      var eventName = thisWidget.getProperty('eventName');
      var eventParametersDataShape = this.strToJson(thisWidget.getProperty('_EventParametersDataShape'));

      for (var key in eventParametersDataShape) {
        json[key] = thisWidget.getProperty(key);
      }

      if (debugMode) {
        console.log("EventBroadcasting - trigger -> Start");
        console.log("EventBroadcasting - trigger -> event = " + eventName);
        console.log("EventBroadcasting - trigger -> json = " + JSON.stringify(json));
      }

      $(document).trigger("eventbroadcastingwidget_eventBroadcasting_" + eventName.replaceAll(".", "_"), json);

      if (debugMode) {
        console.log("EventBroadcasting - trigger -> Stop");
      }
    }
  };

  this.updateProperty = function (updatePropertyInfo) {
    if (updatePropertyInfo.TargetProperty === 'eventName') {
      this.setProperty("eventName", updatePropertyInfo.RawSinglePropertyValue);
      this.afterRender();
    } else if (updatePropertyInfo.TargetProperty === 'mode') {
      this.setProperty("mode", updatePropertyInfo.RawSinglePropertyValue);
      this.afterRender();
    } else {
      var eventParametersDataShape = this.strToJson(this.getProperty('_EventParametersDataShape'));

      if (updatePropertyInfo.TargetProperty in eventParametersDataShape) {
        switch (eventParametersDataShape[updatePropertyInfo.TargetProperty]) {
          case "INTEGER":
            this.setProperty(updatePropertyInfo.TargetProperty, parseInt(updatePropertyInfo.SinglePropertyValue, 10));
            break;
          case "NUMBER":
            this.setProperty(updatePropertyInfo.TargetProperty, parseFloat(updatePropertyInfo.SinglePropertyValue));
            break;
          case "DATETIME":
            this.setProperty(updatePropertyInfo.TargetProperty, new Date(updatePropertyInfo.SinglePropertyValue));
            break;
          case "BOOLEAN":
            this.setProperty(updatePropertyInfo.TargetProperty, updatePropertyInfo.SinglePropertyValue === 'true' || updatePropertyInfo.SinglePropertyValue === true);
            break;
          default:
            this.setProperty(updatePropertyInfo.TargetProperty, updatePropertyInfo.RawSinglePropertyValue);
            break;
        }
      }
    }
  };

  this.strToJson = function (value) {
    if (!value) {
      value = {};
    } else if (typeof value === "string") {
      value = JSON.parse(value);
    }
    return value;
  };

  this.beforeDestroy = function () {
    if (thisWidget.getProperty('mode') === "receiver") {
      try {
        $(document).off("eventbroadcastingwidget_eventBroadcasting_" + thisWidget.getProperty('eventName').replaceAll(".", "_") + ".eventbroadcastingwidget_eventBroadcasting_" + uid);
      } catch (err) {
        TW.log.error('EventBroadcasting Before Destroy Error', err);
      }
    }
  };
};