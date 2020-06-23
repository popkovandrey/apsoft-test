export const compareNumbers = (fieldName, sortDirectionAsc) => {
  const mapping = {
      true: (a, b) => a[fieldName] - b[fieldName],
      false: (a, b) => b[fieldName] - a[fieldName],
  };

  return mapping[sortDirectionAsc];
};
  
export const compareStrings = (fieldName, sortDirectionAsc) => {
  const mapping = {
    true: (a, b) => {
      let res;

      if (a[fieldName] > b[fieldName]) {
          res = 1;
      } else if (a[fieldName] === b[fieldName]) {
          res = 0;
      } else {
          res = -1;
      }

      return res;
    },
    false: (a, b) => {
      let res;

      if (a[fieldName] > b[fieldName]) {
          res = -1;
      } else if (a[fieldName] === b[fieldName]) {
          res = 0;
      } else {
          res = 1;
      }

      return res;
    },
  };

  return mapping[sortDirectionAsc];
};

export const isEven = (number) => (number % 2 === 0); 
