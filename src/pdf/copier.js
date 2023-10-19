export function makecopier(src, srcPage, targetPage) {
    const copier = (target) => {
        console.log(`Copying ${srcPage} from src to ${targetPage} of target`)
        target.copyPages(src, [srcPage]).then((p) => target.insertPage(targetPage, p[0]));
    }
    return copier
}