/**
 * 接收一个回调函数和数据进行遍历
 *
 * @template T
 * @param {Function} cb - 回调函数
 * @param {Array<T>} data - 待遍历数据
 * @param {keyof T} traverseKey - 遍历对象的键
 *
 * @callback {(item: T, index: number, arr: Array<T>, deep: number) => void} cb
 * - item - 当前项
 * - index - 索引
 * - arr - 总数组
 * - deep - 嵌套深度
 *
 * @returns {void}
 */
const walk = <T>(
  cb: (item: T, index: number, arr: Array<T>, deep: number) => void,
  data: Array<T>,
  traverseKey: keyof T,
): void => {
  const traverse = (arr: Array<T>, deep: number) => {
    arr.forEach((it, index) => {
      cb(it, index, arr, deep);
      if ((it[traverseKey] as Array<T>)?.length) {
        traverse(it[traverseKey] as Array<T>, ++deep);
      }
    });
  };
  traverse(data, 1);
};

export default walk;
