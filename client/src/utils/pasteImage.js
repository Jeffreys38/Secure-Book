async function pasteImage() {
    try {
      const clipboardContents = await navigator.clipboard.read();

      for (const item of clipboardContents) {
        if (!item.types.includes("image/png")) {
          return;
        }
        const blob = await item.getType("image/png");
        
        return blob
      }
    } catch (error) {
        console.log(error.message);
    }
}

export default pasteImage