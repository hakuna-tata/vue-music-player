var lyric = "[00:00.000] 作曲 : 许嵩\n[00:01.000] 作词 : 许嵩\n[00:24.380]寻不到花的折翼枯叶蝶\n[00:29.760]永远也看不见凋谢\n[00:36.440]江南夜色下的小桥屋檐\n[00:41.700]读不懂塞北的荒野\n[00:48.100]\n[00:48.530]梅开时节因寂寞而缠绵\n[00:53.720]春归后又很快湮灭\n[01:00.460]独留我赏烟花飞满天\n[01:05.740]摇曳后就随风飘远\n[01:11.850]\n[01:12.700]断桥是否下过雪\n[01:15.450]我望着湖面\n[01:18.410]水中寒月如雪\n[01:21.410]指尖轻点融解\n[01:24.160]\n[01:24.420]断桥是否下过雪\n[01:27.370]又想起你的脸\n[01:30.360]若是无缘再见\n[01:33.320]白堤柳帘垂泪好几遍\n[02:02.140]\n[02:03.600]寻不到花的折翼枯叶蝶\n[02:08.730]永远也看不见凋谢\n[02:15.370]江南夜色下的小桥屋檐\n[02:20.900]读不懂塞北的荒野\n[02:27.390]\n[02:27.450]梅开时节因寂寞而缠绵\n[02:33.500]春归后又很快湮灭\n[02:39.380]独留我赏烟花飞满天\n[02:45.300]摇曳后就随风飘远\n[02:50.780]\n[02:51.440]断桥是否下过雪\n[02:55.870]我望着湖面\n[02:58.580]水中寒月如雪\n[03:01.580]指尖轻点融解\n[03:04.410]\n[03:04.630]断桥是否下过雪\n[03:07.580]又想起你的脸\n[03:10.560]若是无缘再见\n[03:13.570]白堤柳帘垂泪好几遍\n"

function parseLyric(lrc){
    const lines = lrc.split('\n')
    let lrcArr = []
    const timeReg = /\[\d{2,}:[0-6]{1}[0-9]{1}\.[0-9]{2,3}\]/g
    for(let i = 0; i < lines.length; i++){
        let line = lines[i]
        let timeRegExpArr = line.match(timeReg)
        if(!timeRegExpArr) continue
        let text = line.replace(timeReg,"")
        for(let j=0,k=timeRegExpArr.length; j<k; j++){
            let l = timeRegExpArr[j]
            let min = Number(String(l.match(/\[\d{2,}/i)).slice(1))
            let sec = Number(String(l.match(/:[0-6]{1}[0-9]{1}/i)).slice(1))
            let time = min * 60 + sec
            if(text !== ""){
                lrcArr.push({
                    time,
                    text
                })
            }
        }
    }
    return lrcArr
}

parseLyric(lyric)