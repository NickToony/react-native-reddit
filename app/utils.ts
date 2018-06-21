// Shuffles the given array
export function shuffleArray(a: any[]) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

// Removes the given item from the given array
export function removeFromArray(array: any[], item: any) {
  const index = array.indexOf(item);
  if (index !== -1) array.splice(index, 1);
}