function checkLength(str: string, length: number) {
  if (!(str.length == length)) {
    return `The word must have ${length} letters`;
  }
  return null;
}
