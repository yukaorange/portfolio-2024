// export const useFormattedDate = (dateString: string = '2024-11-08T07:47:24.247Z') => {
//   try {
//     const date = new Date(dateString);
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString;
//     const day = date.getDate().toString().padStart(2, '0');
//     console.log(year, month, day);
//     return `${year}/${month}/${day}`;
//   } catch (err) {
//     console.error(err);
//   }
// };

export const useFormattedDate = (dateStrings: string | string[]) => {
  try {
    if (Array.isArray(dateStrings)) {
      return dateStrings.map((dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}/${month}/${day}`;
      });
    } else {
      const date = new Date(dateStrings);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}/${month}/${day}`;
    }
  } catch (err) {
    console.error(err);
    return Array.isArray(dateStrings) ? [] : '';
  }
};
