const events = {};

function subscribe(tag, fn) {
  if (typeof fn !== 'function')
    throw new Error(`Tried to subscribe a non-function to ${tag} event.`);
  if (events[tag]) events[tag].push(fn);
  else events[tag] = [fn];
}

function unsubscribe(tag, fnToRemove) {
  if (events[tag]) {
    events[tag] = events[tag].filter((fn) => fn !== fnToRemove);
    if (events[tag].length < 1) delete events[tag];
  }
}

function publish(tag, ...data) {
  // In a try catch block, since the user could provide any kind of arguments to be passed onto the
  // subscribed functions - which may not match the function's expected parameters
  try {
    if (events[tag]) {
      events[tag].forEach((fn) => {
        fn(...data);
      });
    }
  } catch (error) {
    throw new Error(`${error.name}: ${error.message}. Event tag: ${tag}`);
  }
}

function clear() {
  // eslint-disable-next-line no-restricted-syntax
  for (const key in events) {
    if (Object.hasOwn(events, key)) delete events[key];
  }
}

function getAllTags() {
  return Object.keys(events);
}

module.exports = {
  subscribe,
  unsubscribe,
  publish,
  clear,
  getAllTags,
};
