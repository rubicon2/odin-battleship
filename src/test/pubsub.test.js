const pubsub = require('../modules/pubsub');

beforeEach(() => pubsub.clear());

const one = (arr, word) => {
  arr.push(`My first function is ${word}!`);
};

const two = (arr, word) => {
  arr.push(`My second function is ${word}!`);
};

describe('pubsub module', () => {
  describe('subscribe', () => {
    test('subscribing to a new event creates one and subs function to it', () => {
      let result = null;
      const fn = (arg) => {
        result = `${arg}!`;
      };
      // Without exposing private parts of pubsub (events object), the only way to test is with the public interface.
      // However this means each of these tests is not testing individual methods but all of them, together...
      pubsub.subscribe('megaEvent', fn);
      pubsub.publish('megaEvent', 'MEGA');
      expect(result).toBe('MEGA!');
    });

    test('subscribing to an existing event subs function to it without messing with existing subbed functions', () => {
      const results = [];

      pubsub.subscribe('megaEvent', one);

      pubsub.subscribe('megaEvent', two);
      pubsub.publish('megaEvent', results, 'MEGA');
      pubsub.publish('megaEvent', results, 'ULTRA');
      expect(results).toStrictEqual([
        'My first function is MEGA!',
        'My second function is MEGA!',
        'My first function is ULTRA!',
        'My second function is ULTRA!',
      ]);
    });

    test('only functions can be subscribed to events', () => {
      expect(() => pubsub.subscribe('megaEvent', 'turnip')).toThrow();
      expect(() =>
        pubsub.subscribe('megaEvent', ['something', 'in an array']),
      ).toThrow();
      expect(() => pubsub.subscribe('megaEvent', 9)).toThrow();
    });
  });

  describe('unsubscribe', () => {
    beforeEach(() => {
      pubsub.subscribe('megaEvent', one);
    });

    test('unsubscribing to an event with no more subs deletes event', () => {
      expect(pubsub.getAllTags()).toContain('megaEvent');
      pubsub.unsubscribe('megaEvent', one);
      expect(pubsub.getAllTags()).not.toContain('megaEvent');
    });

    test('unsubscribing to an event with one or more other subs only affects that sub', () => {
      const results = [];
      pubsub.subscribe('megaEvent', two);
      pubsub.publish('megaEvent', results, 'MEGA');
      pubsub.unsubscribe('megaEvent', one);
      pubsub.publish('megaEvent', results, 'ULTRA');
      expect(results).toStrictEqual([
        'My first function is MEGA!',
        'My second function is MEGA!',
        'My second function is ULTRA!',
      ]);
    });

    test('unsubscribing to a non-existent event does nothing', () => {
      expect(pubsub.getAllTags()).not.toContain('nothing');
      pubsub.unsubscribe('nothing', one);
      expect(pubsub.getAllTags()).not.toContain('nothing');
    });
  });

  describe('publish', () => {
    test('publish sends data to subscribed functions correctly', () => {
      let added = 0;
      const add = (value) => {
        added += value;
      };
      let subbed = 0;
      const subtract = (value) => {
        subbed -= value;
      };
      pubsub.subscribe('anotherEvent', add);
      pubsub.subscribe('anotherEvent', subtract);
      pubsub.publish('anotherEvent', 1);
      expect(added).toBe(1);
      expect(subbed).toBe(-1);
      pubsub.publish('anotherEvent', 5);
      expect(added).toBe(6);
      expect(subbed).toBe(-6);
    });

    test('publishing to a non-existent event does nothing', () => {
      expect(() => pubsub.publish('nothing')).not.toThrow();
    });

    test('publish throws an error if supplied arguments do not match the parameters of a subscribed function', () => {
      pubsub.subscribe('megaEvent', one);
      expect(() =>
        pubsub.publish('megaEvent', { a: 'errors', b: 'incomg' }),
      ).toThrow();
    });
  });

  test('tag list', () => {
    pubsub.subscribe('megaEvent', one);
    pubsub.subscribe('anotherEvent', two);
    expect(pubsub.getAllTags()).toStrictEqual(['megaEvent', 'anotherEvent']);
  });

  test('clear', () => {
    expect(pubsub.getAllTags().length).toBe(0);
    pubsub.subscribe('megaEvent', one);
    pubsub.subscribe('ultraEvent', two);
    expect(pubsub.getAllTags().length).toBe(2);
    pubsub.clear();
    expect(pubsub.getAllTags().length).toBe(0);
  });
});
