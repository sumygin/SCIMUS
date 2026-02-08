

let qElementList = ["stage", "subject", "topic", "tag", "qname", "qtext", "mstext"]
let elData = {}

for (el of qElementList) {
    elData[el] = document.getElementById(el)
}

let qID = window.location.href.split("/question")[1].substring(1)
if (isNaN(Number(qID))) qID = -1
if (qID == "") qID = 0