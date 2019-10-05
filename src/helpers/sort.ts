const swap = <T>(array: T[], firstIndex: number, secondIndex: number) => {
  const temp = array[firstIndex]
  array[firstIndex] = array[secondIndex]
  array[secondIndex] = temp
};

const partition = <T>(arr: T[], left: number, right: number) => {
  const pivot = arr[Math.floor((right + left) / 2)]
  let i = left
  let j = right
  while (i <= j) {
    while (arr[i] < pivot) {
      i++
    }
    while (arr[j] > pivot) {
      j--
    }
    if (i <= j) {
      swap(arr, i, j)
      i++
      j--
    }
  }
  return i
};

const quickSort = <T>(items: T[], left: number, right: number) => {
  let index;
  if (items.length > 1) {
    index = partition(items, left, right)
    if (left < index - 1) {
      quickSort(items, left, index - 1)
    }
    if (index < right) {
      quickSort(items, index, right)
    }
  }
  return items
};

export const sort = <T>(array: T[]) => quickSort(array, 0, array.length - 1)
