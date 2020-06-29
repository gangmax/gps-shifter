/*
 * References:
 *   https://github.com/scateu/PyWGS84ToGCJ02
 *   https://on4wp7.codeplex.com/SourceControl/changeset/view/21483#353936
 *   https://blog.csdn.net/coolypf/article/details/8686588
 */
'use strict'

/*
 * Krasovsky 1940
 * a = 6378245.0, 1/f = 298.3
 * b = a * (1 - f)
 * ee = (a^2 - b^2) / a^2
 * ee = 0.00669342162296594323
 */
const a = 6378245.0;
const ee = 0.00669342162296594323;
const pi = Math.PI;
const sqrt = Math.sqrt;
const sin = Math.sin;
const cos = Math.cos;
const abs = Math.abs;

function isOutOfWonderland(lat, lng) {
    if (lng < 72.004 || lng > 137.8347 || lat < 0.8293 || lat > 55.8271) {
        return true;
    }
    return false;
}

function transformLat(x, y) {
    let r = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * sqrt(abs(x));
    r += (20.0 * sin(6.0 * x * pi) + 20.0 * sin(2.0 * x * pi)) * 2.0 / 3.0;
    r += (20.0 * sin(y * pi) + 40.0 * sin(y / 3.0 * pi)) * 2.0 / 3.0;
    r += (160.0 * sin(y / 12.0 * pi) + 320 * sin(y * pi / 30.0)) * 2.0 / 3.0;
    return r;
}

function transformLng(x, y) {
    let r = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * sqrt(abs(x));
    r += (20.0 * sin(6.0 * x * pi) + 20.0 * sin(2.0 * x * pi)) * 2.0 / 3.0;
    r += (20.0 * sin(x * pi) + 40.0 * sin(x / 3.0 * pi)) * 2.0 / 3.0;
    r += (150.0 * sin(x / 12.0 * pi) + 300 * sin(x / 30.0 * pi)) * 2.0 / 3.0;
    return r;
}

function shift(rawLat, rawLng) {
    if(isOutOfWonderland(rawLat, rawLng)) {
        return {'lat': rawLat, 'lng': rawLng};
    }
    let dLat = transformLat(rawLng - 105.0, rawLat - 35.0);
    let dLng = transformLng(rawLng - 105.0, rawLat - 35.0);
    let radLat = rawLat / 180.0 * pi;
    let magic = sin(radLat);
    magic = 1 - ee * magic * magic;
    let sqrtMagic = sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLng = (dLng * 180.0) / (a / sqrtMagic * cos(radLat) * pi);
    let targetLat = rawLat + dLat;
    let targetLng = rawLng + dLng;
    return {'lat': targetLat, 'lng': targetLng};
}

function unshift(shiftedLat, shiftedLng) {
    let r = shift(shiftedLat, shiftedLng);
    let dLat = r.lat - shiftedLat;
    let dLng = r.lng - shiftedLng;
    return {'lat': shiftedLat - dLat, 'lng': shiftedLng - dLng};
}

module.exports = {
    shift,
    unshift
};
