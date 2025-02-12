import { gameInfos } from '../constants/game.js';

let allMaps = null;

export let MAP_1 = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 2, 2, 3, 2, 2, 0, 0, 1],
  [1, 0, 1, 2, 1, 0, 1, 2, 1, 0, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 2, 2, 2, 3, 2, 2, 2, 0, 1],
  [1, 2, 1, 2, 1, 0, 1, 0, 1, 2, 1],
  [1, 2, 2, 0, 2, 2, 2, 0, 2, 2, 1],
  [1, 0, 1, 2, 1, 0, 1, 2, 1, 0, 1],
  [1, 0, 0, 2, 2, 3, 2, 2, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

export let MAP_2 = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 3, 0, 2, 0, 0, 0, 2, 0, 3, 1],
  [1, 0, 1, 1, 1, 2, 1, 1, 1, 0, 1],
  [1, 0, 2, 0, 2, 2, 2, 0, 2, 0, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 0, 2, 2, 2, 3, 2, 2, 2, 0, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 0, 2, 0, 2, 2, 2, 0, 2, 0, 1],
  [1, 0, 1, 1, 1, 2, 1, 1, 1, 0, 1],
  [1, 3, 0, 2, 0, 0, 0, 2, 0, 3, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

export let MAP_3 = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 2, 3, 2, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 2, 2, 4, 2, 2, 2, 0, 2, 2, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 0, 0, 2, 2, 3, 2, 2, 0, 0, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 2, 2, 0, 2, 2, 2, 0, 2, 2, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 2, 3, 2, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

export let MAP_4 = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 2, 2, 2, 0, 2, 2, 2, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 2, 2, 0, 2, 3, 2, 0, 2, 2, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 0, 0, 2, 2, 0, 2, 2, 0, 0, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 2, 2, 0, 2, 3, 2, 0, 2, 2, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 2, 2, 2, 0, 2, 2, 2, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

export let MAP_5 = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 2, 2, 0, 2, 2, 0, 0, 1],
  [1, 0, 1, 1, 1, 3, 1, 1, 1, 0, 1],
  [1, 2, 2, 0, 2, 0, 2, 0, 2, 2, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 0, 2, 2, 2, 0, 2, 2, 2, 0, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 2, 2, 0, 2, 0, 2, 0, 2, 2, 1],
  [1, 0, 1, 1, 1, 3, 1, 1, 1, 0, 1],
  [1, 0, 0, 2, 2, 0, 2, 2, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

export let MAP_6 = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Function to update the map values
function updateMaps(maps) {
  MAP_1.length = 0;
  MAP_1.push(...maps[0]);

  MAP_2.length = 0;
  MAP_2.push(...maps[1]);

  MAP_3.length = 0;
  MAP_3.push(...maps[2]);

  MAP_4.length = 0;
  MAP_4.push(...maps[3]);

  MAP_5.length = 0;
  MAP_5.push(...maps[4]);

  MAP_6.length = 0;
  MAP_6.push(...maps[5]);
}

export let maps = [MAP_1, MAP_2, MAP_3, MAP_4, MAP_5, MAP_6]

// Function to add the bomb to the tilemap
export function updateTileMap(x, y) {

  // Initialize allMaps with fresh copies of the original maps
  allMaps = [
    [...MAP_1],
    [...MAP_2],
    [...MAP_3],
    [...MAP_4],
    [...MAP_5],
    [...MAP_6]
  ];

  let currentMap = allMaps[gameInfos.level - 1];

  let currentPosX = Math.floor(x % Math.floor(gameInfos.width / gameInfos.width_tiles));
  let currentPosY = Math.floor(y % Math.floor(gameInfos.height / gameInfos.height_tiles));

  if (currentPosX > gameInfos.width / gameInfos.width_tiles / 2) {
    currentPosX = Math.floor(x / Math.floor(gameInfos.width / gameInfos.width_tiles)) + 1;
  } else {
    currentPosX = Math.floor(x / Math.floor(gameInfos.width / gameInfos.width_tiles));
  }

  if (currentPosY > gameInfos.height / gameInfos.height_tiles / 2) {
    currentPosY = Math.floor(y / Math.floor(gameInfos.height / gameInfos.height_tiles)) + 1;
  } else {
    currentPosY = Math.floor(y / Math.floor(gameInfos.height / gameInfos.height_tiles));
  }

  console.log(currentPosX);
  console.log(currentPosY);

  // Update the current map
  currentMap[currentPosY][currentPosX] = 3;

  // Printing test
  console.log('---------------------------------------');
  for (let i = 0; i < currentMap.length; i++) {
    console.log(currentMap[i]);
  }

  // Update all maps with the new state
  updateMaps(allMaps);
  // test()
  setTimeout(() => {
    // Reset the tile
    currentMap[currentPosY][currentPosX] = 0;
    updateMaps(allMaps);
  }, 2000);
}

// export const MAP_1 = [
//   [1,1,1,1,1,1,1,1,1,1,1],
//   [1,0,2,2,0,0,0,2,2,0,1],
//   [1,0,1,1,1,2,1,1,1,0,1],
//   [1,0,2,0,2,2,2,0,2,0,1],
//   [1,1,1,1,0,1,0,1,1,1,1],
//   [1,0,0,2,2,3,2,2,0,0,1],
//   [1,1,1,1,0,1,0,1,1,1,1],
//   [1,0,2,0,2,2,2,0,2,0,1],
//   [1,0,1,1,1,2,1,1,1,0,1],
//   [1,0,2,2,0,0,0,2,2,0,1],
//   [1,1,1,1,1,1,1,1,1,1,1]
// ];
