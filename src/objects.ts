export type UIObject =
  | Phaser.GameObjects.Text
  | Phaser.GameObjects.Graphics
  | Phaser.GameObjects.Zone
  | Phaser.GameObjects.Image;

export type UIObjectKeys =
  | "title"
  | "win-title"
  | "play-again-btn"
  | "1p-btn"
  | "2p-btn"
  | "p1_zone"
  | "p2_zone"
  | "player1_text"
  | "player2_text"
  | "p1_marker"
  | "p2_marker";

export class UIObjects {
  private objects: Map<UIObjectKeys, UIObject>;

  constructor() {
    this.objects = new Map();
  }

  add(name: UIObjectKeys, obj: UIObject) {
    this.objects.set(name, obj);
  }

  get(name: UIObjectKeys): unknown {
    return this.objects.get(name);
  }

  destroy(name: UIObjectKeys) {
    const obj = this.objects.get(name) as UIObject;
    if (obj) {
      obj.destroy();
      this.objects.delete(name);
    }
  }
}
