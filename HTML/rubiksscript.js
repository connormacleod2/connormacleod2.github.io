window.onload = function () {
  const colors = [
    "rgb(255, 255, 255)",
    "rgb(254, 213, 47)",
    "rgb(13, 72, 172)",
    "rgb(25, 155, 76)",
    "rgb(137, 18, 20)",
    "rgb(255, 85, 37)",
  ];
  const tiles = document.querySelectorAll(".tile");
  tiles.forEach((tile) => {
    let index = 0;
    tile.addEventListener("click", () => {
      index = (index + 1) % colors.length;
      tile.style.backgroundColor = colors[index];
    });
  });

  const solveButton = document.querySelector("button");
  solveButton.addEventListener("click", () => {
    const cubeConfig = getCurrentCubeConfig();
    const solution = solveCube(cubeConfig);
    alert(solution);
  });

  function getCurrentCubeConfig() {
    const config = {
      top: [],
      front: [],
      left: [],
      right: [],
      back: [],
      bottom: [],
    };
    const tiles = document.querySelectorAll(".tile");
    tiles.forEach((tile) => {
      const [face, index] = tile.id.split("-");
      const color = window
        .getComputedStyle(tile)
        .getPropertyValue("background-color");
      config[face][index - 1] = color;
    });
    return config;
  }
  function solveCube(cubeConfig) {
    solveCenterPieces(cubeConfig);
    solveEdgePieces();
    solveCornerPieces();
    solveParityErrors();
    orientFinalLayer();
  }

  function solveCenterPieces(cubeConfig) {
    const centerColors = {
      top: cubeConfig.top[12],
      front: cubeConfig.front[12],
      left: cubeConfig.left[12],
      right: cubeConfig.right[12],
      back: cubeConfig.back[12],
      bottom: cubeConfig.bottom[12],
    };
    const centerFaces = Object.keys(centerColors);
    centerFaces.forEach((face1, i) => {
      const centerColor1 = centerColors[face1];
      centerFaces.slice(i + 1).forEach((face2) => {
        const centerColor2 = centerColors[face2];
        // Find the edge between the two center pieces
        const edge = getEdgeBetweenFaces(cubeConfig, face1, face2);
        if (
          edge &&
          edge[0][1] === centerColor1 &&
          edge[1][1] === centerColor2
        ) {
          // The center pieces are already solved
          return;
        }
        // Match the center pieces with the adjacent edge pieces
        const edgeColor1 = getAdjacentEdgeColor(edge, centerColor1);
        const edgeColor2 = getAdjacentEdgeColor(edge, centerColor2);
        // Find the center pieces that need to be swapped
        const centerIndex1 = cubeConfig[face1].indexOf(edgeColor2);
        const centerIndex2 = cubeConfig[face2].indexOf(edgeColor1);
        // Swap the center pieces
        const temp = cubeConfig[face1][centerIndex1];
        cubeConfig[face1][centerIndex1] = cubeConfig[face2][centerIndex2];
        cubeConfig[face2][centerIndex2] = temp;
      });
    });
    return cubeConfig;
  }
  function getEdgeBetweenFaces(cubeConfig, face1, face2) {
    const edgePositions = [
      [0, 1, "top", "back"],
      [1, 2, "top", "right"],
      [2, 1, "top", "front"],
      [1, 0, "top", "left"],
      [3, 1, "back", "right"],
      [4, 1, "back", "left"],
      [3, 3, "right", "front"],
      [4, 3, "left", "front"],
      [5, 1, "bottom", "front"],
      [5, 2, "bottom", "right"],
      [5, 3, "bottom", "back"],
      [5, 0, "bottom", "left"],
    ];

    for (const [i, j, face3, face4] of edgePositions) {
      if (
        cubeConfig[face1][i] === cubeConfig[face3][j] &&
        cubeConfig[face2][i] === cubeConfig[face4][j]
      ) {
        return [
          [face1, i, cubeConfig[face1][i]],
          [face2, i, cubeConfig[face2][i]],
        ];
      }
    }
    return null;
  }

  function getAdjacentEdgeColor(edge, centerColor) {
    if (edge[0][1] === centerColor) {
      return edge[1][1];
    } else {
      return edge[0][1];
    }
  }
  function solveEdgePieces() {}
  function solveCornerPieces() {}
  function solveParityErrors() {}
  function orientFinalLayer() {}
};
