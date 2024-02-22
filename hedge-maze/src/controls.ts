import { Events, Types } from "phaser";

export class Controls {
  emitter: Events.EventEmitter;
  input: Types.Input.InteractiveObject;

  constructor(input: Types.Input.InteractiveObject) {
    this.input = input;
    // @ts-expect-error - missing method from type
    this.input.on("pointerdown", (e: PointerEvent) =>
      this.handlePointerDown(e)
    );
    this.emitter = new Events.EventEmitter();
  }

  handlePointerDown(ev: PointerEvent) {
    this.emitter.emit("pointer", { x: ev.clientX, y: ev.clientY });
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.emitter.on(event, callback);
  }
}
