export const RANK = 5;
let WINNING_NUMBER = 3;
if (RANK > 3) {
  WINNING_NUMBER = RANK - 1;
}

function fold_array(arr: Array<string>) {
  const folded = [];
  const dimension_length = Math.sqrt(arr.length); // 9 -> 3
  for (let i = 0; i < arr.length; i += dimension_length) {
    // Iterate in groups of 3 if the arr.length is 9
    const sub_array = arr.slice(i, i + dimension_length);
    folded.push(sub_array);
  }
  return folded;
}

function calc_transpose(arr2d: string[][]) {
  // Assuming the 2d array is NxN,
  // map over the length of its first element, a 1d array.
  return arr2d[0].map((_, col_idx) => {
    // Using the indices of [0]'s elements as a guide,
    // dive back into the original 2d array.
    return arr2d.map((row) => {
      // Retrieve every row's value at col_idx
      return row[col_idx];
    });
  });
}

function calc_diagonals(
  arr2d: string[][],
  offset_i = 0,
  offset_j = 0,
  capture_offset = 0
) {
  // Return pairs of diagonals from a 2d array

  // . is left-to-right
  // , is right-to-left
  // Assuming we're reading top-to-bottom, L -> R

  // All offsets are zero:
  //  __ __ __ __ __
  // |._|__|__|__|_,|
  // |__|._|__|_,|__|
  // |__|__|.,|__|__|
  // |__|_,|__|._|__|
  // |_,|__|__|__|._|

  // i is the row index, j is the column index
  // (offset i = +1, offset j = +0, captured offset = -1):
  //  __ __ __ __ __
  // |__|__|__|__|__|
  // |._|__|__|__|_,|
  // |__|._|__|_,|__|
  // |__|__|.,|__|__|
  // |__|_,|__|._|__|

  // (offset i = +0, offset j = +1, captured offset = -1):
  //  ij __ __ __ __
  // |00|._|02|_,|04| i = 0
  // |10|11|.,|13|14| i = 1
  // |20|_,|22|._|24| i = 2
  // |_,|31|32|33|._| i = 3
  // |40|41|42|43|44| i = 4
  //   ^  ^  ^  ^  ^
  //  j0 j1 j2 j3 j4

  const diag_left_right = [];
  const diag_right_left = [];

  for (let i = 0, j = arr2d[0].length; j + capture_offset > 0; i++, j--) {
    diag_left_right.push(arr2d[i + offset_i][i + offset_j]);
    diag_right_left.push(arr2d[i + offset_i][j - (1 + offset_j)]);
  }

  return Array<Array<string>>(diag_left_right, diag_right_left);
}

function row_winner(row: Array<string | null>) {
  const set_row = new Set(row);
  if (row.includes(null) || set_row.size !== 1) {
    return null; // No winner
  }
  return set_row.values().next().value; // Winner
}

function row_winner_contiguous(row: Array<string | null>) {
  let last_seen = row[0];
  let contiguous_buffer = 0;
  for (const element of row) {
    if (element && last_seen !== element) {
      contiguous_buffer = 1;
    } else if (element && last_seen === element) {
      contiguous_buffer++;
      if (contiguous_buffer == WINNING_NUMBER) {
        return last_seen;
      }
    }
    last_seen = element;
  }
}

export function winner(squares: Array<string>) {
  const folded = fold_array(squares); // Rows
  const transposed = calc_transpose(folded); // Columns
  const diagonals = calc_diagonals(folded); // Diagonals
  function check_winner(rows: string[][]) {
    for (const row of rows) {
      let result;
      if (RANK > 3) {
        result = row_winner_contiguous(row);
      } else {
        result = row_winner(row);
      }
      if (result) {
        return result;
      }
    }
    return null;
  }

  try {
    if (check_winner(folded)) return check_winner(folded);
    if (check_winner(transposed)) return check_winner(transposed);
    if (check_winner(diagonals)) return check_winner(diagonals);

    if (RANK > 3) {
      const second_order_diags_1 = calc_diagonals(folded, 1, 0, -1);
      const second_order_diags_2 = calc_diagonals(folded, 0, 1, -1);

      if (check_winner(second_order_diags_1))
        return check_winner(second_order_diags_1);
      if (check_winner(second_order_diags_2))
        return check_winner(second_order_diags_2);
    }
  } catch (err) {
    console.error(err);
  }
}
