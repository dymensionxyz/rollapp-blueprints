// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title EventManager
 * @dev Implements a stateful event system, which is more reliable and convenient to use compared to
 * the standard log-based event system. This moves the responsibility of handling events from the
 * backend to the smart contract.
 *
 * The contract is designed to be inherited by other contracts that need to manage events.
 *
 * The contract has a fixed buffer size for each event type. If the buffer is full, the contract
 * will not accept new events of that type through {insertEvent} until some events are removed using {eraseEvent}.
 * Additionally, the contract provides a function {getEvents} to retrieve all events of a specific type.
 *
 * The contract uses a specific data structure to store events, which is optimized for the most common
 * operations:
 *  - `_eventsByType` is a mapping from event type to an indexed array of events `EventEntries`, which helps
 *    to quickly retrieve all events of a specific type.
 *  - `EventEntries` contains an array of events and a mapping from event ID to the index in the array, which
 *    helps quick lookup.
 */
abstract contract EventManager {
    struct Event {
        uint64 eventId; // Unique identifier for the event
        uint16 eventType;
        bytes data; // Arbitrary data associated with the event
    }

    struct EventEntries {
        Event[] data;
        mapping(uint64 => uint64) dataIdxByEventId; // Mapping from event ID to index in the array
    }

    mapping(uint16 => EventEntries) private _eventsByType;

    // Maximum number of events that can be stored for each event type
    uint private _eventBufferSize;

    /**
     * @dev Constructor to initialize the event buffer size.
     * @param bufferSize The maximum number of events that can be stored for each event type.
     */
    constructor(uint bufferSize) {
        _eventBufferSize = bufferSize;
    }

    /**
     * @dev Internal function to insert a new event.
     * @param eventId The unique identifier for the event.
     * @param eventType The type of the event.
     * @param data The data associated with the event.
     */
    function insertEvent(uint64 eventId, uint16 eventType, bytes memory data) internal {
        Event[] storage events = _eventsByType[eventType].data;
        require(events.length < _eventBufferSize, "Event buffer is full");

        events.push(Event(eventId, eventType, data));
        _eventsByType[eventType].dataIdxByEventId[eventId] = uint64(events.length) - 1;
    }

    /**
     * @dev Internal function to erase an existing event.
     * @param eventId The unique identifier for the event.
     * @param eventType The type of the event.
     */
    function eraseEvent(uint64 eventId, uint16 eventType) internal {
        EventEntries storage entries = _eventsByType[eventType];

        uint64 index = entries.dataIdxByEventId[eventId];
        require(index < entries.data.length, "Event does not exist");

        // Swap the last event with the one to delete and then pop the last.
        // If the element to delete is the last one, it's just removed.
        // It implies O(1) deletion.
        uint64 lastIndex = uint64(entries.data.length) - 1;
        if (index != lastIndex) {
            Event storage lastEvent = entries.data[lastIndex];
            entries.data[index] = lastEvent;
            entries.dataIdxByEventId[lastEvent.eventId] = index;
        }

        entries.data.pop();
        delete entries.dataIdxByEventId[eventId];
    }

    /**
     * @dev Internal function to retrieve all events of a specific type.
     * @param eventType The type of the events to retrieve.
     * @return An array of events of the specified type.
     */
    function getEvents(uint16 eventType) internal view returns (Event[] memory) {
        EventEntries storage entries = _eventsByType[eventType];
        return entries.data;
    }
}
