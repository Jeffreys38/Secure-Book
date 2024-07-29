export default function generateFileName() {
    const uniqueSuffix = Date.now() + '' + Math.round(Math.random() * 1E9);

    return uniqueSuffix
}