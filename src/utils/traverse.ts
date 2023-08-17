const walk = <T>(
  cb: (item: T, index: number, arr: Array<T>) => void,
  data: Array<T>,
  traverseKey: keyof T,
): void => {
  const traverse = (arr: Array<T>) => {
    arr.forEach((it, index) => {
      cb(it, index, arr);
      if ((it[traverseKey] as Array<T>)?.length) {
        traverse(it[traverseKey] as Array<T>);
      }
    });
  };
  traverse(data);
};

export default walk;
