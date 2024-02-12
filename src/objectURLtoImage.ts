export function objectURLtoImage(objectURL: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('objectURL(): objectURL is illegal'));
    img.src = objectURL;
  });
}
