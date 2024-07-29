function canvasToFile(canvas, extension, fileType, quality = 1) {
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          const file = new File([blob], extension, { type: fileType, lastModified: Date.now() });
          resolve(file);
        },
        fileType,
        quality
      );
    });
}

export default canvasToFile;