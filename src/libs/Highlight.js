// var sentence = '';

import axios from "axios";

const api = axios.create({
   baseURL: '//readapi.bluebirdabc.com'
});

// var word = '';
var maxLevelSentences, maxLevelWords, outStandardWords = ''
var css = '.sentence.chaogang .word { font-weight: 500; color: #000;  font-size: 20px;} .sentence .word.chaogang {font-weight: 600; color: #0eb30e;font-size: 20px;}.sentence .word.standard {color: #f44336;font-weight: 600;font-size: 20px;}.sentence.chaogang {color: blue;text-decoration: underline;font-weight: 600;position: relative;font-size: 20px;}mark {background: none; color: inherit;}.sentence.active *,.sentence.active {background-color: yellow !important;}.sentence .word.active *,.sentence .word.active {background-color: red !important;}';
var head = document.getElementsByTagName('head')[0];
var style = document.createElement('style');
style.type = 'text/css';
if (style.styleSheet) {
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}
head.appendChild(style);
// function insertSentence(str) {
//     var result = ''
//     var indexArr = []
//     str.replace(/[\.|\?|!|\！|\？|\。]<\/mark\>/g, function (m, index) {
//         indexArr.push(index)
//     })
//     result = str.replace(/[\.|\?|!|！|？|。]<\/mark\>/g, function (m, index) {
//         var res = ''
//         if (index === indexArr[indexArr.length - 1]) {
//             res = m + '</mark>'
//             return res
//         } else {
//             res = m + '</mark><mark class="sentence">'
//         }
//         return res
//     })
//     const gi = new RegExp(/^<script|<style|<link|<img|<button/gi)
//     if (gi.test(result)) {
//         result = result.slice(0, result.indexOf('<mark class="word">')) + '<mark class="sentence">' + result.slice(result.indexOf('<mark class="word">'));
//         return result
//     } else {
//         return '<mark class="sentence">' + result
//     }

// }
function nodeValueDispose(txt) {
    var arr = [];
    return new Promise((resolve) => {
        api.post("/util/split", encodeURIComponent(txt), {headers:{'Content-Type':'text/plain; charset=UTF-8'}})
            .then(res => {
            var data = res.data.filter(function (item) { return item !== '' })
            const wrappedArr = data.map(item => {
                const words = item.split(/\s/);
                const wrappedWords = words.map(word => `<mark class="word">${word}</mark>`);
                return `<mark class="sentence">${wrappedWords.join(' ')}</mark> `;
            });

            const wrappedString = wrappedArr.join('');
            resolve(wrappedString)
        }).catch(() => {
            var regexString = "(?<!\\w\\.\\w.)(?<![A-Z][a-z]\\.)(?<![A-Z]\\.)(?<=\\.|\\?|\\.\"|\\.”|\\。|\\。”|\\？”|\\？”)\\s(?!\\w+ (?:said|asked|said to|told|ask)\\b)";
            var regex1 = new RegExp(regexString, "g");
            var regex2 = new RegExp(regexString);
            txt.replace(regex1, function (m) {
                arr.push(m);
            });
            // eslint-disable-next-line no-useless-escape
            var data = txt.split(regex2).filter(function (item) { return item !== '' })

            const wrappedArr = data.map(item => {
                const words = item.split(/\s/);
                const wrappedWords = words.map(word => `<mark class="word">${word}</mark>`);
                return `<mark class="sentence">${wrappedWords.join(' ')}</mark> `;
            });

            const wrappedString = wrappedArr.join('');
            resolve(wrappedString)
        })
    })
}

function geSentence(el) {
    if (el.parentNode.className.indexOf('sentence') >= 0) {
        return el.parentNode;
    } else {
        return geSentence(el.parentNode)
    }
}

async function eachNode(node) {
    var result = ''
    if (node.childNodes && node.childNodes.length > 0) {
        for (var i = 0; i < node.childNodes.length; i++) {
            var item = node.childNodes[i]
            if (item.nodeType === 1) {
                var sr = ["A", "BUTTON", "IMG", "STYLE", "LINK", "SCRIPT"].indexOf(item.tagName) >= 0
                if (!sr) {
                    var className = item.getAttribute('class') ? ' class="' + item.getAttribute('class') + '"' : ''
                    var htmlTagStart = '<' + item.nodeName.toLowerCase() + className + (item.getAttribute('style') ? ' style="' + item.getAttribute('style') + '"' : '') + '>';
                    var htmlTagEnd = '</' + item.nodeName.toLowerCase() + '>';
                    if (!["A", "BUTTON", "IMG", "STYLE", "LINK", "SCRIPT"].indexOf(item.tagName) >= 0) {
                        result += htmlTagStart + await eachNode(item) + htmlTagEnd
                    } else {
                        result += item.outerHTML
                    }
                } else {
                    result += item.outerHTML
                }
            } else if (item.nodeType === 3) {
                const val = await nodeValueDispose(item.nodeValue)
                result += val;
            }
        }
    } else {
        result = node.outerHTML
    }
    return result
}

var isAcitve = false
function siblings(n, elem) {
    var matched = [];
    for (; n; n = n.nextSibling) {
        if (n.nodeType === 1 && n !== elem && n.nodeName !== 'STYLE' && n.nodeName !== 'SCRIPT' && n.nodeName !== 'A' && n.nodeName !== 'BUTTON' && n.nodeName !== 'IMG' && n.nodeName !== 'LINK') {
            matched.push(n);
        }
    }
    return matched;
}
function removeActive() {
    if (!isAcitve) {
        for (let i = 0; i < document.getElementsByClassName('word').length; i++) {
            let item = document.getElementsByClassName('word')[i]
            if (item.tagName !== 'MARK') {
                break
            }
            item.classList.remove("active")
            if (item.parentNode.className.indexOf('sentence') >= 0) {
                item.parentNode.classList.remove("active")
            } else {
                geSentence(item).classList.remove("active")
            }
        }

    } else {
        for (let i = 0; i < document.getElementsByClassName('word').length; i++) {
            let item = document.getElementsByClassName('word')[i]
            if (item.tagName !== 'MARK') {
                break
            }
            item.classList.remove("active")
            if (item.parentNode.className.indexOf('sentence') >= 0) {
                item.parentNode.classList.remove("active")
            } else {
                geSentence(item).classList.remove("active")
            }
        }
        isAcitve = false
    }
}
async function Highlight(root, a, b, c) {
    maxLevelSentences = a;
    maxLevelWords = b;
    outStandardWords = c;
    var element = siblings(root.firstChild)
    for (var z = 0; z < element.length; z++) {
        if (element[z].innerText) {
            element[z].innerHTML = await eachNode(element[z])
        }
    }
    for (let i = 0; i < document.getElementsByClassName('sentence').length; i++) {
        let item = document.getElementsByClassName('sentence')[i]
        if (maxLevelSentences.includes(item.innerText)) {
            item.classList.add('chaogang')
        }
    }
    for (let i = 0; i < document.getElementsByClassName('word').length; i++) {
        let item = document.getElementsByClassName('word')[i]
        if (maxLevelWords.includes(item.textContent)) {
            item.classList.add('chaogang')
        }
        if (outStandardWords.includes(item.textContent)) {
            item.classList.add('standard')
        }
        item.onclick = function () {
            this.classList.add("active")
            if (this.parentNode.className.indexOf('sentence') >= 0) {
                this.parentNode.classList.add("active")
            } else {
                geSentence(this).classList.add("active")
            }
            isAcitve = true
        }
    }
}

export {
    Highlight,
    removeActive
}