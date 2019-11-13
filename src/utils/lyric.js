const timeReg = /\[(\d{2,}):([0-6]{1}[0-9]{1})\.([0-9]{2,3})\]/

export function parseLyric(lrc){
    const lines = lrc.split('\n')
    let lrcArr = []
    for(let i = 0; i < lines.length; i++){
        let line = lines[i]
        let result = timeReg.test(line)
        if(result){
            let text = line.replace(timeReg,"")
            if(text){
                let time = (((Number(RegExp.$1) * 60 + Number(RegExp.$2)) * 1000 + Number(RegExp.$3)) / 1000).toFixed(3)
                lrcArr.push({
                    text,
                    time
                })
            }   
        }
        
    }
    return lrcArr
}