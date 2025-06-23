/* --- Paramètres généraux --- */
const TILE = 10;
const COLS = 60, ROWS = 40;
const EXPANSION_CHANCE = 0.04;

/* Couleurs des biomes */
const biomeColors = {
  plaine   : 0x95e06c,
  forêt    : 0x2e8b57,
  eau      : 0x3498db,
  montagne : 0x7f8c8d
};

let map, civs, gfx, game;   // variables globales

/* ---------- Génération de la carte avec biomes ---------- */
function generateMap () {
  map = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => {
      const r = Math.random();
      let biome = "plaine";          // 50 %
      if (r < 0.10) biome = "montagne";   // 10 %
      else if (r < 0.25) biome = "eau";   // 15 %
      else if (r < 0.50) biome = "forêt"; // 25 %
      return { biome, owner: null };
    })
  );
}

/* ---------- Création des civilisations de départ ---------- */
function createCivilizations () {
  civs = [
    { id: 1, color: 0xe74c3c, tiles: [{ x: 5,          y: 5 }] },
    { id: 2, color: 0x27ae60, tiles: [{ x: COLS - 6, y: ROWS - 6 }] }
  ];
  civs.forEach(c => {
    const t = c.tiles[0];
    map[t.y][t.x].owner = c.id;
  });
}

/* ---------- Scène Phaser principale ---------- */
class World extends Phaser.Scene {
  preload () {}

  create () {
    gfx = this.add.graphics();

    generateMap();
    createCivilizations();
    this.draw();                              // premier rendu

    /* Clic = météorite façon WorldBox */
    this.input.on('pointerdown', p => this.dropMeteor(p));

    /* Expansion auto toutes 300 ms */
    this.time.addEvent({
      delay: 300, loop: true,
      callback: () => {
        civs.forEach(c => this.expand(c));
        this.draw();
      }
    });
  }

  /* Expansion façon OpenFront */
  expand (civ) {
    const newTiles = [];
    civ.tiles.forEach(({ x, y }) => {
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) continue;
          const tile = map[ny][nx];
          if (tile.owner === null && tile.biome !== "eau" && Math.random() < EXPANSION_CHANCE) {
            tile.owner = civ.id;
            newTiles.push({ x: nx, y: ny });
          }
        }
    });
    civ.tiles.push(...newTiles);
  }

  /* Pouvoir divin : météorite */
  dropMeteor (pointer) {
    const cx = Math.floor(pointer.worldX / TILE);
    const cy = Math.floor(pointer.worldY / TILE);
    for (let dy = -2; dy <= 2; dy++)
      for (let dx = -2; dx <= 2; dx++) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) continue;
        const tile = map[ny][nx];
        if (tile.owner !== null) {
          const civ = civs.find(c => c.id === tile.owner);
          civ.tiles = civ.tiles.filter(t => !(t.x === nx && t.y === ny));
        }
        tile.owner = null;
        tile.biome = "plaine";  // terre brûlée
      }
    this.draw();
  }

  /* Rendu complet */
  draw () {
    gfx.clear();
    f
window.addEventListener("load", () => {
  document.getElementById("startBtn").addEventListener("click", () => {
    document.getElementById("startScreen").style.display = "none";
    startGame();
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    startGame();
  });
});
