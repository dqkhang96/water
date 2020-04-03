export const stringToDate = (pattern: string, date: string) => {
    if (!date)
        return null
    var mydate: Date = new Date()
    if (pattern === "dd-MM-yyyy") {
        var parts = date.split('-');
        mydate = new Date(Number.parseInt(parts[2]), Number.parseInt(parts[1]), Number.parseInt(parts[0]));
    }
    return mydate
}

export const dateToString = (pattern: string, date: Date): string => {
    if (!date)
        return ""
    switch (pattern) {
        case "dd-MM-yyyy": return `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}-${(date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)}-${date.getFullYear()}`
        case "dd/MM/yyyy": return `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}/${(date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)}/${date.getFullYear()}`
        case "#dd #MM #yyyy": return `Ngày ${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()} tháng ${(date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1} năm ${date.getFullYear()}`
        default: return ""
    }

}

var mangso = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
function dochangchuc(so: number, daydu: any) {
    var chuoi = "";
    var chuc = Math.floor(so / 10);
    var donvi = so % 10;
    if (chuc > 1) {
        chuoi = " " + mangso[chuc] + " mươi";
        if (donvi == 1) {
            chuoi += " mốt";
        }
    } else if (chuc == 1) {
        chuoi = " mười";
        if (donvi == 1) {
            chuoi += " một";
        }
    } else if (daydu && donvi > 0) {
        chuoi = " lẻ";
    }
    if (donvi == 5 && chuc > 1) {
        chuoi += " lăm";
    } else if (donvi > 1 || (donvi == 1 && chuc == 0)) {
        chuoi += " " + mangso[donvi];
    }
    return chuoi;
}
function docblock(so: number, daydu: number) {
    var chuoi = "";
    var tram = Math.floor(so / 100);
    so = so % 100;
    if (daydu || tram > 0) {
        chuoi = " " + mangso[tram] + " trăm";
        chuoi += dochangchuc(so, true);
    } else {
        chuoi = dochangchuc(so, false);
    }
    return chuoi;
}
function dochangtrieu(so: number, daydu: any) {
    var chuoi = "";
    var trieu = Math.floor(so / 1000000);
    so = so % 1000000;
    if (trieu > 0) {
        chuoi = docblock(trieu, daydu) + " triệu";
        daydu = true;
    }
    var nghin = Math.floor(so / 1000);
    so = so % 1000;
    if (nghin > 0) {
        chuoi += docblock(nghin, daydu) + " nghìn";
        daydu = true;
    }
    if (so > 0) {
        chuoi += docblock(so, daydu);
    }
    return chuoi;
}

export function docso(so: any): string {
    if ((so != 0) && (!so))
        return ""
    if (so == 0) return mangso[0];
    var chuoi = "", hauto = "";
    do {
        const ty = so % 1000000000;
        so = Math.floor(so / 1000000000);
        if (so > 0) {
            chuoi = dochangtrieu(ty, true) + hauto + chuoi;
        } else {
            chuoi = dochangtrieu(ty, false) + hauto + chuoi;
        }
        hauto = " tỷ";
    } while (so > 0);
    chuoi = chuoi[1].toUpperCase() + chuoi.slice(2)
    return chuoi;
}

export function formatNumber(num: number | undefined): string {
    if ((num != 0) && (!num))
        return ""
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

export function numberBillCode(num: number, count: number): string {
    if ((num != 0) && (!num))
        return "0"
    var result = num.toString()
    while (result.length < count)
        result = "0" + result
    return result
}