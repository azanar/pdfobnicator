function copier(src, srcPage, target, targetPage) {
        return target.copyPages(src, [srcPage]).then((p) => { 
            target.insertPage(targetPage, p[0]);
        })

}
export function makesrccopier(src, srcPage, targetPage) {
    return (target) => copier(src, srcPage, target, targetPage)
}
export function maketargetcopier(target, srcPage, targetPage) {
    return (src) => copier(src, srcPage, target, targetPage)
}