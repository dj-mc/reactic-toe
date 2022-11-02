const WINNING_NUMBER = 4

function fold_array(arr: Array<string>) {
  const folded = [];
  const dimension_length = Math.sqrt(arr.length);
  for (let i = 0; i < arr.length; i += dimension_length) {
    const sub_array = arr.slice(i, i + dimension_length);
    folded.push(sub_array);
  }
  return folded;
}

function calc_transpose(arr2d: string[][]) {
  return arr2d[0].map((_, col_idx) => {
    return arr2d.map((row) => {
      return row[col_idx];
    });
  });
}

function calc_diagonals(arr2d: string[][]) {
  const diag_left_right = [];
  const diag_right_left = [];
  for (let i = arr2d.length, j = 0; i > 0; i--, j++) {
    diag_left_right.push(arr2d[j][j]);
    diag_right_left.push(arr2d[i - 1][j]);
  }
  return Array<Array<string>>(diag_left_right, diag_right_left);
}

// function row_winner(row: Array<string | null>) {
//   const set_row = new Set(row);
//   if (row.includes(null) || set_row.size !== 1) {
//     return null; // No winner
//   }
//   return set_row.values().next().value; // Winner
// }

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

export default function winner(squares: Array<string>) {
  const folded = fold_array(squares); // Rows
  const transposed = calc_transpose(folded); // Columns
  const diagonals = calc_diagonals(folded); // Diagonals

  function check_winner(rows: string[][]) {
    for (const row of rows) {
      const result = row_winner_contiguous(row);
      if (result) {
        return result;
      }
    }
    return null;
  }

  if (check_winner(folded)) return check_winner(folded);
  if (check_winner(transposed)) return check_winner(transposed);
  if (check_winner(diagonals)) return check_winner(diagonals);
}
