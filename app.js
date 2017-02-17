PUZZLE_CLASS = 'puzzle-grid'

TILES = ["_",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

function loadPuzzle() {
  shuffled = shuffle(TILES)
  TILES = shuffled
  drawTiles(TILES)
}

function handleTileClick(tile){
  id     = tile.id
  value  = tile.innerHTML

  if (value == "_") {
    console.log("Why click the empty space?")
    return
  }


  rows = asRows(TILES)
  // Because JS destructuring is dumb.
  row_thing = getContainingArray(rows, value)
  tile_row  = row_thing[0]
  row_idx   = row_thing[1]

  columns      = asColumns(TILES)
  column_thing = getContainingArray(asColumns(TILES), value)
  tile_column  = column_thing[0]
  column_idx   = column_thing[1]

  if (tile_row.indexOf("_") > -1) {
    shifted = shiftPuzzleArray(tile_row, id, value)
    rows[row_idx] = shifted

    TILES = rows.reduce(function(a, b) {
        return a.concat(b);
    }, []);

  } else if (tile_column.indexOf("_") > -1) {
    shifted = shiftPuzzleArray(tile_column, id, value)
    columns[column_idx] = shifted

    // Matrix Transposition
    var transposed = columns[0].map(function(col, i) {
      return columns.map(function(row) {
        return row[i]
      })
    });

    TILES = transposed.flatten()
  } else {
    console.log("Oops can't shift this tile.")
  }

  drawTiles(TILES)
}


function shiftPuzzleArray(array, id, value) {
  value = parseInt(value)
  clicked_index    = array.indexOf(value)
  empty_tile_index = array.indexOf("_")

  if (clicked_index > empty_tile_index) {
    shifted = []

    before_empty = array.slice(0, empty_tile_index)
    doesnt_move  = array.slice(clicked_index + 1, array.length + 1)
    to_slide     = array.slice(empty_tile_index + 1, clicked_index+1)

    shifted.push(before_empty)
    shifted.push(to_slide)
    shifted.push("_")
    shifted.push(doesnt_move)

    // Flatten the array.
    return shifted.reduce(function(a, b) {
      return a.concat(b);
    }, []);

  } else {
    shifted = []

    // Breaking array into parts to rebuild.  TODO refactor into Array.prototype.slide = function()
    doesnt_move  = array.slice(0, clicked_index)
    before_empty = array.slice(clicked_index, empty_tile_index)
    after_empty  = array.slice(empty_tile_index+1, array.length + 1)

    shifted.push(doesnt_move)
    shifted.push("_")
    shifted.push(before_empty)
    shifted.push(after_empty)

    // Flatten the array.
    return shifted.reduce(function(a, b) {
      return a.concat(b);
    }, []);
  }
}

function attemptShift(row, column, id, value) {
  if (row.indexOf("_") > -1) {
    shiftPuzzle()
  }
}

function asColumns(tiles){
  column_0 = []
  column_1 = []
  column_2 = []
  column_3 = []

  $.each(tiles, function(index, tile) {
    if (index % 4 == 0) {
      column_0.push(tile)
    } else if (index % 4 == 1) {
      column_1.push(tile)
    } else if (index % 4 == 2) {
      column_2.push(tile)
    } else {
      column_3.push(tile)
    }
  })
  return [column_0, column_1, column_2, column_3]
}

function asRows(tiles) {
  matrix     = []
  row        = []

  $.each(tiles, function(index, tile) {
    row.push(tile)
    if ((index + 1) % 4 == 0) {
      matrix.push(row)
      row = []
    }
  });
  return matrix
}

function getContainingArray(matrix, value) {
  var containing_array = null
  var array_index      = null
  $.each(matrix, function(idx, array){
    if (array.indexOf(parseInt(value)) > -1) {
      containing_array = array
      array_index      = idx
    }
  });
  return [containing_array, array_index]
}

function drawTiles(tiles){
  var puzzle = $('.puzzle-grid');
  $.each(tiles, function(index, tile) {
  // do your stuff here
    identifier = "td#" + index
    $tile = $(identifier)

    $tile.text(tile)
  });
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

Array.prototype.flatten = function(){
  return this.reduce(function(a, b) {
      return a.concat(b);
  }, []);
}
