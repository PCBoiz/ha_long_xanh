// TỆP SINH TỰ ĐỘNG — đừng sửa tay.
// Chạy `npm run assets` để tạo lại từ ảnh gốc trên Google Drive.

export interface ProjectImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  blurDataURL: string;
}

export const projectImages = {
  "toan-canh-hoang-hon": {
    src: "/images/toan-canh-hoang-hon.webp",
    width: 2560,
    height: 1429,
    alt: "Toàn cảnh Vinhomes Global Gate Hạ Long nhìn ra vịnh lúc hoàng hôn",
    blurDataURL:
      "data:image/webp;base64,UklGRoAAAABXRUJQVlA4IHQAAADwAwCdASoYAA0APu1iqk2ppaQiMAgBMB2JQA7AABgIZInUjvqYSyAgAPDbf8sZHVCaLvs39TIbzPQ4Xw4z28eTvIWZJHcfRB8XPdLipPFU22OWz3UMmoRghEsl/hvvt7IZdEZn4/zBnoISw1kzHKblD3AAAA==",
  },
  "toan-canh-sang-som": {
    src: "/images/toan-canh-sang-som.webp",
    width: 2560,
    height: 1450,
    alt: "Toàn cảnh khu đô thị lúc sáng sớm",
    blurDataURL:
      "data:image/webp;base64,UklGRoYAAABXRUJQVlA4IHoAAAAQBACdASoYAA4APu1iqU2ppaOiMAgBMB2JQBhQBDoJORpzbI5xjp5fgAD+xgOolq8MHlouCRFGR/Cw/rcTuxiCEyYO0uOqy2rO8mWZuYP+yAX+/CNVxlP8BYt4yHsAaz1bpXT3vWquKFjWGmjQ+q0tbusgfGvfixJAAA==",
  },
  "view-bien-sang-som": {
    src: "/images/view-bien-sang-som.webp",
    width: 2560,
    height: 1429,
    alt: "Phân khu hướng biển lúc bình minh",
    blurDataURL:
      "data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAADwAwCdASoYAA0APu1mq04ppaQiMAgBMB2JYwDE2CHMRZwr08dWm3sAAP7U+Rwduh7SKaVupA/kUBUXQCWwbrsEiiiVBxLQt0Vsac+KmEL/NH/4NA60AkqB4eTkQX9tBZKayD5fAAA=",
  },
  "view-san-golf": {
    src: "/images/view-san-golf.webp",
    width: 2560,
    height: 1429,
    alt: "Phối cảnh khu biệt thự nhìn ra sân golf",
    blurDataURL:
      "data:image/webp;base64,UklGRowAAABXRUJQVlA4IIAAAADQAwCdASoYAA0APu1kqU4ppaOiMAgBMB2JYgCdACHZw+aH8+NNFjgA/I7IZvsu3WCu93HqBwVNQyOECcuA9cMPucCcXDEY1zLYG9meXOmWEKUg7oFIVj7BWOiJ0HBQRRyiCTYYdONG4cdUypl/rvs3XHyCXRQJKFtceAr4eAAAAA==",
  },
  "khu-1-view-bien": {
    src: "/images/khu-1-view-bien.webp",
    width: 2560,
    height: 1429,
    alt: "Phân khu 1 hướng vịnh Hạ Long",
    blurDataURL:
      "data:image/webp;base64,UklGRn4AAABXRUJQVlA4IHIAAADQAwCdASoYAA0APu1iqU2ppaOiMAgBMB2JYgCnFCP8sBe/yKhq8+AA/pgY3nmFXZZ39Y7feeh9Iy1P9/t5QkNBIqpai2OJ/gGqJK+R6dQZi7xBhOuTyFWwhDOvy+zFs4NlAfGGkBPv/pldVEAVM5FQAAA=",
  },
  "khu-1-cong-vien-hoang-hon": {
    src: "/images/khu-1-cong-vien-hoang-hon.webp",
    width: 2560,
    height: 1428,
    alt: "Công viên trung tâm phân khu 1 lúc hoàng hôn",
    blurDataURL:
      "data:image/webp;base64,UklGRrAAAABXRUJQVlA4WAoAAAAQAAAAFwAADAAAQUxQSBEAAAABD9D/iAgIBJL2N58gov8RDwBWUDggeAAAANADAJ0BKhgADQA+7WaqTamlpCIwCAEwHYlAF2AD1cnLMqNsy4yXgAD9O/ugNlYRQ5g4i8xRK9jw+LUcbaXQbRuc90SJ5/OQh48vfC9uK6JOoypf26mQPtS1IIsKdRk/V8ZEcgeV9k65mDdbyq/ryiYUw3n7CcAAAA==",
  },
  "tmb-tong-tien-ich": {
    src: "/images/tmb-tong-tien-ich.webp",
    width: 2560,
    height: 1920,
    alt: "Sơ đồ tổng mặt bằng và hệ tiện ích toàn dự án",
    blurDataURL:
      "data:image/webp;base64,UklGRroAAABXRUJQVlA4IK4AAADwBACdASoYABIAPu1oqk8ppiOiMBgIATAdiWgAtujnyf4B5uk7VazbSzj4LbbFnJwA/ib2pqLaHnoRTKt/UXlb0nnpKuAdT0ZTt5BAXWCo5ARMuJAwVEr8WN9CaRyPxao/XoUzIgXNZ4JBNcC5vn8hlFWdNTdYFiGB0ssKZgkfU8rsox0R7BrlOsf8K5a3CBbWj+zxbLEX8V8lu8C87wEcJtc6xkXvx+6IlAagAAA=",
  },
  "tmb-ban-do": {
    src: "/images/tmb-ban-do.webp",
    width: 2560,
    height: 1660,
    alt: "Bản đồ quy hoạch các phân khu Vinhomes Global Gate Hạ Long",
    blurDataURL:
      "data:image/webp;base64,UklGRo4AAABXRUJQVlA4IIIAAAAQBACdASoYABAAPu1iqU2ppaQiMAgBMB2JQAAKLxHtZUFXvoQj9xEugADwN/saZAw/LkukTVZxQ1ca5DAjwQSAYD1feoi1d/k65Y6m6NK+4HYKWFyvPKMGuVTbE4p806cEA2XaIMiY3j/hXh+GVrcpAHJGXQBA6i2sCSxJ2B9jJYAA",
  },
  "tmb-khu-1": {
    src: "/images/tmb-khu-1.webp",
    width: 2560,
    height: 1920,
    alt: "Sơ đồ tổng mặt bằng Khu 1",
    blurDataURL:
      "data:image/webp;base64,UklGRsYAAABXRUJQVlA4ILoAAABwBQCdASoYABIAPu1sqlEppaOiqAqpMB2JaACxHwoONJNz6ROwSS5SkPUDWo6ivnq8r+4AAPqfDap8tc+8ScsM8iSR3SanJq9XHmb8nWrHW5+N8wwndaHYEGYl02ao/CKs2qmMsWy2O+GaSH9DBfgwDmAq1FRcClygqnYA3Zt9fXIDYU9WkjT0KOM0w1ltyULsHK4CTht3eSCQITc8JlQMLxzwUs7oVB6cNvaUwTs2THNvUoVKpOEAAAA=",
  },
  "tien-ich-01": {
    src: "/images/tien-ich-01.webp",
    width: 1888,
    height: 1123,
    alt: "Rạp xiếc trong công viên VinWonders lúc chạng vạng",
    blurDataURL:
      "data:image/webp;base64,UklGRsIAAABXRUJQVlA4ILYAAADQBACdASoYAA4APu1iqU2ppaOiMAgBMB2JbACdMoR3AdFg4pjINYQ3KWweD457QAD9tiQowMUEHp9u0alBHWwjaolKi+3KmJbiTNNcZEY6F9Hp/nI+NRjtQgxiMXulupaxgtSqs2uwbecLWNusdX2FluTIdrSmw7XzlXH4LySiUNGrVQu8GWJDN7pVlKbyz0e1MCV1xB2XYhOKpDqZq7CRVGnccsxWhGqMLIxJF6I+jIo/5gAAAA==",
  },
  "tien-ich-02": {
    src: "/images/tien-ich-02.webp",
    width: 1787,
    height: 1181,
    alt: "Quảng trường Rạp xiếc La Mã cổ đại",
    blurDataURL:
      "data:image/webp;base64,UklGRp4AAABXRUJQVlA4IJIAAAAwBACdASoYABAAPu1iqU2ppaOiMAgBMB2JaACdMoMggEm29R/sedQj2YAA/rHneHn7ZHLvkOD3HePl2kzRmO0vdawO9BfV7fxaqiffn3Djx53G0e0K6x1lBapsrZ9Bx3WWW2VPh5HKg80T4L+b0a5WaxsDoziwUjafbvxqy6Sf2ng+kTiolC6SmjTVKeLM1gMAAA==",
  },
  "tien-ich-03": {
    src: "/images/tien-ich-03.webp",
    width: 873,
    height: 584,
    alt: "Phân khu trò chơi chủ đề Ai Cập cổ đại",
    blurDataURL:
      "data:image/webp;base64,UklGRrIAAABXRUJQVlA4IKYAAACwBACdASoYABAAPu1iqU2ppaOiMAgBMB2JaACdMoFWAAN99ipKpG9yURsoXaAAAP6sBMKp89cBURJlpDI7qxqLRZyjQ/N5FgzybRbPe6CJDHhtpJTsVFWENePBy4MfMNlPEBrLdiiaiYaez2r75KuPMIcTDtklC56NePn5QmyZQf/xy2GQipLj+1Sjx52z5aVvV428KRZzInXnuvIEq6wy3QE0pAAA",
  },
  "tien-ich-04": {
    src: "/images/tien-ich-04.webp",
    width: 881,
    height: 584,
    alt: "Vườn trẻ em Kids Garden",
    blurDataURL:
      "data:image/webp;base64,UklGRrYAAABXRUJQVlA4IKoAAABwBACdASoYABAAPu1iqU2ppaOiMAgBMB2JYgCdMoM20+gaxY+8T2XXLe4WAAD9vu9fF3IW2HQyBE3HelCRT6Zkaw5n5KyjB6ts6OJKhXspZ5E9Lp/56eMlhTOARuIotc/29sG448sfn+WDdBGaj6Z9TZr/N6PD9rT/LBznyhyLC3covJEjjLf/7xQJzZM9jayqewyUeRYtqsvqGMO5hheBFmEKRTlcu2qgAA==",
  },
  "tien-ich-05": {
    src: "/images/tien-ich-05.webp",
    width: 1951,
    height: 1297,
    alt: "Cổng Babylon dẫn vào khu trò chơi cảm giác mạnh",
    blurDataURL:
      "data:image/webp;base64,UklGRrwAAABXRUJQVlA4ILAAAACwBACdASoYABAAPu1iqU2ppaOiMAgBMB2JYgC7IMhDgBoCQ19EH5QnC92ZX0sAAP40MTnECXhu+FLbg2bhZVwwIPE1IzUBc5kBkW4/Zjwcdyf9pC3vRnpbRMIrY7F7lywH5AibMeeSDhdVR0Ra/IpRGVghh4ndd5V1ga+wxSqexwwEK2gE2npx+jIRUNwCsCYwf+T+Hrr/UFhl3ZMyZXVHCg4VxPUhrRFSbQ9udWAAAA==",
  },
  "mat-bang-lien-ke-60": {
    src: "/images/mat-bang-lien-ke-60.webp",
    width: 2560,
    height: 1810,
    alt: "Mặt bằng nhà liền kề 60 m² (mẫu CH09.LK01A)",
    blurDataURL:
      "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAAAQBACdASoYABEAPuVeo02pJSMiMAwBIByJaQAAXiIWt0NT1vcEF/lfIAD+63Dp0C4fkl2uY/UVbwsZujmujTPJyEvsXe7SOhuwPZw+KWgX9F7sIm/7r16rXDwAAAAA",
  },
  "mat-bang-lien-ke-96": {
    src: "/images/mat-bang-lien-ke-96.webp",
    width: 2560,
    height: 1810,
    alt: "Mặt bằng nhà liền kề 96 m² (mẫu CH59.LK02A.BL06)",
    blurDataURL:
      "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAACQBACdASoYABEAPu1ip02ppSMiMAgBMB2JaQAAXiHmGUFHbIzOw0hjPmGtzqAA/ueXxeOCE0ioIIqLmNaGsaEdflT+fxvTPINXSF4TYO4NhO6LUlKU/eZgmYNkAAAA",
  },
  "mat-bang-song-lap-162": {
    src: "/images/mat-bang-song-lap-162.webp",
    width: 2560,
    height: 1810,
    alt: "Mặt bằng biệt thự song lập 162 m² (mẫu CH09.SLI01)",
    blurDataURL:
      "data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAABQBACdASoYABEAPulgpE2pJaMiMAwBIB0JaQAAXAZBSeOkTRVFCFsxoO+AAP7oRu1H6KdO/w69+wfhFNa/34WbhvNQWJZWX3SR3X7UWGf2wn8Xn5CAk5MhAXV6eyrksKAAAA==",
  },
  "san-pham-lien-ke": {
    src: "/images/san-pham-lien-ke.webp",
    width: 2560,
    height: 1705,
    alt: "Phối cảnh nhà liền kề",
    blurDataURL:
      "data:image/webp;base64,UklGRqgAAABXRUJQVlA4IJwAAABwBACdASoYABAAPu1iqU2ppaQiMAgBMB2JYgCdIExDMAn7TJPd/IKfLN8qYADiABH6wtTLBaDZMRB+4WalrG19XcNLg5NaS/o8IEAucsDUe7INOf0/lGcVJhDRI5BL2ZEO9tcJ5ZAG59v93u4AYJWygCQW0CMCWtuE2xW9CxncDLEgm/7e3dLsUawZv/xVbWLw7V3F7rDfzvpQgAA=",
  },
  "san-pham-don-lap": {
    src: "/images/san-pham-don-lap.webp",
    width: 2560,
    height: 1707,
    alt: "Phối cảnh biệt thự đơn lập",
    blurDataURL:
      "data:image/webp;base64,UklGRqIAAABXRUJQVlA4IJYAAABwBACdASoYABAAPu1iqU2ppaQiMAgBMB2JYgC1CHAgtBem+idzqKqYvHmEoAD+3pe7IbqraJw3e4zB5jNlVHDpz4K3SXeBOf42M8J2vJdOXWknLSfcOIABa2NoeqQqqFp8PQ6kQVVyiic3mqvWWdQit8uRkmwH3YlaUboN2ChmSjPmT4zpUk1k8S6ujuMKdOCS/ZwgAAA=",
  },
  "san-pham-song-lap": {
    src: "/images/san-pham-song-lap.webp",
    width: 2560,
    height: 1749,
    alt: "Phối cảnh biệt thự song lập",
    blurDataURL:
      "data:image/webp;base64,UklGRqoAAABXRUJQVlA4IJ4AAACQBACdASoYABAAPu1iqU2ppaOiMAgBMB2JZACdAywBzmrsol+MU/R+rkOSXwAA4V+ZxvuuzQD6bpMxYENSplNq2+wrlZM1al+/OvQrT9bIimVQj9Vlibc3MMgYvVov/QGj5fJUycpvltIoe0oKs8ChGvtxc5/o2zPs8t2fBRR342+Ff991VAGKmzb0oLAiGfByYATXSQxZpmqsRuiAAA==",
  },
  "san-pham-biet-thu-bien": {
    src: "/images/san-pham-biet-thu-bien.webp",
    width: 2560,
    height: 1705,
    alt: "Phối cảnh biệt thự hướng biển",
    blurDataURL:
      "data:image/webp;base64,UklGRqwAAABXRUJQVlA4IKAAAADQBACdASoYABAAPu1iqU2ppaOiMAgBMB2JZgC7MoAvQTOYxSb/Eqbaa22QS0P4AAD+3POGiuaRD3tHYIi/NS22Bw/9ooebK9XFxHjVnxAfap9k/l6mH0/tQtR94zmBuFDXb9dbnP39MocdltIkZ5QDhrLIhBCq4FQqtznMRbufNcEHVE61RAZd2VpCTNyI6G59lsvb4/Pe+uh+ev1nXFQA",
  },
  "cao-tang-01": {
    src: "/images/cao-tang-01.webp",
    width: 1391,
    height: 1024,
    alt: "Phối cảnh toà căn hộ cao tầng",
    blurDataURL:
      "data:image/webp;base64,UklGRqwAAABXRUJQVlA4IKAAAAAwBQCdASoYABIAPu1mqk+ppSOiMBgIATAdiWYArAAPRZJ7KeF0Vj0LeWjH8l4/z4txiADhK/ahbMK9wHEtKYP3Up6zaVTerj+UM1+Ke+pVy7p4A7Q1ZN/cFEiUvyRDSwlGtSadGCUwB6NQjdLdRGYV8kgeKn/IX9pHhybEOf54mNT9e+La9Wz3C/WG37DYUlmUkzuwZL6LTfhYt8J8AAAA",
  },
  "cao-tang-02": {
    src: "/images/cao-tang-02.webp",
    width: 2400,
    height: 2099,
    alt: "Phối cảnh quần thể căn hộ cao tầng",
    blurDataURL:
      "data:image/webp;base64,UklGRtQAAABXRUJQVlA4IMgAAABQBQCdASoYABUAPu1grFAppSQisBgIATAdiWQAnTLogYGCJTDKhRbOH6nQMEmiLlyFTwAA/uDG6ZaIsggupyo0RPojkrO/gm2H/xhtvwD0sKzjnzu0H/n6ltVZ0u3aYWXzdhfDRfYMHfXdJHtxxsceUsrTpGYCRmquQNFk/ZsxYlLDH64iiF2m7iToFy5h+wjONheIDjWYjWodzwsQcdKCGabPX+Q2xyT7r3Jj84dgh9rvvZj5ART863EGzJk81AgLBwnVwgAAAA==",
  },
  "vbm-hoan-thien-01": {
    src: "/images/vbm-hoan-thien-01.webp",
    width: 2560,
    height: 1434,
    alt: "Căn hoàn thiện tại Vịnh Bình Minh nhìn từ mặt phố",
    blurDataURL:
      "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAACQAwCdASoYAA0APu1iqU2ppaOiMAgBMB2JQBOkGxBWp3YtPCCAAP5UZiK+8uJ0pupzJPEKaK2DmlW+NeB1/aPWomoEf7OS2Qbd51w3XOgyVOyptJj24pSSUoe24gY198F6oAW6RW4DGIgAAAA=",
  },
  "vbm-hoan-thien-02": {
    src: "/images/vbm-hoan-thien-02.webp",
    width: 2560,
    height: 1440,
    alt: "Dãy nhà hoàn thiện tại Vịnh Bình Minh",
    blurDataURL:
      "data:image/webp;base64,UklGRpYAAABXRUJQVlA4IIoAAABQBACdASoYAA4APu1iqU2ppaOiMAgBMB2JZgCdIDfJtgJ/o0l3M1H6zKekAP62F7xt8KKfvX/qii1/P1UjrQq4LAvYN37M5n9pPVBa2/ZnKCbPrZ/WtbEoaeRXm0Ty8G+plkaCXipOsmy6LoIWWNE7s2uGa4EI6oE13f9ub/JJapf5KmFmCkAvwAA=",
  },
  "vbm-hoan-thien-03": {
    src: "/images/vbm-hoan-thien-03.webp",
    width: 2560,
    height: 1877,
    alt: "Mặt tiền căn hoàn thiện tại Vịnh Bình Minh",
    blurDataURL:
      "data:image/webp;base64,UklGRtAAAABXRUJQVlA4IMQAAABwBQCdASoYABIAPu1sq1EppaOiqAqpMB2JQBOmabLQAFO7cbsdYImWhjSULcr0lNDv2hwAAP7TWIt49XrD/ic7nb6m7wb820PVRDtlAcdyO0+RbUo4goX1MdRPNTHNVEhIELoxiW5C/ZTBsIKoAfuLytyR4BTy7NdTA7wnn7qrXcHOKOeBgalCKnJWSclWACUnwQJxQ6ZQhF+Xf83d8RSz3hUgSlr3arc/d2q3QrSIcfCUSZYDctKqJzBRkihUlRxgAAAA",
  },
  "vbm-hoan-thien-04": {
    src: "/images/vbm-hoan-thien-04.webp",
    width: 2560,
    height: 2560,
    alt: "Đường nội khu Vịnh Bình Minh nhìn từ tầm mắt người đi bộ",
    blurDataURL:
      "data:image/webp;base64,UklGRt4AAABXRUJQVlA4INIAAADwBQCdASoYABgAPu1sqk8ppiOiMBgIATAdiWgArDNofgHQrHYGNP9BXqmXu4j7HiGUZuqPPo1QwAD31maesbYTxV/mXAGnIXg4p4C1z4JBH7V/78sZlf+eUzhLxa8DBdtTVdFjAk7SPqS4+U2ELqD+A52cQ0sq3eM1LRNrk8FeSJpOoSIza40KrvL+Ppb3XQ6Cnm8z/s79jKj2Mqw5/knu8kwUX1La696nSJ9dStkG7W4pFp/jMGTDEiNbSpntPYilwp2MYIG6X4FdIBADB+08AAA=",
  },
  "vbm-lien-ke-goc-hai": {
    src: "/images/vbm-lien-ke-goc-hai.webp",
    width: 2560,
    height: 1539,
    alt: "Căn liền kề hoàn thiện nhìn từ góc thứ hai",
    blurDataURL:
      "data:image/webp;base64,UklGRrAAAABXRUJQVlA4IKQAAABwBACdASoYAA4APu1iqU2ppaQiMAgBMB2JaACdH8Aguxex5IjDB1e+sw+LgADiZmNq58ioWZWwVcFsZfO126jUbUXXGfX8flgVbKZTZOTtWdVMNOUvUyYrsmfqVGlyPaiBNx2B9Oa1C0bn5RoOuHbL8knrTB3vC4JDyxZruNaTmMkb3WvdtmyGGMjIaBIp7UIOvvP2Rz6rD+nwK1T3o4dvRCDAAA==",
  },
  "kien-truc-shophouse": {
    src: "/images/kien-truc-shophouse.webp",
    width: 2560,
    height: 1707,
    alt: "Kiến trúc căn shophouse mặt phố",
    blurDataURL:
      "data:image/webp;base64,UklGRqQAAABXRUJQVlA4IJgAAABwBACdASoYABAAPu1iqU2ppaOiMAgBMB2JYgCdL1yB05q1fBZ0s0bKxzQUAAD+jDI44ipJvwS+qd/Fl0m8Y9ukp+qBvJMpXIRGjb81G0kRpP9s4vdyD0LfmVThoz09MeovG2scytlyULWFe4WLQc5qFvQmM2LiHgqFgb22Zl+pncoojYVtmrYZbVb475KpllteC0lCE2ZAAA==",
  },
  "kien-truc-don-lap-02": {
    src: "/images/kien-truc-don-lap-02.webp",
    width: 2560,
    height: 1705,
    alt: "Biệt thự đơn lập nhìn từ phía sân vườn",
    blurDataURL:
      "data:image/webp;base64,UklGRr4AAABXRUJQVlA4ILIAAABwBACdASoYABAAPu1iqU2ppaOiMAgBMB2JZgCdBaglHdRnI0uOPWTIaExwAADiaMgyWogJZkUfoj6p9GzYMnBB6hVwaQfu9DL26E04pVVpMmcElhwJaPNx6H6ac6ZTMkpkAfdrCldJ1GHPxrJtrFaMwL3x5gXt8ud2wPcaaIXSwsYfvUXNmO25+vfXaIDGiSAKVjvbPOx/VTyA6fk48UDpPHfAM0/NBPA2l8aGPDn4c7gA",
  },
  "cao-tang-03": {
    src: "/images/cao-tang-03.webp",
    width: 1537,
    height: 1023,
    alt: "Chân đế khối căn hộ cao tầng",
    blurDataURL:
      "data:image/webp;base64,UklGRqgAAABXRUJQVlA4IJwAAACwBACdASoYABAAPu1iqU2ppaQiMAgBMB2JagCsLwABkJ4CPPTw0CuRkKsh0ulAAP6xjk9mNor/NATM2KKiHP3XuJmo7+ONDOxfttijg03dppbVtur/B+uDrhQ7uz4em0x8aDTwEksVNRYvWmEdgUx1zjSdSSfH620n2RgnMSYNzhgdYsjKMOyDSNkcynkOp2IIGsZrjCN2h7O4gAA=",
  },
  "tien-do-0826-toan-canh-vinh": {
    src: "/images/tien-do-0826-toan-canh-vinh.webp",
    width: 1554,
    height: 964,
    alt: "Toàn cảnh phần đất dự án nhìn từ trên cao giữa vịnh, tháng 08/2026",
    blurDataURL:
      "data:image/webp;base64,UklGRqgAAABXRUJQVlA4IJwAAACwBACdASoYAA8APu1iqU2ppaOiMAgBMB2JbACdMoR3Ff/gPfLNz+E3fKtNADAAAP6yOuvmpD8gmLu/gP/yGYcFY3YbGxSE3TfBD8s1LUhM7/2PoRIQgDRRHGuDa4y25Tudtp0dDFm7+Du9vo8aStM8zisWbgFcgqvSCZH7XcKY3lhMtUMznuMRrzME+yqJH4Q/Ka2OC7Jua+2wAAA=",
  },
  "tien-do-0826-san-lap-bien": {
    src: "/images/tien-do-0826-san-lap-bien.webp",
    width: 1459,
    height: 1009,
    alt: "Khu vực đang san lấp và tàu hút cát ngoài vịnh, tháng 08/2026",
    blurDataURL:
      "data:image/webp;base64,UklGRsAAAABXRUJQVlA4ILQAAABwBQCdASoYABEAPu1qqk8ppiOiMBgIATAdiWgAnTLiK2QloOiUBFUgLB+MhYZEOCxJS0rAAP5b/Ll7F9uTChJJbSBI9D7A5mUls1bhwzlebJDzIyM1XL4HEAOQ1X11lR3ezOJI9IUzXxD7VS6Exv6SoPN1YIdYyps0Glclu5/7NiJkXSBoKBNLduP/pm72V5hsevyh4Ctv6xeyrNuZMNlqVc3Pi3gH6b2bSqFL7Gx61lgAAAA=",
  },
  "tien-do-0826-duong-truc-ban-dao": {
    src: "/images/tien-do-0826-duong-truc-ban-dao.webp",
    width: 1471,
    height: 1011,
    alt: "Đường trục và cầu dẫn trên phần đất mới bồi đắp, tháng 08/2026",
    blurDataURL:
      "data:image/webp;base64,UklGRqYAAABXRUJQVlA4IJoAAADwBACdASoYABAAPu1iqU2ppaOiMAgBMB2JbACdMoMYOGNb/4DyFAfdpdlpFXZhvaAAy01y/fc97l1JmS3EE8QVgRhNiM3rJvxQxLjhX/GA6333qz5LKs8KXIrCPV6KLgm6SyD9SDrhkD/Ln1ENpVd9qFuxRqD0Up1f1l/CRLTTKA8fKzoNKRQzsjwYeKL6UxI2QQYF/pkU2UAA",
  },
  "tien-do-0826-san-nen-phan-lo": {
    src: "/images/tien-do-0826-san-nen-phan-lo.webp",
    width: 1568,
    height: 957,
    alt: "San nền và phân lô quanh hồ cảnh quan, tháng 08/2026",
    blurDataURL:
      "data:image/webp;base64,UklGRqoAAABXRUJQVlA4IJ4AAACwBACdASoYAA8APu1iqU2ppaOiMAgBMB2JbACdMoMYPX+z/4Dx4cUhvEyNn14AAP6yMPsJrueiuFDghXJengwCi39mV+SPBg5qU1JbApW8hSujDKplq+rhDVmYpP6JmFO069w0rb3SI0AhU2nv7n58Apjp+PKBTb1+F9aIAW3gdxxJ+80b9sTliX3FAr9cGOxXzXgYSVYf/xkGe7JYAA==",
  },
  "tien-do-0826-ha-tang-hoan-thien": {
    src: "/images/tien-do-0826-ha-tang-hoan-thien.webp",
    width: 1549,
    height: 957,
    alt: "Khu dân cư đã có đường trải nhựa và cây trồng, tháng 08/2026",
    blurDataURL:
      "data:image/webp;base64,UklGRpYAAABXRUJQVlA4IIoAAAAwBACdASoYAA8APu1kqU2ppaOiMAgBMB2JagCdEf/gPGS8aSggTohw75AA/sTU+l0lNN13SF75ag6ofwzFUdcqUXSZp+OLyhDca6CQAgeqYJm+BARHkYiYUDtFL/jBOVYtURYMkJc0Wv7bzgFoBZfe7FMqoOVPKX6fyA/7uTwAO7V6O5b3x2CmIAA=",
  },
  "tien-do-0826-toan-canh-khu-o": {
    src: "/images/tien-do-0826-toan-canh-khu-o.webp",
    width: 1568,
    height: 959,
    alt: "Toàn cảnh khu ở đã chia lô và làm xong hạ tầng, tháng 08/2026",
    blurDataURL:
      "data:image/webp;base64,UklGRqAAAABXRUJQVlA4IJQAAAAQBACdASoYAA8APu1iqU2ppaOiMAgBMB2JagCdL1ABomDFFHJNcH7gQAD+tf2rq5vR69I8q0SoAVS8Xmu6TFkvKSSjF4QQSU9BRevaBwgHpFrrK89u7/wP6vuKXq7+nKRB8AZL+0Ci3LJ7yDYsgWIvpuAJfJDSAvwVMpX39nnO0Pzk+1QjeqG/M8zt3t9hETMMAAAA",
  },
  "tien-do-0826-cong-trinh-mat-duong": {
    src: "/images/tien-do-0826-cong-trinh-mat-duong.webp",
    width: 1568,
    height: 966,
    alt: "Công trình thấp tầng đang thi công phần thân bên đường trục, tháng 08/2026",
    blurDataURL:
      "data:image/webp;base64,UklGRrIAAABXRUJQVlA4IKYAAACwBACdASoYAA8APu1iqU2ppaOiMAgBMB2JbACdMoGv/gNcp3xg6etlmOHfaVQAAPqJfb7GPt/uyxbUjnajTEHsxmhUcJuKEqXcUCBiiGVWfsElRz3bQG6tR/2LUN1liaXvdlmXgzCrqDZ2kUrUgh9DkI5hu1iw2dhpS6heEHnvoeKI8w+4AfsQtDpJUsAHoCjWqrW51RnQcOD3yT2H0kLSjX+6aIAA",
  },
  "tien-do-0826-dai-lo-cay-xanh": {
    src: "/images/tien-do-0826-dai-lo-cay-xanh.webp",
    width: 1568,
    height: 969,
    alt: "Hai khối công trình bên đại lộ đã trồng cây, tháng 08/2026",
    blurDataURL:
      "data:image/webp;base64,UklGRrQAAABXRUJQVlA4IKgAAAAQBACdASoYAA8APu1iqU2ppaOiMAgBMB2JbACdEfqgNnX7VpwcHU4/aAD92xMLW4iGPigrxZxWoJNLoPignHgUvkNYLSjH8W8mwUTk2QPo6TZCJp48GmHKRv2U5WzUdLD6ctLOoXDxFnMFNRMV15AFwjU7ivJRYbzyuATawWVo4DeGdM3BDkedl0KM1rLzjI/exKHLy49zLA7jQ3HG/nNV453I/7AAAAA=",
  },
  "tien-do-0826-len-tang": {
    src: "/images/tien-do-0826-len-tang.webp",
    width: 1568,
    height: 962,
    alt: "Ba khối công trình đang lên tầng, có cần cẩu và giàn giáo, tháng 08/2026",
    blurDataURL:
      "data:image/webp;base64,UklGRroAAABXRUJQVlA4IK4AAACQBACdASoYAA8APu1iqU2ppaOiMAgBMB2JbACdEftgNVeWTKHlWmjJMV8ejgAA4ZU5ZC2iocFauRE+GDg0tW2vvBG2VQRydaAu22SRct3ZDtQli5oGCVNdjdqezU6DFDVB4qOSg+aAVM92AgLsLgY7S3u7xYF8Od1jc+kSyV0bmpFCaAXAIST/ez40oM1s4KlZTxKB2C43IPb3cjySY4s3qshxFoi0ZX8eB40X1AA=",
  },
  "tien-do-0826-khu-thuong-mai": {
    src: "/images/tien-do-0826-khu-thuong-mai.webp",
    width: 1565,
    height: 963,
    alt: "Cụm công trình thương mại nhìn về phía thành phố Hạ Long, tháng 08/2026",
    blurDataURL:
      "data:image/webp;base64,UklGRqgAAABXRUJQVlA4IJwAAAAQBACdASoYAA8APu1iqU2ppaOiMAgBMB2JbACdO/7AwcAcJgy86wVlgADdA66C79n2uGd8XkcRogV2YkCv9kxmwszKSrowIdgJVjf5fm5ke6AEhi3BgCusbzXRfIuAoWqzlJHXEKNE0YYKVvkvcYqzgUVIEBbFePllpj+wK6jrWYud136vGsBIGfIZTM/CSzvHxDI9vd7ZJuawAAA=",
  },
  "tien-do-0826-cau-vuot-cao-toc": {
    src: "/images/tien-do-0826-cau-vuot-cao-toc.webp",
    width: 1567,
    height: 959,
    alt: "Thi công cầu bên tuyến cao tốc chạy qua dự án, tháng 08/2026",
    blurDataURL:
      "data:image/webp;base64,UklGRrIAAABXRUJQVlA4IKYAAABwBACdASoYAA8APu1iqU2ppaOiMAgBMB2JbACdMoADUFh9uCj9Z1Gc4/2ZAAD+xgO1jDhN3LhwcUOkKnoVcekJNLw2dLYEaktIRiNKEipyGGjMgrNAz/cMxrD/CADTpewRAxaqevXmcPrIvpPOJnek5+HE1LqHneGiXHeVfrUKgXwkfLtcIwSrMSSa5ZfYC2XKcn+/cRYmUtLFtl7JrdcR3h5q+AAA",
  },
  "tien-do-0826-coc-khoan-nhoi": {
    src: "/images/tien-do-0826-coc-khoan-nhoi.webp",
    width: 1568,
    height: 960,
    alt: "Giàn cọc khoan nhồi dọc tuyến cao tốc, tháng 08/2026",
    blurDataURL:
      "data:image/webp;base64,UklGRroAAABXRUJQVlA4IK4AAADQBACdASoYAA8APu1iqU2ppaOiMAgBMB2JbACdMoGv/i2O3bZRmmgMatxtQiMjgAD8jd4Qteerc19POLhqHEngvrnTnAbtHzha5pEDfJp2pu0AtKzNbXtiOhKewGjgVIvzwy4O0DsPewiJwdjvWYUqudCl15p2kAz8MiC8/5LHF1ZbElpWqQ5YvF4JWBb+F5OLCo31Usfbl/23omm5iZTMo29GqtKDt9/byBjAAAA=",
  },
  "khu-paradise-bay": {
    src: "/images/khu-paradise-bay.webp",
    width: 922,
    height: 830,
    alt: "Vị trí phân khu Vịnh Thiên Đường trên sơ đồ quy hoạch",
    blurDataURL:
      "data:image/webp;base64,UklGRpwAAABXRUJQVlA4IJAAAABwBACdASoYABYAPu1mqk8ppaOiMBgIATAdiUAYUAHanNUGkrBuH14hdcDPAAD+ow6yssS2TZVKxPOMr+BP4Iijs0e7y6z4fK6Vmgqk0cEqZs/E2Q1QCuVdrKoFU/X0ZYyH57XMhDR47MfxWl9mdpMqxUnqvtQIoC0o20jiUassphQzsNJD2NhxLzbq30AaAAA=",
  },
  "khu-wonder-island": {
    src: "/images/khu-wonder-island.webp",
    width: 922,
    height: 830,
    alt: "Vị trí phân khu Đảo Kỳ Quan trên sơ đồ quy hoạch",
    blurDataURL:
      "data:image/webp;base64,UklGRtQAAABXRUJQVlA4IMgAAADwBACdASoYABYAPu1mp02ppiOiMBgMATAdiWYAnQANwCEHUfMctX2VO0nGYCry0QAA9x8OQrKUPqkMp9ICKnpXuUHmm9UjFFQN9U6TglXBMQNZqMLIxCUMJpn0FR8jLXZuvKBIyKmTjKDs/qj5z+turPC8e1CD8UmSRyTJ/JCQSMBDlco/mTbBq4FaKtO4pDXbelNrtXxxNLtPryB2EUONqIkeeBn6RLpV4sAtnN/3dmLuisn9XZo3nDxKatRoZvyXMk9GWX0AAA==",
  },
  "khu-festa-bay": {
    src: "/images/khu-festa-bay.webp",
    width: 922,
    height: 830,
    alt: "Vị trí phân khu Vịnh Lễ Hội trên sơ đồ quy hoạch",
    blurDataURL:
      "data:image/webp;base64,UklGRtIAAABXRUJQVlA4IMYAAACQBQCdASoYABYAPu1cqE2ppKOiN/VYATAdiWIAnSEAiVRdgBmCFnQmkDGxhMNuEGbyAB/G0AD8h2rbO6FN+eRSPbaMosBkiTEWt3aumrvFwan0UIw9m7ZWVYfM/KmBQXYUF9Y9OjA6WBBPS6WZlvz5OV1kQXMM8zC8DiGhY5IWDL1aAGeVD94DNc360Puvc2v2tDPquZl+Lj6WRY0XE0JsF+/gWgJ5F1fhvIHhZ5I48q/+NIuBsVA5EzHsK15jXc9IoMwAAAA=",
  },
  "khu-elite-sport-island": {
    src: "/images/khu-elite-sport-island.webp",
    width: 922,
    height: 830,
    alt: "Vị trí phân khu Đảo Tinh Hoa Thể Thao trên sơ đồ quy hoạch",
    blurDataURL:
      "data:image/webp;base64,UklGRtoAAABXRUJQVlA4IM4AAADQBQCdASoYABYAPu1cqU4ppKOiMBgMATAdiWQAnTLT6QbAAbR23kOFPW+bEWrDrjU+SyyNd0ToAP5btDdfIEbGCen18g1042A2U4nJOvhQ3nFXLoUgAeO/lyJjIw/dECDTQ4de8sU6GKLrWZ4Ye5eNk9ULqyUo7aDIspEq4Q1BVCin+dHyjmI9zp6y/upTTySmsksA07bC8cLkFBL9DnadXlobl5RpduUDSlgANpaZ7mZ/QR0q4kM/XAuotKUNcI5LD6SPC/XFcvepTlsgAA==",
  },
  "khu-crystal-island": {
    src: "/images/khu-crystal-island.webp",
    width: 922,
    height: 830,
    alt: "Vị trí phân khu Đảo Pha Lê trên sơ đồ quy hoạch",
    blurDataURL:
      "data:image/webp;base64,UklGRuYAAABXRUJQVlA4INoAAADQBQCdASoYABYAPu1ur1IppiQiqAgBMB2JYgCdMxGyTCUbiY/1Y/TOF4u96YSApkPuP3Q45PiQAOHlpgRQ3XF7HLuQR+jYJtKaz/8A1VSMRE7uxQcuYgDD0esc1AVAGQ7q6dw3LQ4ey4W6YOpuM4Z1p9ZJWFHgNaxkITBzm7RLbf+Wq6nO9vxaWEjf+/aYo8+yQDwbeyc7tHQPx9WjFcttD3yXlar/sw+4OzZyfhsDgbz0J31ZYX+ADFGq7/BYyIkCzXyejmwj4fEWyP9xK9pJcFf9iPB8iagAAA==",
  },
  "khu-new-horizon-island": {
    src: "/images/khu-new-horizon-island.webp",
    width: 922,
    height: 830,
    alt: "Vị trí phân khu Đảo New Horizon trên sơ đồ quy hoạch",
    blurDataURL:
      "data:image/webp;base64,UklGRu4AAABXRUJQVlA4IOIAAACwBQCdASoYABYAPu1ur1IppiQiqAgBMB2JYgCdMoSCmBPukVbJOAkx0gkpUs0ry6xUjhXbhYAA3iLu5WHRI5VafLhqVKrc3xhAWc4GQccGpZAMvtb6AJQ9Atsn0K8LZJZ1AD6Hoh/GZBLseUzHQaNlnDTKpTyKVk8GmNZTGtMa8D8O8IFXbyPc/nAnhlSzwDnWuh7n5hnfKrAXFAMlcZj4aJTeKwH/p08HEF0WyMrkDzXa1KnGfrHqTMBBPrwLl2nRfisW8JhWiPWnDzPHs2QSBzQHNLnmQf1JEBF7KCFQAAAA",
  },
  "khu-elite-green-island": {
    src: "/images/khu-elite-green-island.webp",
    width: 922,
    height: 830,
    alt: "Vị trí phân khu Đảo Thượng Lưu Xanh trên sơ đồ quy hoạch",
    blurDataURL:
      "data:image/webp;base64,UklGRuAAAABXRUJQVlA4INQAAAAwBgCdASoYABYAPu1irVAppSQisBgIATAdiWgAnTKEgV33Rdg8rAgKPWCSmGXT9z0fFfPShCKdiTOAAP5bsVohHg0AMYGf9inuzkPnmvqoJQnCon+u5ORzf+jjHMiRCFIyKXAmZAk4Y3OLirfp0U+XqLTEmxz77QoxifKPL3ReoKVHBpnT5IZB6Ex739ZJSuX5DamioAIwm8qYzuPg7AxYZnHDdDJP89nXyuDKVykjJeHJsn6+kDokX8Ba7Cyh8b/u1qBEyGmGgaBqnOlPYxV/IQAAAA==",
  },
  "khu-green-energy-bay": {
    src: "/images/khu-green-energy-bay.webp",
    width: 922,
    height: 830,
    alt: "Vị trí phân khu Vịnh Năng Lượng Xanh trên sơ đồ quy hoạch",
    blurDataURL:
      "data:image/webp;base64,UklGRtwAAABXRUJQVlA4INAAAACwBQCdASoYABYAPu1irU4ppaSiKA1RMB2JbACdMuN/UBVjq4UAbZ3J+2k4WhOK0QtzqNFm+gAA/luxZU1aLQAt6hC6EFw4hw/LpZSfJtD9ZNjUnoRCto5GUGstxqv/p5/AHMcUCtFVeWJ2oxsEyuAQDJS3jGpueJ+KoJ4sqNspIYfIIz21++N0158iv2QoHzAxXOXyiehmpfm4QK4xkBHzLluoYhMFbl4OUBO6t3jF2iGJH3TCmYtLAQSTOFqJWAsx8rSWy2m/fritFToAAAAA",
  },
  "khu-diamond-island": {
    src: "/images/khu-diamond-island.webp",
    width: 922,
    height: 830,
    alt: "Vị trí phân khu Đảo Kim Cương trên sơ đồ quy hoạch",
    blurDataURL:
      "data:image/webp;base64,UklGRtoAAABXRUJQVlA4IM4AAABwBQCdASoYABYAPu1wsFIppiSiqAgBMB2JZgCdMt8BotfJ0JLBCwbJ+kaGwiJvJxokE0KQAPzLMJ6q17G3v8DU/vDgunwcl+AgNvPbZSyjkjJVOV4Far2F4tktnOCwsUvbEAKDE2J65zQeMs8P6vItqxMcaeOW6GQ9hu4sV6AByd40NUI5peB5ELlFWeoh/KWfDRdMzD6IRBMrJKRLo6+WJygjLtOHIRCzcYYFDNGvTHegmQD6aBTIGTYymS8r6QQ5ZxdRFzDkAZFO4nwAAA==",
  },
} as const satisfies Record<string, ProjectImage>;

export type ProjectImageName = keyof typeof projectImages;
