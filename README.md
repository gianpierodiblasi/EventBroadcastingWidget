# EventBroadcastingWidget
An extension to generate events to be broadcasted.

## Description
This extension provides a widget to broadcast events. Sometimes it is necessary send an event from a portion of a mashup to another portion of a mashup (for example two diffent contained mashups within a mashup or a portion of the master mashup). This widget provides an useful tool to perform this task.
This widget can be configured to behave in two different ways:
- as a sender: it will send events
- as a receiver: it will receive events

Both senders and receivers have to define an unique eventName used to "connect" them.

## Properties
- debugMode - BOOLEAN (default = false): if set to true it sends to the browser's JS console a set of information useful for debugging the widget
- eventName - STRING (no default value): the (unique) event name as described above
- eventParameters - JSON (default = {}): the JSON object describing the event parameters having parameter names as key and data type as value, for example {"minTemp": "STRING"}
- mode - STRING (default = 'sender'): the mode as described above (options: sender, receiver)
- other properties depending on the eventParameters property

## Services
- Trigger: service to send an event

## Events
- Triggered: event to receive an event

## Donate
If you would like to support the development of this and/or other extensions, consider making a [donation](https://www.paypal.com/donate/?business=HCDX9BAEYDF4C&no_recurring=0&currency_code=EUR).
