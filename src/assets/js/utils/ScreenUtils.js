export const getScreenInfo = () => {
    const {body} = document
    const {clientWidth,clientHeight,clientLeft,clientTop,scrollWidth,scrollHeight} = body

    const clientInfo = {clientWidth,clientHeight,clientLeft,clientTop}
    const scrollInfo = {scrollWidth,scrollHeight}

    return {clientInfo,scrollInfo};
}
