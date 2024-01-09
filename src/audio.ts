export enum AudioFiles {
  PieceDropSmall = "piece-drop-small",
  PieceDropClunk = "piece-drop-clunk",
  PieceDropHigh = "piece-drop-high",
  Cheer = "cheer1",
  Boo = "boo",
}

const AudioMap: Map<AudioFiles, string[]> = new Map([
  [
    AudioFiles.PieceDropClunk,
    ["assets/audio/piece-drop-clunk.mp3", "assets/audio/piece-drop-clunk.ogg"],
  ],
  [
    AudioFiles.PieceDropHigh,
    [
      "assets/audio/piece-drop-high.mp3",
      "assets/audio/piece-drop-high.ogg",
      "assets/audio/piece-drop-high.m4a",
    ],
  ],
  [
    AudioFiles.PieceDropSmall,
    [
      "assets/audio/piece-drop-small.mp3",
      "assets/audio/piece-drop-small.ogg",
      "assets/audio/piece-drop-small.m4a",
    ],
  ],
  [
    AudioFiles.Cheer,
    [
      "assets/audio/cheer1.mp3",
      "assets/audio/cheer1.ogg",
      "assets/audio/cheer1.m4a",
    ],
  ],
  [
    AudioFiles.Boo,
    ["assets/audio/boo.mp3", "assets/audio/boo.ogg", "assets/audio/boo.m4a"],
  ],
]);

export class Audio {
  private scene: Phaser.Scene;

  private sounds: Map<AudioFiles, ReturnType<typeof this.scene.sound.add>>;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.sounds = new Map();
  }

  static preload(scene: Phaser.Scene) {
    for (const [name, files] of AudioMap.entries()) {
      scene.load.audio(name, files);
    }
  }

  play(sound: AudioFiles) {
    if (!this.sounds.has(sound)) {
      this.sounds.set(sound, this.scene.sound.add(sound, { loop: false }));
    }

    this.sounds.get(sound).play();
  }
}
