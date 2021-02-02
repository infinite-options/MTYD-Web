// Function to get date/time in better format
// Expected input format: YYYY-MM-DD HH-MM-SS
// Returned output format: YYYY-MM-DD HH:MM:SS
export const formatTime = (time) => {
  return `${time.slice(0, 13)}:${time.slice(14, 16)}:${time.slice(17, 19)}`;
}

// Get descending comparator by field, used as utility function for sort comparator

export const descendingComparator = (eltA, eltB, field) => {
  if(eltA[field] > eltB[field]) {
    return -1;
  } else if(eltA[field] < eltB[field]) {
    return 1;
  } else {
    return 0;
  }
}

// Get sort comparator by field, used as utility function for sorted array

const sortComparator = (field,direction) => {
  if(direction === 'desc') {
    return (eltA, eltB) => {
      return descendingComparator(eltA,eltB,field);
    } 
  } else {
    return (eltA, eltB) => {
      return -descendingComparator(eltA,eltB,field);
    } 
  }
}

// Get sorted array by field and direction

// Stable sort version not used, use first version for stable sorting
// on browsers whose default sort is not stable
/* 
export const sortedArray = (array, field, direction) => {
  // Stable sort
  const stableArray = array.map((elt,index) => [elt, index]);
  stableArray.sort(
    (eltA, eltB) => {
      const order = sortComparator(field, direction)(eltA[0],eltB[0]);
        if(order !== 0) {
          return order;
        }
        return eltA[1] - eltB[1]
    }
  )
  return stableArray.map((elt) => elt[0]);
}
*/

export const sortedArray = (array, field, direction) => {
  const arrayCopy = [...array];
  arrayCopy.sort(
    sortComparator(field, direction)
  )
  return arrayCopy;
}