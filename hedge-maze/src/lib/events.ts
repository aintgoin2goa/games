import { Events } from "phaser";
import debugFactory from "debug";

export enum EventNames {
  CAUGHT = "caught",
  TARGET_REACHED = "target_reached",
}

const debug = {
  susbcribe: debugFactory("events:subscribe"),
  publish: debugFactory("events:publish"),
};

const published: EventNames[] = [];

const emitter = new Events.EventEmitter();

export const subscribe = (event: EventNames, handler) => {
  debug.susbcribe("subscribe", { event, handler });
  emitter.on(event, handler);
};
export const subscribeDelayed = (event: EventNames, delay: number, handler) => {
  debug.publish("subscribeDelayed", { event, delay, handler });
  emitter.on(event, () => {
    new Promise((r) => setTimeout(r, delay)).then(() => handler());
  });
};
export const publish = (event: EventNames, payload?: unknown) => {
  debug.publish("publish", { event, payload });
  emitter.emit(event, payload);
};
export const publishOnce = (event: EventNames, payload?: unknown) => {
  if (published.includes(event)) {
    return;
  }

  published.push(event);
  publish(event, payload);
};
